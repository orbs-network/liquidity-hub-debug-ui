import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { identifyAddressOrTxHash } from "utils";
import { RowFlex } from "styles";
import { ROUTES } from "config";
import { ArrowUpIcon } from "@chakra-ui/icons";

export function SearchSessionInput({ className = "" }: { className?: string }) {
  const [value, setVale] = useState("");
  const navigate = useNavigate();

  const searchSession = () => {
    if (!value) return;
    if (identifyAddressOrTxHash(value) === "address") {
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
    <StyledInputContainer className={className}>
      <InputGroup size="md">
        <StyledInput
          style={{ fontSize: "16px", fontWeight: 400 }}
          backgroundColor='#f4f4f4'
          borderRadius='30px'
          placeholder="Search  Tx Hash / Wallet / Session ID"
          value={value}
          onKeyDown={onKeyDown}
          onChange={(e: any) => setVale(e.target.value)}
        />
        <InputRightElement width="4.5rem">
          <StyledButton  onClick={searchSession}>
          <ArrowUpIcon />
          </StyledButton>
        </InputRightElement>
      </InputGroup>
    </StyledInputContainer>
  );
}

const StyledButton = styled('button')({
  borderRadius:'50%',
  background:'rgb(215 215 215/1)',
  width:'30px',
  height:'30px',
  display:'flex',
  justifyContent:'center',
  alignItems:'center',
  svg: {
  color: 'white'
  }
})

const StyledInputContainer = styled(RowFlex)`
  max-width: 400px;

`;

const StyledInput = styled(Input)`
  flex: 1;
  border: ${({ theme }) => `1px solid ${theme.colors.border}`}!important;
  background-color: #ececec;
`;
