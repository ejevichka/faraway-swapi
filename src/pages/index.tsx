import React from "react";
import dynamic from "next/dynamic";
import CharacterList from "../components/character-list/CharacterList";
import { fetchPeople, TPerson } from "~/lib/api";
import type { InferGetStaticPropsType, GetStaticProps } from "next";

// Dynamically import TubeExperience so it only loads on the client
const TubeExperience = dynamic(() => import("../components/tube/Tube"), {
  ssr: false,
});

export const getStaticProps: GetStaticProps<{
  data: TPerson[];
  error?: string;
}> = async () => {
  try {
    const tokensArray = await fetchPeople();
    return {
      props: {
        data: tokensArray,
      },
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      props: {
        data: [],
        error: error instanceof Error ? error.message : String(error),
      },
    };
  }
};

const HomePage = ({
  data,
  error,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div>
      {/* Render the TubeExperience component (client only) */}
      <TubeExperience />
      <h1>Characters</h1>
      <div>
        {error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <CharacterList data={data.results} />
        )}
      </div>

      <style jsx global>{`
        body {
          margin: 0;
          background: black;
          color: white;
          overflow-x: hidden;
        }
        .experience {
          position: fixed;
          top: 0;
          left: 0;
          z-index: -1;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
