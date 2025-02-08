import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useState, useEffect } from "react";
import cache from "~/utils/cache";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { TPeopleResponse, TPerson } from "~/lib/api";

const API_URL = "https://swapi.dev/api/people/";

type DetailPageProps = {
  characterDetails: TPerson | null;
};

export const getStaticPaths: GetStaticPaths = async () => {
  let allPaths: { params: { chain: string; address: string } }[] = [];
  let nextUrl = `${API_URL}`; // Initial URL for fetching people

  try {
    // Loop to fetch all pages
    while (nextUrl) {
      const response = await fetch(nextUrl);
      const peopleData: TPeopleResponse = await response.json();

      // Generate paths for the current page of results
      const paths = peopleData.results.map((person) => ({
        params: {
          chain: "1", // Assuming chain is not used, adjust if needed
          address: person.url.split("/").pop() || "", // Use the last part of the URL as the address (ID)
        },
      }));

      allPaths = [...allPaths, ...paths];

      // If there's a next page, set the URL for the next page, otherwise exit loop
      nextUrl = peopleData.next;
    }

    return {
      paths: allPaths,
      fallback: "blocking", // ISR
    };
  } catch (error) {
    console.error("Error fetching people:", error);
    return {
      paths: [],
      fallback: "blocking", // ISR
    };
  }
};

export const getStaticProps: GetStaticProps<DetailPageProps> = async ({
  params,
}) => {
  try {
    const { address } = params as { chain: string; address: string };

    // Fetch the specific person based on the address (which is the character's ID)
    const response = await fetch(`${API_URL}${address}/`);
    const characterDetails: TPerson = await response.json();

    return {
      props: {
        address: address,
        characterDetails: characterDetails || null,
      },
      revalidate: 60, // ISR
    };
  } catch (error) {
    console.error("Error fetching token or character details:", error);
    return { notFound: true };
  }
};

const TokenDetailPage = ({
  characterDetails,
  address,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [editableCharacterDetails, setEditableCharacterDetails] =
    useState<TPerson | null>(null);

  useEffect(() => {
    // Load character details from localStorage
    const savedCharacterDetails = cache.get(`characterDetails-${address}`);

    if (savedCharacterDetails) {
      // If character details are in localStorage, use them
      setEditableCharacterDetails(savedCharacterDetails);
    } else {
      // If not, make the API request and save to localStorage
      if (characterDetails) {
        setEditableCharacterDetails(characterDetails);
        cache.set(`characterDetails-${address}`, characterDetails);
      }
    }
  }, [address, characterDetails]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof TPerson,
  ) => {
    if (editableCharacterDetails) {
      setEditableCharacterDetails({
        ...editableCharacterDetails,
        [field]: e.target.value,
      });
    }
  };

  const handleSaveChanges = () => {
    if (editableCharacterDetails) {
      cache.set(`characterDetails-${address}`, editableCharacterDetails);
      alert("Changes saved!");
    }
  };

  if (!editableCharacterDetails) {
    return (
      <div className="mx-auto max-w-2xl p-4">
        <h1 className="mb-4 text-3xl font-bold">{characterDetails?.name}</h1>
        <p>Character details</p>
      </div>
    );
  }

  return (
    <div className="mesh3D">
      <div className="mx-auto max-w-2xl p-4">
        <Card className="mb-4">
          <CardContent>
            <Typography variant="h5" component="h2" className="mb-4">
              {editableCharacterDetails.name}
            </Typography>
          </CardContent>
        </Card>

        {/* Editable character details */}
        <Card>
          <CardContent>
            <Typography variant="h6" component="h3" className="mb-4">
              Character Details
            </Typography>
            <TextField
              label="Name"
              value={editableCharacterDetails.name}
              onChange={(e) => handleInputChange(e, "name")}
              fullWidth
              variant="outlined"
              className="mb-4"
            />
            <TextField
              label="Height"
              value={editableCharacterDetails.height}
              onChange={(e) => handleInputChange(e, "height")}
              fullWidth
              variant="outlined"
              className="mb-4"
            />
            <TextField
              label="Mass"
              value={editableCharacterDetails.mass}
              onChange={(e) => handleInputChange(e, "mass")}
              fullWidth
              variant="outlined"
              className="mb-4"
            />
            <TextField
              label="Gender"
              value={editableCharacterDetails.gender}
              onChange={(e) => handleInputChange(e, "gender")}
              fullWidth
              variant="outlined"
              className="mb-4"
            />
            <TextField
              label="Birth Year"
              value={editableCharacterDetails.birth_year}
              onChange={(e) => handleInputChange(e, "birth_year")}
              fullWidth
              variant="outlined"
              className="mb-4"
            />
            <TextField
              label="Hair Color"
              value={editableCharacterDetails.hair_color}
              onChange={(e) => handleInputChange(e, "hair_color")}
              fullWidth
              variant="outlined"
              className="mb-4"
            />
            <TextField
              label="Eye Color"
              value={editableCharacterDetails.eye_color}
              onChange={(e) => handleInputChange(e, "eye_color")}
              fullWidth
              variant="outlined"
              className="mb-4"
            />
            <Button
              onClick={handleSaveChanges}
              variant="contained"
              color="primary"
              className="mt-4"
            >
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Button
          variant="contained"
          color={isFavorite ? "secondary" : "primary"}
          className="mt-4"
        >
          {isFavorite ? "Unmark as Favorite" : "Mark as Favorite"}
        </Button>
      </div>
    </div>
  );
};

export default TokenDetailPage;
