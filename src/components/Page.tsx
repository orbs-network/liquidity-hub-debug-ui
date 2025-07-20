import { styled } from "styled-components";
import { ColumnFlex } from "@/styles";
import { Link, useLocation } from "react-router-dom";
import { Skeleton } from "antd";
import orbsLogo from "@/assets/orbs.svg";
import { useHeight } from "@/hooks";
import { ROUTES } from "@/config";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function Loader({ className = "" }: { className?: string }) {
  return (
    <StyledLoader className={className}>
      <Skeleton style={{ width: "70%" }} />
    </StyledLoader>
  );
}

const StyledLoader = styled(ColumnFlex)({
  width: "100%",
  alignItems: "flex-start",
});

export const Navbar = ({
  navigation,
}: {
  navigation?: { title: ReactNode; path: string }[];
}) => {
  const { pathname } = useLocation();
  return (
    <div className="sticky top-0 z-20 bg-background w-full h-[70px] flex items-center justify-start">
      <Link to={ROUTES.root} className="flex items-center gap-2">
        <img src={orbsLogo} alt="orbs Logo" className="h-[30px]" />
        <span className="text-[17px] font-semibold">Orbs Explorer</span>
      </Link>
      {navigation && (
        <div className="flex items-center gap-4 ml-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-[15px] text-secondary-foreground hover:text-white flex flex-row gap-2 items-center",
                  isActive && "text-white"
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export function Page({
  children,
  className,
  isLoading,
  navigation,
}: {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;

  navigation?: {
    title: ReactNode;
    path: string;
  }[];
}) {
  const height = useHeight();



  return (
    <div
      className={cn(
        "flex flex-col max-w-[1200px] mx-auto pt-[0px] w-full pb-[100px] px-[20px] "
      )}
      style={{ minHeight: height }}
    >
      <Navbar navigation={navigation} />
      <div className={`w-full pt-[20px] ${className}`}>
        {isLoading ? <Loader /> : children}
      </div>
    </div>
  );
}
