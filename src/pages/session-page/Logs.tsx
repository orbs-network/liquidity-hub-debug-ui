import {
  Accordion,
  Text,
  useDisclosure,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { ColumnFlex } from "../../styles";
import { Session } from "../../types";
import styled from "styled-components";
import _ from "lodash";

const handleValue = (value: any) => {
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch (error) {
      return "";
    }
  }

  return value;
};

export function Logs({ session }: { session: Session }) {
  return (
    <Container>
        <Text>Logs</Text>
      <Section rowTitle="Client" title="Client" rows={session.logs.client} />
      <Section rowTitle="Quote" title="Quotes" rows={session.logs.quote} />
      <Section rowTitle="Swap" title="Swap" rows={session.logs.swap} />
    </Container>
  );
}

const Section = ({
  title,
  rows,
  rowTitle,
}: {
  title: string;
  rows?: any[];
  rowTitle: string;
}) => {
    if (!rows || _.size(rows) === 0) return null
      return (
        <StyledSection>
          <Text>{title}</Text>
          <Accordion allowToggle>
            <ColumnFlex
              style={{
                width: "100%",
                alignItems: "flex-start",
              }}
            >
              {rows.map((it, index) => {
                return (
                  <LogModal
                    title={`${rowTitle}-${index + 1}`}
                    row={it}
                    key={index}
                  />
                );
              })}
            </ColumnFlex>
          </Accordion>
        </StyledSection>
      );
};


const LogModal = ({
  row,
  title,
}: {
  title: string;
  row: { [key: string]: any };
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>{title}</Button>
      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent maxWidth="90vw" maxHeight="90vh">
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ColumnFlex
              style={{
                width: "100%",
              }}
            >
              {Object.keys(row).map((key) => {
                return (
                  <StyledModalRowTitle key={key}>
                    <strong>{key}:</strong> {handleValue(row[key])}
                  </StyledModalRowTitle>
                );
              })}
            </ColumnFlex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};


const StyledModalRowTitle = styled(Text)`
width: 100%;
  strong {
    font-weight: 600;
  }
`;

const Container = styled(ColumnFlex)`
  width: 100%;
  align-items: flex-start;
`;

const StyledSection = styled.div`
  width: 100%;
`;
