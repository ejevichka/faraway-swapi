import React from "react";
import Link from "next/link";
import { Card, CardContent, Typography } from "@mui/material";
import { TPerson } from "~/lib/api";

export interface CharacterRowProps {
  index: number;
  style: React.CSSProperties;
  data: TPerson;
  isFavorite?: boolean;
}

const CharacterRow: React.FC<CharacterRowProps> = ({ index, style, data }) => {
  // Get the character id from the URL (assumes the id is the second last segment)
  const id = index + 1;

  return (
    <Link href={`/character/character/${id}`}>
      <div style={style} className="character-row p-2">
        <Card
          className={`w-full transform bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg transition-all hover:scale-105`}
        >
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <Typography variant="h4" className="font-bold text-white">
                {data.name}
              </Typography>
              <div className="mt-2 md:mt-0">
                <Typography variant="subtitle1" className="text-white">
                  {data.gender} • {data.birth_year}
                </Typography>
              </div>
            </div>

            {/* Body Grid: Basic Stats */}
            <div className="mt-4 grid grid-cols-1 gap-4 text-white md:grid-cols-2">
              <div>
                <Typography variant="body1">
                  <span className="font-bold">Height:</span> {data.height} cm
                </Typography>
                <Typography variant="body1">
                  <span className="font-bold">Mass:</span> {data.mass} kg
                </Typography>
                <Typography variant="body1">
                  <span className="font-bold">Hair:</span> {data.hair_color}
                </Typography>
              </div>
              <div>
                <Typography variant="body1">
                  <span className="font-bold">Skin:</span> {data.skin_color}
                </Typography>
                <Typography variant="body1">
                  <span className="font-bold">Eyes:</span> {data.eye_color}
                </Typography>
                <Typography variant="body1">
                  <span className="font-bold">Homeworld:</span> {data.homeworld}
                </Typography>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-4 text-white">
              <Typography variant="body2" className="mb-1">
                <span className="font-bold">Films:</span>{" "}
                {data.films.length > 0 ? data.films.join(", ") : "N/A"}
              </Typography>
              <Typography variant="body2" className="mb-1">
                <span className="font-bold">Species:</span>{" "}
                {data.species.length > 0 ? data.species.join(", ") : "N/A"}
              </Typography>
              <Typography variant="body2" className="mb-1">
                <span className="font-bold">Vehicles:</span>{" "}
                {data.vehicles.length > 0 ? data.vehicles.join(", ") : "N/A"}
              </Typography>
              <Typography variant="body2">
                <span className="font-bold">Starships:</span>{" "}
                {data.starships.length > 0 ? data.starships.join(", ") : "N/A"}
              </Typography>
            </div>
          </CardContent>
        </Card>
      </div>
    </Link>
  );
};

export default CharacterRow;
