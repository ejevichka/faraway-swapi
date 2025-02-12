import * as z from "zod";

const API_URL = "https://swapi.dev/api/people/";

// Define a schema for a Star Wars character
export const PersonSchema = z.object({
  name: z.string(),
  height: z.string(),
  mass: z.string(),
  hair_color: z.string(),
  skin_color: z.string(),
  eye_color: z.string(),
  birth_year: z.string(),
  gender: z.string(),
  homeworld: z.string(),
  films: z.array(z.string()),
  species: z.array(z.string()),
  vehicles: z.array(z.string()),
  starships: z.array(z.string()),
  created: z.string(),
  edited: z.string(),
  url: z.string(),
});

export type TPerson = z.infer<typeof PersonSchema>;

// Schema for API response with pagination support
export const PeopleResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(PersonSchema),
});

export type TPeopleResponse = z.infer<typeof PeopleResponseSchema>;

// Fetch characters from the SWAPI People API with pagination
export const fetchPeople = async (page: number = 1): Promise<TPeopleResponse> => {
  const res = await fetch(`${API_URL}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch people: ${res.statusText}`);
  }

  const data = await res.json();
  return PeopleResponseSchema.parse(data); // Validate data using Zod schema
};

// Example usage: Fetch the first page of Star Wars characters
(async () => {
  try {
    const peopleData = await fetchPeople();
  } catch (error) {
    console.error("Error fetching Star Wars people:", error);
  }
})();
