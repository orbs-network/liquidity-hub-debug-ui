import { Text, Button, Tag } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ROUTES } from "../../config";
import { RowFlex } from "../../styles";
import { Session } from "../../types";
import { SessionPreview } from "./PreviewModal";

export const ListSession = ({ index, style, data }: any) => {
  const session = data[index] as Session;  
  const navigate = useNavigate();

  const onNavigate = () => {
    navigate(ROUTES.navigate.session(session.id));
  };

  return (
    <div style={style}>
      <Container>
        <Text>{session.id}</Text>
        <TokensSymbols session={session} />
        <Tag>{session.dex}</Tag>
        <Text>{session.timestamp}</Text>
        <StyledButtons>
          <SessionPreview session={session} />
          <Button onClick={onNavigate}>View</Button>
        </StyledButtons>
      </Container>
    </div>
  );
};

const StyledButtons = styled(RowFlex)`
  gap: 10px;
`;

const Container = styled(RowFlex)`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: space-between;
`;

const TokensSymbols = ({ session }: { session?: Session }) => {
  return (
    <RowFlex>
      <Text>{session?.tokenInSymbol}</Text>
      <Text>{session?.tokenOutSymbol}</Text>
    </RowFlex>
  );
};
