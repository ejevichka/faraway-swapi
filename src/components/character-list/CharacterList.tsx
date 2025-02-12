import React, { useState, useMemo, useEffect } from "react";
import cache from "~/utils/cache";
import {
  FixedSizeList as List,
  type ListChildComponentProps,
} from "react-window";
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

  // Set container height to window height (100vh)
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
      data.forEach((character) => {
        const address = character.url.split("/").slice(-2, -1)[0]; // Extract address from the URL
        const savedCharacterDetails = cache.get(`characterDetails-${address}`);
        if (savedCharacterDetails && address !== undefined) {
          // Overwrite the character if there is cached data.
          // (You might want a more robust merge/update strategy in a real app.)
          const index = parseInt(address, 10) - 1;
          filteredCharacters[index] = savedCharacterDetails;
        }
      });
    }
    return filteredCharacters;
  }, [data, filter, isClient]);

  // Extracted row renderer using CharacterListRow
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
        <List
          height={containerHeight}
          itemCount={filteredAndSortedData.length}
          itemSize={containerHeight}
          width="100%"
        >
          {renderRow}
        </List>
      </div>
    </>
  );
};

export default CharacterList;
