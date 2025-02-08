import React, { useState, useMemo, useEffect } from "react";
import cache from "~/utils/cache";
import {
  FixedSizeList as List,
  type ListChildComponentProps,
} from "react-window";
import { TPerson } from "~/lib/api";
import CharacterRow from "~/components/character-list/Row";
import { gsap } from "gsap-trial";

const CharacterList = ({ data }: { data: TPerson[] }) => {
  const [filter, setFilter] = useState<string>(""); // Filter by gender
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [containerHeight, setContainerHeight] = useState<number>(600);

  // Move GSAP flair setup inside a useEffect so it runs after mount
  useEffect(() => {
    // Set the position of any element with class "flair"
    gsap.set(".flair", { xPercent: -50, yPercent: -50 });
    // Create quick setters for x and y
    const xTo = gsap.quickTo(".flair", "x", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(".flair", "y", { duration: 0.6, ease: "power3" });

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Set container height to the window height (100vh)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setContainerHeight(window.innerHeight);
    }
  }, []);

  // Load favorite characters from cache
  useEffect(() => {
    const favoriteCharacters = cache.get("favoriteCharacters") || new Set();
    setFavorites(favoriteCharacters);
  }, []);

  // Caching filtered and sorted data
  const filteredAndSortedData = useMemo(() => {
    const cacheKey = `filteredAndSortedData-${filter}-${Array.from(favorites).join("-")}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const filteredCharacters = data.filter(
      (character) =>
        !filter || character.gender.toLowerCase() === filter.toLowerCase(),
    );

    const favoriteCharacters = filteredCharacters.filter((character) =>
      favorites.has(character.url),
    );
    const nonFavoriteCharacters = filteredCharacters.filter(
      (character) => !favorites.has(character.url),
    );

    const result = [...favoriteCharacters, ...nonFavoriteCharacters];

    // Store the result in cache
    cache.set(cacheKey, result);

    return result;
  }, [data, filter, favorites]);

  // Row renderer for react-window
  const renderRow = ({ index, style }: ListChildComponentProps) => {
    const character = filteredAndSortedData[index];
    const isFavorite = character ? favorites.has(character.url) : false;
    // Overwrite the height to use containerHeight (100vh)
    const rowStyle = { ...style, height: containerHeight };
    return (
      <CharacterRow
        index={index}
        style={rowStyle}
        data={character as TPerson}
        isFavorite={isFavorite}
      />
    );
  };

  return (
    <>
      <div className="controls">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          data-testid="gender-filter"
          className="m-2 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:inline-block sm:w-auto sm:text-sm"
        >
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="n/a">Droid</option>
        </select>
      </div>
      {/* Wrap the List in a container with a known ID to act as the scroller */}
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
