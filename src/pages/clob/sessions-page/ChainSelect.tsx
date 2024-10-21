import {
  Button,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useAppParams } from "../../../hooks";
import { ColumnFlex } from "../../../styles";
import styled from "styled-components";
import { ReactNode } from "react";
import { getChainName } from "../../../helpers";
import { networks } from "networks";
import _ from "lodash";

const list = _.map(networks, (it) => {
  return {
    id: it.id,
    name: it.name,
  };
});

export function ChainSelect() {
  const { onOpen, onClose, isOpen } = useDisclosure();

  const { query, setQuery } = useAppParams();

  const onSave = (value?: number) => {
    onClose();
    setQuery({
      chainId: value,
    });
  };

  const name = query.chainId ? getChainName(query.chainId) : "All chains";

  return (
    <Popover
      isOpen={isOpen}
      placement="bottom-start"
      onOpen={onOpen}
      onClose={onClose}
    >
      <PopoverTrigger>
        <Button>{name}</Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverCloseButton />
          <PopoverBody>
            <Section title="Chain">
              <StyledButton
                justifyContent="flex-start"
                onClick={() => onSave(undefined)}
                variant={"ghost"}
              >
                All chains
              </StyledButton>
              {list.map((chain, index) => (
                <StyledButton
                  justifyContent="flex-start"
                  onClick={() => onSave(chain.id as number)}
                  key={index}
                  variant={chain.id === query.chainId ? "solid" : "ghost"}
                >
                  {chain.name}
                </StyledButton>
              ))}
            </Section>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}

const StyledButton = styled(Button)`
  width: 100%;
`;
const Section = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => {
  return (
    <StyledSection>
      <Text>{title}</Text>
      <StyledSectionChildren>{children}</StyledSectionChildren>
    </StyledSection>
  );
};

const StyledSection = styled(ColumnFlex)`
  width: 100%;
  gap: 5px;
  align-items: flex-start;
`;
const StyledSectionChildren = styled(ColumnFlex)`
  width: 100%;
  align-items: flex-start;
  gap: 5px;
`;
