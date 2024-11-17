
import {HelpCircle} from "react-feather"
import {Tooltip} from "antd"

export function QuestionHelper({ label }: { label?: string }) {
  return (
    <Tooltip title={label} placement='right'>
      <HelpCircle size={15} style={{position:'relative', top: 2}} />
    </Tooltip>
  );
}

