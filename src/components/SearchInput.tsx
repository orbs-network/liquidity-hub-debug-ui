/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from "react";
import { ArrowUp } from "react-feather";
import { notification } from "antd";
import { Input } from "./ui/input";

export function SearchInput({
  className = "",
  placeholder = "Search...",
  onSubmit,
}: {
  className?: string;
  placeholder?: string;
  onSubmit: (value: string) => void;
}) {
  const [value, setVale] = useState("");
  const [api, contextHolder] = notification.useNotification();

  const onSearch = useCallback(() => {
    if (!value) return;
    try {
      onSubmit(value);
      setVale("");
    } catch (error) {
      api.error({
        showProgress: true,
        pauseOnHover: true,
        message: "Invalid input",
        description: (error as Error).message,
        placement: "top",
      });
    }
  }, [value, onSubmit, api]);

  const onKeyDown = useCallback(
    (e: any) => {
      if (e.key === "Enter") {
        onSearch();
      }
    },
    [onSearch]
  );

  return (
    <>
      {contextHolder}
      <div
        className={`bg-card-foreground rounded-lg p-1 w-full flex flex-row gap-2 items-center h-[45px] text-[16px] ${className}`}
      >
        <Input
          placeholder={placeholder}
          value={value}
          onKeyDown={onKeyDown}
          onChange={(e: any) => setVale(e.target.value)}
          className="outline-none border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus:placeholder:text-transparent font-mono placeholder:text-muted-foreground md:text-[16px]"
        />
        <button disabled={!value} onClick={onSearch} className="outline-none border-none bg-slate-500/50 rounded-lg hover:bg-slate-500/70 transition-all duration-300 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-[40px] h-[33px]">
          <ArrowUp size={16} color="white" />
        </button>
      </div>
    </>
  );
}
