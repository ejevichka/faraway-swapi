import { TextField, Button, Card, Select } from "@mui/material";
import styled from "@emotion/styled";

export const StyledInput = styled(TextField)`
  & .MuiInputBase-root {
    background-color: #f9f9f9; /* Light input background */
    border-radius: 8px;
  }
  & .MuiOutlinedInput-root {
    fieldset {
      border-color: #e0e0e0; /* Soft border for the input */
    }
    &:hover fieldset {
      border-color: #008cba; /* Blue border on hover */
    }
    &.Mui-focused fieldset {
      border-color: #008cba; /* Blue border when focused */
    }
  }
`;
export const StyledCard = styled(Card)`
  background-color: #ffffff; /* Light background */
  border-radius: 12px; /* Rounded corners */
  padding: 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: auto;
`;

export const StyledButton = styled(Button)`
  /* Cosmic, minimalistic background */
  background: linear-gradient(135deg, #0d0d2b, #1a1a40);
  color: #f0f0f0;
  font-size: 16px;
  padding: 12px 24px;
  border-radius: 8px;
  width: 100%;
  border: 1px solid transparent;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
  transition:
    background 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    /* Slightly reversed gradient and a neon-blue border/glow effect */
    background: linear-gradient(135deg, #1a1a40, #0d0d2b);
    border-color: #00bcd4;
    box-shadow: 0 4px 12px rgba(0, 188, 212, 0.6);
  }
`;

export const StyledSelect = styled(Select)`
  & .MuiInputBase-root {
    background-color: #f9f9f9;
    border-radius: 8px;
  }
  & .MuiOutlinedInput-root {
    fieldset {
      border-color: #e0e0e0; /* Light border color */
    }
    &:hover fieldset {
      border-color: #008cba; /* Blue border color on hover */
    }
    &.Mui-focused fieldset {
      border-color: #008cba; /* Blue border color when focused */
    }
  }
`;
