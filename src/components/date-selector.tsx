import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { CalendarIcon, ChevronDownIcon, XIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useAppParams } from "@/hooks";
import moment from "moment";
import { parseTimestampFromQuery } from "@/utils";
import { URL_QUERY_KEYS } from "@/consts";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

const OPTIONS = [
  {
    label: "Last 24 hours",
    value: 1,
  },
  {
    label: "Last 7 days",
    value: 7,
  },
  {
    label: "Last 30 days",
    value: 30,
  },
];

export function DateSelector({ custom = false }: { custom?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    setQuery,
    query: { timestamp },
  } = useAppParams();

  const onSubmitCustom = (selected: DateRange) => {
    setQuery.updateQuery({
      timestamp: `${selected.from?.getTime()}-${selected.to?.getTime()}`,
    });
  };

  const onSubmitOption = (days: number) => {
    setQuery.updateQuery({
      [URL_QUERY_KEYS.TIMESTAMP]: moment().subtract(days, "day").valueOf(),
    });
  };

  const selectedTimestamp = useMemo(() => {
    const result = parseTimestampFromQuery(timestamp);
    if (!result) {
      return undefined;
    }
    if (result.from && result.to) {
      return `${moment(result.from).format("MM/DD/YYYY")} - ${moment(
        result.to
      ).format("MM/DD/YYYY")}`;
    }
  }, [timestamp]);

  if (custom) {
    return (
      <>
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          className="flex items-center gap-2 text-[14px]"
        >
          <CalendarIcon className="w-4 h-4" />
          {selectedTimestamp ? selectedTimestamp : "Timestamp"}
          <ChevronDownIcon className="w-4 h-4" />
        </Button>
        <CustomDateSelector
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onSubmit={onSubmitCustom}
        />
      </>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant="outline"
            className="flex items-center gap-2 text-[14px]"
          >
            <CalendarIcon className="w-4 h-4" />
            {selectedTimestamp ? selectedTimestamp : "Timestamp"}
            <ChevronDownIcon className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => {
                onSubmitOption(option.value);
              }}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem onClick={() => setIsOpen(true)}>
            Custom
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CustomDateSelector
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSubmit={onSubmitCustom}
      />
    </>
  );
}

const CustomDateSelector = ({
  isOpen,
  setIsOpen,
  onSubmit,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: (selected: DateRange) => void;
}) => {
  const { query } = useAppParams();
  const initialSelected = useMemo(() => {
    const { from, to } = parseTimestampFromQuery(query.timestamp || "");

    return {
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : new Date(),
    };
  }, [query]);
  const [selected, setSelected] = useState<DateRange>(initialSelected);

  useEffect(() => {
    if (initialSelected.from && initialSelected.to) {
      setSelected(initialSelected);
    }
  }, [initialSelected]);

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <DialogContent className="sm:max-w-full w-fit">
        <DialogHeader>
          <DialogTitle>Select Date Range</DialogTitle>
          <DialogClose className="absolute top-4 right-4">
            <XIcon className="w-4 h-4" />
          </DialogClose>
        </DialogHeader>
        <Calendar
          disabled={(date) => {
            return date > new Date();
          }}
          mode="range"
          selected={selected}
          onSelect={(range) => {
            if (range?.from && range?.to) {
              setSelected({
                from: range.from,
                to: range.to,
              });
            }
          }}
          numberOfMonths={2}
          className="rounded-md border bg-popover p-3 shadow dark:bg-zinc-900"
        />

        <DialogFooter className="flex justify-center gap-2 w-full">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSubmit(selected);
              setIsOpen(false);
            }}
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
