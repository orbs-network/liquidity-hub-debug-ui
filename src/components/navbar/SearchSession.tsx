import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { RowFlex } from "../../styles";
import { ROUTES } from "../../config";

export function SearchSession() {
  const [value, setVale] = useState("");
  const navigate = useNavigate();
  const searchSession = () => {
    if (!value)  return;
     navigate(ROUTES.navigate.session(value));
  };

  const onKeyDown = (e: any) => {

    if (e.key === "Enter") {
      searchSession();
    }
  };

  return (
    <StyledInputContainer>
      <InputGroup size="md">
        <StyledInput
          color="black"
          placeholder="Session ID"
          value={value}
          onKeyDown={onKeyDown}
          onChange={(e) => setVale(e.target.value)}
        />
        <InputRightElement width="4.5rem">
          <Button onClick={searchSession} disabled={true} h="1.75rem" size="sm">
            Go
          </Button>
        </InputRightElement>
      </InputGroup>
    </StyledInputContainer>
  );
}

const StyledInputContainer = styled(RowFlex)`
  width: 400px;
`;

const StyledInput = styled(Input)`
  flex: 1;
`;
