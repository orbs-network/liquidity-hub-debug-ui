import {
  Avatar,
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useAppParams } from "../../hooks";
import styled from "styled-components";
import { ReactNode } from "react";
import { networks } from "../../networks";
import _ from "lodash";
import { ColumnFlex, RowFlex } from "styles";
import { useLocation } from "react-router-dom";

const list = _.map(networks, (it) => {
  return {
    id: it.id,
    name: it.name,
    logoUrl: it.logoUrl,
  };
});

export function ChainSelect() {
  const pathname = useLocation().pathname;

  
  const { onOpen, onClose, isOpen } = useDisclosure();

  const { query, setQuery } = useAppParams();

  const onSave = (value?: number) => {
    onClose();
    setQuery({
      chainId: value,
    });
  };

  if(pathname.includes('tx')) return null;

  const selected = list.find((it) => it.id === query.chainId);



  return (
    <Popover
      isOpen={isOpen}
      placement="bottom-end"
      onOpen={onOpen}
      onClose={onClose}
    >
      <PopoverTrigger>
        <Button>
          {!selected ? 'All chains' : <Avatar size="xs" src={selected.logoUrl} />}
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent maxWidth={200}>
          <PopoverBody>
            <Section title="">
              <Button
                justifyContent="flex-start"
                width="100%"
                onClick={() => onSave(undefined)}
                variant={"ghost"}
              >
                All chains
              </Button>
              {list.map((chain, index) => (
                <Button
                  width="100%"
                  onClick={() => onSave(chain.id as number)}
                  key={index}
                  variant={chain.id === query.chainId ? "solid" : "ghost"}
                >
                  <ButtonContent>
                    <p>{chain.name}</p>
                    <Avatar size="xs" src={chain.logoUrl} />
                  </ButtonContent>
                </Button>
              ))}
            </Section>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}

const ButtonContent = styled(RowFlex)({
  justifyContent: "space-between",
  width: "100%",
});

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
