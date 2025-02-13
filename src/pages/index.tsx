import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import CharacterList from "../components/character-list/CharacterList";
import { fetchPeople, TPerson, TPeopleResponse } from "~/lib/api";
import type { InferGetStaticPropsType, GetStaticProps } from "next";
import {
  StyledButton,
  StyledInput,
  StyledSelect,
} from "~/components/styled-components-lib/EmotionStyledComponents";
import { FormControl, InputLabel, MenuItem } from "@mui/material";

// Dynamically import TubeExperience so it only loads on the client
const TubeExperience = dynamic(() => import("../components/tube/Tube"), {
  ssr: false,
});

export const getStaticProps: GetStaticProps<{
  data: TPeopleResponse;
  error?: string;
}> = async () => {
  try {
    const data = await fetchPeople(1);
    return {
      props: {
        data,
      },
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      props: {
        data: { count: 0, results: [], next: null, previous: null },
        error: error instanceof Error ? error.message : String(error),
      },
    };
  }
};

const HomePage = ({
  data,
  error,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [characters, setCharacters] = useState<TPerson[]>(data.results);
  const [next, setNext] = useState<string | null>(data.next);
  const [previous, setPrevious] = useState<string | null>(data.previous);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filter, setFilter] = useState<string>("");

  // Handle pagination
  const loadPage = async (url: string | null) => {
    if (!url) return;

    try {
      const response = await fetch(url);
      const data: TPeopleResponse = await response.json();
      setCharacters(data.results);
      setNext(data.next);
      setPrevious(data.previous);
    } catch (error) {
      console.error("Pagination error:", error);
    }
  };

  // Handle search query and filter the characters
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value === "") {
      setCharacters(data.results);
    } else {
      const filtered = data.results.filter((character) =>
        character.name.toLowerCase().includes(e.target.value.toLowerCase()),
      );
      setCharacters(filtered);
    }
  };

  return (
    <div className=" bg-black">
      <TubeExperience />

      <h1 className="text-neonGreen mt-8 text-center text-4xl font-extrabold text-white">
        Star Wars Characters
      </h1>
      {error ? (
        <p className="mt-4 text-center text-red-500">Error: {error}</p>
      ) : (
        <>
          <div className="fixed left-0 right-0 top-[60px] z-50 flex flex-col items-center space-y-4">
            <div className="flex w-full justify-center">
              <StyledInput
                label="Search Characters"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-1/3"
              />
            </div>
            <div className="controls flex w-full justify-center">
              <div className="w-full rounded-lg bg-white p-8 shadow-lg sm:w-1/3">
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                  <StyledSelect
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as string)}
                    label="Gender"
                  >
                    <MenuItem value="">All Genders</MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="n/a">Droid</MenuItem>
                  </StyledSelect>
                </FormControl>
              </div>
            </div>
          </div>

          <CharacterList data={characters} filter={filter} />

          <div className="mt-4 flex justify-between">
            {previous && (
              <StyledButton
                onClick={() => loadPage(previous)}
                className="rounded bg-blue-500 p-2 text-white"
              >
                Previous
              </StyledButton>
            )}

            {next && (
              <StyledButton
                onClick={() => loadPage(next)}
                className="rounded bg-blue-500 p-2 text-white"
              >
                Next
              </StyledButton>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
