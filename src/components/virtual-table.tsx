import React from "react";
import { Spinner } from "./ui/spinner";
import { TableVirtuoso, Virtuoso } from "react-virtuoso";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./ui/table";
import { cn } from "@/lib/utils";
import _ from "lodash";
import { useIsMobile } from "@/lib/hooks/use-is-mobile";
import { useHeight } from "@/lib/hooks/use-height";

export function VirtualTable<T>({
  isLoading,
  isFetchingNextPage,
  fetchNextPage,
  tableItems,
  headerLabels,
  desktopRows,
  onMobileRowClick,
}: {
  isLoading: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  tableItems: T[];
  onMobileRowClick?: (item: T) => void;
  headerLabels: {
    text: string;
    className?: string;
  }[];
  desktopRows: {
    Component: React.ComponentType<{ item: T }>;
    className?: string;
  }[];
}) {
  const isMobile = useIsMobile();

  if(isLoading) {
    return <div className="flex items-center justify-center w-full h-[200px] bg-card rounded-lg">
    <Spinner className="w-16 h-16" />
  </div>
  }

  if (isMobile) {
    return (
      <MobileTable<T>
        headerLabels={headerLabels}
        rows={desktopRows}
        tableItems={tableItems}
        onMobileRowClick={onMobileRowClick}
      />
    );
  }

  return (
    <div
      className="w-full rounded-lg overflow-hidden border border-border bg-card"
      style={{ minHeight: `${tableItems.length * 57 + 100}px` }}
    >
      {!tableItems.length ? (
        <div className="flex items-center justify-center w-full h-[200px] text-lg">
          No data
        </div>
      ) : (
        <TableVirtuoso
          endReached={fetchNextPage}
          useWindowScroll
          totalCount={tableItems.length}
          overscan={10}
          components={{
            Table: Table, // your wrapper component
            TableHead: TableHeader,
            TableRow: TableRow,
            TableBody: TableBody,
          }}
          fixedHeaderContent={() => {
            return (
              <TableRow className=" text-white text-[14px] bg-card-foreground">
                {_.map(headerLabels, (label) => {
                  const isLast = _.last(headerLabels) === label;
                  return (
                    <TableCell
                      className={cn("text-left", label.className, isLast && "text-center")}
                      key={label.text}
                    >
                      {label.text}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          }}
          itemContent={(index) => {
            const tableItem = tableItems[index];

            if (!tableItem) return null;

            return _.map(desktopRows, (row, _index) => {
              return (
                <TableCell
                  key={_index}
                  className={cn(
                    row.className,
                    `${index % 2 === 0 ? "bg-card" : "bg-card-foreground"}`
                  )}
                >
                  <row.Component item={tableItem} />
                </TableCell>
              );
            });
          }}
        />
      )}
      {isFetchingNextPage && (
        <div className="flex items-center justify-center w-full h-[200px] mt-4">
          <Spinner className="w-10 h-10" />
        </div>
      )}
    </div>
  );
}

const MobileTable = <T,>({
  rows,
  tableItems,
  headerLabels,
  onMobileRowClick,
}: {
  rows: { Component: React.ComponentType<{ item: T }>; className?: string }[];
  tableItems: T[];
  headerLabels: { text: string; className?: string }[];
  onMobileRowClick?: (item: T) => void;
}) => {
  const height = useHeight();
  return (
    <div style={{ height: `calc(${height}px - 160px)` }}>
      <Virtuoso
        totalCount={tableItems.length}
        itemContent={(index) => {
          const tableItem = tableItems[index];
          return (
            <MobileItem<T>
              rows={rows}
              tableItem={tableItem}
              headerLabels={headerLabels}
              onMobileRowClick={onMobileRowClick}
            />
          );
        }}
      />
    </div>
  );
};

const MobileItem = <T,>({
  rows,
  tableItem,
  headerLabels,
  onMobileRowClick,
}: {
  rows: { Component: React.ComponentType<{ item: T }>; className?: string }[];
  tableItem: T;
  headerLabels: { text: string; className?: string }[];
  onMobileRowClick?: (item: T) => void;
}) => {
  return (
    <div
      className="flex flex-col gap-1 bg-card-foreground rounded-lg p-3 mb-2"
      onClick={() => onMobileRowClick?.(tableItem)}
    >
      {_.map(rows, (row, _index) => {
        const headerLabel = headerLabels[_index]
          ? headerLabels[_index].text
          : null;
        return (
          <div
            key={_index}
            className="flex flex-row gap-2 items-center justify-between"
          >
            {headerLabel !== "Action" && (
              <p className="text-white text-[14px] font-bold">{headerLabel}</p>
            )}
            <div className={cn("text-sm", row.className)}>
              <row.Component item={tableItem} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
