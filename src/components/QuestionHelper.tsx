import { QuestionIcon } from "@chakra-ui/icons";
import { Tooltip } from "@chakra-ui/react";

export function QuestionHelper({ label }: { label?: string }) {
  return (
    <Tooltip label={label} placement='top'>
      <QuestionIcon />
    </Tooltip>
  );
}

