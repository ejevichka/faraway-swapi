import React from "react";
import { TPerson } from "~/lib/api";
import CharacterRow from "~/components/character-list/Row";

interface CharacterListRowProps {
  index: number;
  style: React.CSSProperties;
  character: TPerson;
}

const CharacterListRow: React.FC<CharacterListRowProps> = ({
  index,
  style,
  character,
}) => {
  return <CharacterRow index={index} style={style} data={character} />;
};

export default CharacterListRow;
