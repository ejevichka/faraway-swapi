// components/TubeExperience.tsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap-trial/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TubeExperience: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ww = window.innerWidth;
    const wh = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    renderer.setSize(ww, wh);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // --- Scene ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x194794, 0, 100);

    // --- Clock ---
    const clock = new THREE.Clock();

    const camera = new THREE.PerspectiveCamera(45, ww / wh, 0.001, 200);
    const cameraGroup = new THREE.Group();
    cameraGroup.add(camera);
    scene.add(cameraGroup);

    const pointsArray = [
      [10, 89, 0],
      [50, 88, 10],
      [76, 139, 20],
      [126, 141, 12],
      [150, 112, 8],
      [157, 73, 0],
      [180, 44, 5],
      [207, 35, 10],
      [232, 36, 0],
    ];
    const points = pointsArray.map(
      (pt) => new THREE.Vector3(pt[0], pt[2], pt[1]),
    );
    const path = new THREE.CatmullRomCurve3(points);
    path.tension = 0.5;

    const tubeGeometry = new THREE.TubeGeometry(path, 300, 4, 32, false);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/68819/3d_space_5.jpg",
      (tex) => {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(15, 2);
      },
    );
    const bumpTexture = textureLoader.load(
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/68819/waveform-bump3.jpg",
      (tex) => {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(15, 2);
      },
    );
    const tubeMaterial = new THREE.MeshPhongMaterial({
      side: THREE.BackSide,
      map: texture,
      shininess: 20,
      bumpMap: bumpTexture,
      bumpScale: -0.03,
      specular: 0x0b2349,
    });

    // --- Tube Mesh ---
    const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
    scene.add(tubeMesh);

    // --- Inner Tube Wireframe ---
    const innerTubeGeometry = new THREE.TubeGeometry(path, 150, 3.4, 32, false);
    const edges = new THREE.EdgesGeometry(innerTubeGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({
      linewidth: 2,
      opacity: 0.2,
      transparent: true,
    });
    const wireframe = new THREE.LineSegments(edges, lineMaterial);
    scene.add(wireframe);

    // --- Lighting ---
    const light = new THREE.PointLight(0xffffff, 0.35, 4, 0);
    light.castShadow = true;
    scene.add(light);

    // --- Postprocessing Composer (for Bloom) ---
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(ww, wh),
      1.5,
      0.4,
      0.85,
    );
    bloomPass.renderToScreen = true;
    bloomPass.threshold = 0;
    bloomPass.strength = 0.9;
    bloomPass.radius = 0;
    const composer = new EffectComposer(renderer);
    composer.setSize(ww, wh);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // --- Camera Path Animation ---
    // A helper function that updates cameraGroup position & orientation along the tube
    const updateCameraPercentage = (percentage: number) => {
      const p1 = path.getPointAt(percentage);
      const p2 = path.getPointAt(percentage + 0.03);
      cameraGroup.position.set(p1.x, p1.y, p1.z);
      cameraGroup.lookAt(p2);
      light.position.set(p2.x, p2.y, p2.z);
    };

    let cameraTargetPercentage = 0;
    let currentCameraPercentage = 0;

    const tubePerc = { percent: 0 };
    gsap.to(tubePerc, {
      percent: 0.96,
      ease: "linear",
      duration: 10,
      scrollTrigger: {
        trigger: ".scrollTarget",
        start: "top top",
        end: "bottom 100%",
        scrub: 5,
        markers: false,
      },
      onUpdate: () => {
        cameraTargetPercentage = tubePerc.percent;
      },
    });

    function renderLoop() {
      currentCameraPercentage = cameraTargetPercentage;
      updateCameraPercentage(currentCameraPercentage);
      composer.render();
      requestAnimationFrame(renderLoop);
    }
    renderLoop();

    function onWindowResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      composer.setSize(width, height);
    }
    window.addEventListener("resize", onWindowResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="experience"></canvas>;
};

export default TubeExperience;
