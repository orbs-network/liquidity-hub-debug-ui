import { QuestionHelper } from "@/components/QuestionHelper";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "./card";
import { useUser } from "@/lib/auth";
import { ArrowLeftIcon } from "lucide-react";

export const Row = ({
  label,
  children,
  tooltip,
  description,
  className,
}: {
  label: string;
  children?: ReactNode;
  tooltip?: string;
  className?: string;
  description?: string;
}) => {
  return (
    <div
      className={
        "flex flex-col justify-between w-full border-b border-border pb-2 mt-auto flex-wrap gap-2 md:flex-row"
      }
    >
      <p className="text-sm font-bold text-secondary-foreground font-mono uppercase">
        {`${label}`}{" "}
        {description && (
          <span className="text-[12px] text-secondary-foreground font-mono">
            {description}
          </span>
        )}{" "}
        {tooltip && (
          <span>
            <QuestionHelper label={tooltip} />
          </span>
        )}
      </p>
      <div
        className={cn(
          "flex flex-row w-fit text-sm font-mono items-center md:ml-auto",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

const TransactionDisplay = ({
  header,
  children,
  isLoading,
}: {
  header: ReactNode;
  children: ReactNode;
  isLoading?: boolean;
}) => {
  return (
    <Card>
      <Card.Header>{header}</Card.Header>
      <Card.Content isLoading={isLoading} className="flex flex-col gap-4">{children}</Card.Content>
    </Card>
  );
};

const BackButton = ({ onClick }: { onClick: () => void }) => {
  const { user } = useUser();
  if (!user) {
    return <div></div>;
  }
  return (
    <button
      className="bg-slate-800/50 border border-border rounded-lg text-white p-2 hover:bg-slate-800/70 transition-all duration-300 w-fit flex flex-row items-center gap-2"
      onClick={onClick}
    >
      <ArrowLeftIcon className="w-4 h-4" />
      <p className="text-sm">Back</p>
    </button>
  );
};

const Section = ({
  children,
  title,
  className,
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
}) => {
  return (
    <div className="flex flex-col ">
      {title && <div
        className={cn(
          "font-bold text-lg border-b border-border pb-2",
          className
        )}
      >
        {title}
      </div>}
      <div className="flex flex-col gap-2 pt-[10px] flex-1">{children}</div>
    </div>
  );
};

const Grid = ({ children }: { children: ReactNode }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{children}</div>
  );
};

const Container = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col gap-4">{children}</div>;
};

const ContainerHeader = ({
  children,
  onBackClick,
}: {
  children?: ReactNode;
  onBackClick: () => void;
}) => {
  return (
    <div className="flex flex-row justify-between w-full">
      <BackButton onClick={onBackClick} />
      {children}
    </div>
  );
};

TransactionDisplay.Section = Section;
TransactionDisplay.SectionItem = Row;
TransactionDisplay.Grid = Grid;
TransactionDisplay.Container = Container;
TransactionDisplay.ContainerHeader = ContainerHeader;
export { TransactionDisplay };
