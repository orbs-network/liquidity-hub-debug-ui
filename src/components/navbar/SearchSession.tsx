import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { RowFlex } from "../../styles";
import { ROUTES } from "../../config";
import { identifyAddressOrTxHash } from "utils";

export function SearchSession() {
  const [value, setVale] = useState("");
  const navigate = useNavigate();

  const searchSession = () => {
    if (!value) return;
    if(identifyAddressOrTxHash(value) === "address") {
    navigate(ROUTES.navigate.address(value));
    } else {
      navigate(ROUTES.navigate.tx(value));
    }
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
          style={{ fontSize: "16px", fontWeight: 500 }}
          placeholder="Search Session ID / Tx Hash"
          value={value}
          onKeyDown={onKeyDown}
          onChange={(e: any) => setVale(e.target.value)}
        />
        <InputRightElement width="4.5rem">
          <Button onClick={searchSession} disabled={true} h="1.75rem" size="sm">
            🔍
          </Button>
        </InputRightElement>
      </InputGroup>
    </StyledInputContainer>
  );
}

const StyledInputContainer = styled(RowFlex)`
  max-width: 400px;
  flex: 1;
`;

const StyledInput = styled(Input)`
  flex: 1;
  border: ${({ theme }) => `1px solid ${theme.colors.border}`}!important;
  background-color: rgb(248, 249, 250) !important;
`;
