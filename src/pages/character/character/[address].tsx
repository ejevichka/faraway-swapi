import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import cache from "~/utils/cache";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { TPeopleResponse, TPerson } from "~/lib/api";
import { StyledButton } from "~/components/styled-components-lib/EmotionStyledComponents";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type DetailPageProps = {
  characterDetails: TPerson | null;
  address: string;
};

export const getStaticPaths: GetStaticPaths = async () => {
  let allPaths: { params: { address: string } }[] = [];
  let nextUrl = process.env.NEXT_PUBLIC_API_URL; // Use your env variable

  try {
    while (nextUrl) {
      const response = await fetch(nextUrl);
      const peopleData: TPeopleResponse = await response.json();

      // Generate paths using only "address"
      const paths = peopleData.results
        .map((person) => {
          // Extract the address from the URL
          const address = person.url.split("/").slice(-2, -1)[0];
          return address ? { params: { address } } : null;
        })
        .filter(Boolean) as { params: { address: string } }[];

      allPaths = [...allPaths, ...paths];

      if (peopleData.next) {
        nextUrl = peopleData.next;
      } else {
        break;
      }
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
    // Only extract the "address" parameter
    const { address } = params as { address: string };

    // Fetch the specific person using the provided address
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${address}/`,
    );
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

const DetailPage = ({
  characterDetails,
  address,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [editableCharacterDetails, setEditableCharacterDetails] =
    useState<TPerson | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const router = useRouter();

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
      cache.set(
        `characterDetails-${address}`,
        editableCharacterDetails as TPerson,
      );
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
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
    <div className="mesh3D min-h-screen">
      <div className="mx-auto max-w-2xl p-4 p-4">
        <StyledButton
          onClick={() => router.push("/")}
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
        >
          Back to List
        </StyledButton>
      </div>
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
            <Typography variant="h6" component="h3" sx={{ mb: 4 }}>
              Character Details
            </Typography>
            <TextField
              label="Name"
              value={editableCharacterDetails.name}
              onChange={(e) =>
                handleInputChange(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "name",
                )
              }
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Height"
              value={editableCharacterDetails.height}
              onChange={(e) =>
                handleInputChange(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "height",
                )
              }
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Mass"
              value={editableCharacterDetails.mass}
              onChange={(e) =>
                handleInputChange(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "mass",
                )
              }
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Gender"
              value={editableCharacterDetails.gender}
              onChange={(e) =>
                handleInputChange(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "gender",
                )
              }
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Birth Year"
              value={editableCharacterDetails.birth_year}
              onChange={(e) =>
                handleInputChange(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "birth_year",
                )
              }
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Hair Color"
              value={editableCharacterDetails.hair_color}
              onChange={(e) =>
                handleInputChange(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "hair_color",
                )
              }
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Eye Color"
              value={editableCharacterDetails.eye_color}
              onChange={(e) =>
                handleInputChange(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "eye_color",
                )
              }
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <StyledButton
              onClick={handleSaveChanges}
              variant="contained"
              color="primary"
              sx={{ mb: 2 }}
            >
              Save Changes
            </StyledButton>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={handleSnackbarClose}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert
                onClose={handleSnackbarClose}
                severity="success"
                sx={{ width: "100%" }}
              >
                Changes saved!
              </Alert>
            </Snackbar>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DetailPage;
