// components/character-list/Row.tsx
import React from "react";
import Link from "next/link";
import { TPerson } from "~/lib/api";

interface CharacterRowProps {
  index: number;
  style: React.CSSProperties;
  data: TPerson;
  isFavorite: boolean;
}

const CharacterRow: React.FC<CharacterRowProps> = ({
  index,
  style,
  data,
  isFavorite,
}) => {
  return (
    <Link href={`/character/character/${data.url.split("/").slice(-2, -1)[0]}`}>
      <div
        style={style}
        className={`character-row border-b p-2 ${isFavorite ? "bg-yellow-200" : "bg-white"}`}
      >
        {/* No animation logic here—just static markup */}
        <h3 className="font-bold">{data.name}</h3>
        <p>Height: {data.height} cm</p>
        <p>Mass: {data.mass} kg</p>
        <p>Gender: {data.gender}</p>
      </div>
    </Link>
  );
};

export default CharacterRow;
