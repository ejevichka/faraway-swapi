import React, { useState, useMemo, useEffect } from "react";
import cache from "~/utils/cache";
import { FixedSizeList, type ListChildComponentProps } from "react-window";
import { TPerson } from "~/lib/api";
import { gsap } from "gsap-trial";
import CharacterListRow from "./RenderRow";

const CharacterList = ({
  data,
  filter,
}: {
  data: TPerson[];
  filter: string;
}) => {
  const [containerHeight, setContainerHeight] = useState<number>(200);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    gsap.set(".flair", { xPercent: -50, yPercent: -50 });
    const xTo = gsap.quickTo(".flair", "x", { duration: 1.3, ease: "power3" });
    const yTo = gsap.quickTo(".flair", "y", { duration: 0.9, ease: "power3" });

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setContainerHeight(window.innerHeight);
    }
  }, []);

  const filteredAndSortedData = useMemo(() => {
    const filteredCharacters = data.filter(
      (character) =>
        !filter || character.gender.toLowerCase() === filter.toLowerCase(),
    );

    if (isClient) {
      data.forEach((_character, index) => {
        const savedCharacterDetails = cache.get(`${index + 1}`) as TPerson;
        if (savedCharacterDetails) {
          filteredCharacters[index] = savedCharacterDetails;
        }
      });
    }
    return filteredCharacters;
  }, [data, filter, isClient]);

  const renderRow = ({ index, style }: ListChildComponentProps) => {
    const character = filteredAndSortedData[index];
    const rowStyle = { ...style, height: containerHeight };
    return (
      <CharacterListRow
        index={index}
        style={rowStyle}
        character={character as TPerson}
      />
    );
  };

  return (
    <>
      <div
        id="list-scroller"
        style={{ overflow: "auto", height: "100vh", marginTop: "400px" }}
      >
        <div className="flair flair--3"></div>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <FixedSizeList
          height={containerHeight}
          itemCount={filteredAndSortedData.length}
          itemSize={containerHeight}
          width="100%"
        >
          {renderRow}
        </FixedSizeList>
      </div>
    </>
  );
};

export default CharacterList;
