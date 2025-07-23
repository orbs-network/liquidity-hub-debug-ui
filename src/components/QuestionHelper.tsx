
import {HelpCircle} from "react-feather"
import {Tooltip} from "antd"

export function QuestionHelper({ label }: { label?: string }) {
  return (
    <Tooltip title={label} placement='right' className="inline-flex items-center">
      <HelpCircle size={15} style={{position:'relative', top: 0}} />
    </Tooltip>
  );
}

