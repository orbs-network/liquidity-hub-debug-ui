import React from "react";
import { Spinner } from "./ui/spinner";
import { TableVirtuoso } from "react-virtuoso";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./ui/table";
import { cn } from "@/lib/utils";
import _ from "lodash";

export function VirtualTable<T>({
  isLoading,
  isFetchingNextPage,
  fetchNextPage,
  tableItems,
  headerLabels,
  desktopRows,
}: {
  isLoading: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  tableItems: T[];
  headerLabels: {
    text: string;
    className?: string;
  }[];
  desktopRows: {
    Component: React.ComponentType<{ item: T }>;
    className?: string;
  }[];
}) {


  return (
    <div className="w-full rounded-lg overflow-hidden border border-border bg-card" style={{ minHeight: `${tableItems.length * 57 + 100}px` }}>
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-[200px]">
          <Spinner className="w-16 h-16" />
        </div>
      ) : !tableItems.length ? <div className="flex items-center justify-center w-full h-[200px] text-lg">No data</div> : (
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
                  return (
                    <TableCell
                      className={cn(label.className, "text-left")}
                      key={label.text}
                    >
                      <div className="flex items-center gap-2">
                        {label.text}
                      </div>
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
