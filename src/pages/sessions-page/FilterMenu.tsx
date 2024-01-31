import {
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Portal,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import styled from "styled-components";
import { ReactNode, useState } from "react";
import { useAppParams } from "../../hooks";
import { RowFlex, ColumnFlex } from "../../styles";
import { SessionType } from "../../types";
const times = [
  {
    title: "Last 30 minutes",
    value: "30m",
  },
  {
    title: "Last 1 hour",
    value: "1h",
  },
  {
    title: "Last 12 hours",
    value: "12h",
  },
  {
    title: "Last day",
    value: "1d",
  },
  {
    title: "All time",
    value: 'all',
  },
];

const sessionTypes: { title: string; value: SessionType }[] = [
  {
    title: "All",
    value: undefined,
  },
  {
    title: "Swap",
    value: "swap",
  },
  {
    title: "Swap successful",
    value: "success",
  },

  {
    title: "Swap failed",
    value: "failed",
  },
];


export function FilterMenu() {
  const { onOpen, onClose, isOpen } = useDisclosure();

  const { query, setQuery } = useAppParams();
  const [values, setValues] = useState({
    timeRange: query.timeRange,
    sessionType: query.sessionType,
  });

  const update = (key: string, value?: string) => {
    setValues({ ...values, [key]: value });
  };

  const open = () => {
    onOpen();
    setValues({ timeRange: query.timeRange, sessionType: query.sessionType });
  };

  const onSave = () => {
    onClose();
    setQuery({
        timeRange: values.timeRange,
        sessionType: values.sessionType,
    });
  };

  return (
    <Popover
      isOpen={isOpen}
      placement="bottom-start"
      onOpen={open}
      onClose={onClose}
    >
      <PopoverTrigger>
        <Button>Filter</Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverBody>
            <Section title="Time range">
              {times.map((time, index) => (
                <StyledButton
                  justifyContent="flex-start"
                  onClick={() => update("timeRange", time.value)}
                  key={index}
                  variant={time.value === values.timeRange ? "solid" : "ghost"}
                >
                  {time.title}
                </StyledButton>
              ))}
            </Section>
            <Section title="Session type">
              {sessionTypes.map((type, index) => (
                <StyledButton
                  justifyContent="flex-start"
                  onClick={() =>
                    update("sessionType", type.value as SessionType)
                  }
                  key={index}
                  variant={
                    type.value === values.sessionType ? "solid" : "ghost"
                  }
                >
                  {type.title}
                </StyledButton>
              ))}
            </Section>
          </PopoverBody>
          <PopoverFooter>
            <RowFlex $justifyContent="flex-start">
              <Button onClick={onSave}>Save</Button>
              <Button onClick={onClose} variant="ghost">
                Cancel
              </Button>
            </RowFlex>
          </PopoverFooter>
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
