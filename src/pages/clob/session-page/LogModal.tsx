import {
  Text,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tag,
} from "@chakra-ui/react";
import { ColumnFlex } from "../../../styles";
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


export const LogModal = ({
  log,
  title,
}: {
  title: string;
  log: { [key: string]: any };
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <StyledTag onClick={onOpen}>{title}</StyledTag>
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
              {Object.keys(log).map((key) => {
                return (
                  <StyledModalRowTitle key={key}>
                    <strong>{key}:</strong> {handleValue(log[key])}
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

const StyledTag = styled(Tag)`
  cursor: pointer;
`


const StyledModalRowTitle = styled(Text)`
width: 100%;
  strong {
    font-weight: 600;
  }
`;
