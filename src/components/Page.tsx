import { Link, useLocation } from "react-router-dom";
import { Skeleton } from "antd";
import orbsLogo from "@/assets/orbs.svg";
import { ROUTES } from "@/config";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { useUser } from "@/lib/auth";
import { useHeight } from "@/lib/hooks/use-height";
import { useIsMobile } from "@/lib/hooks/use-is-mobile";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { ListIcon, MenuIcon, PieChartIcon, X } from "lucide-react";

export function Loader({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      <Skeleton style={{ width: "70%" }} />
    </div>
  );
}

const navigation = [
  {
    title: (
      <>
        Twap overview <PieChartIcon className="w-4 h-4" />{" "}
      </>
    ),
    path: ROUTES.twap.overview,
  },
  {
    title: (
      <>
        Twap Orders <ListIcon className="w-4 h-4" />{" "}
      </>
    ),
    path: ROUTES.twap.root,
  },
  {
    title: (
      <>
        LH Overview <PieChartIcon className="w-4 h-4" />{" "}
      </>
    ),
    path: ROUTES.liquidityHub.overview,
  },
  {
    title: (
      <>
        LH Orders <ListIcon className="w-4 h-4" />{" "}
      </>
    ),
    path: ROUTES.liquidityHub.root,
  },
];


const useIsPreview = () => {
  const pathname = useLocation().pathname;
  return pathname.indexOf("preview") > -1;
};

const Logo = () => {
  const isPreview = useIsPreview();

  const content = (
    <>
      <img src={orbsLogo} alt="orbs Logo" className="h-[30px]" />
      <span className="text-[17px] font-semibold  hidden md:block text-white">
        Orbs Explorer
      </span>
    </>
  );

  if (isPreview) {
    return <div className="flex items-center gap-2">{content}</div>;
  }

  return (
    <Link to={ROUTES.root} className="flex items-center gap-2">
      {content}
    </Link>
  );
};

export const Navbar = () => {
  const isMobile = useIsMobile();
  return (
    <div className="sticky top-0 z-20 bg-background w-full h-[50px] flex items-center justify-between md:h-[70px]">
      <Logo />
      {isMobile ? (
        <MobileLinks links={navigation} />
      ) : (
        <DesktopLinks links={navigation} />
      )}
    </div>
  );
};

const MobileLinks = ({
  links,
}: {
  links?: { title: ReactNode; path: string }[];
}) => {
  const { pathname } = useLocation();
  const isPreview = useIsPreview();
  if (isPreview) return null;
  return (
    <div>
      <Drawer direction="right">
        <DrawerTrigger className="ml-auto">
          <MenuIcon className="w-5 h-5" />
        </DrawerTrigger>
        <DrawerContent className="text-white">
          <DrawerHeader className="flex items-center justify-between flex-row">
            <DrawerTitle>Orbs Explorer</DrawerTitle>
            <DrawerClose>
              <X className="w-5 h-5 text-white" />
            </DrawerClose>
          </DrawerHeader>
          <div className="p-4 flex flex-col gap-4 h-full overflow-y-auto">
            {links?.map((item) => {
              const isActive = pathname === item.path;
              return (
                <DrawerClose asChild key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "text-[15px] text-secondary-foreground hover:text-white flex flex-row gap-2 items-center",
                      isActive && "text-white"
                    )}
                  >
                    {item.title}
                  </Link>
                </DrawerClose>
              );
            })}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

const DesktopLinks = ({
  links,
}: {
  links?: { title: ReactNode; path: string }[];
}) => {
  const { user } = useUser();
  const { pathname } = useLocation();
  const isPreview = useIsPreview();
  if (isPreview) return null;

  if (!user || !links) return null;

  return (
    <div className="flex items-center gap-4 ml-auto">
      {links.map((item) => {
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
  );
};

export function Page({
  children,
  className,
  isLoading,
}: {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}) {
  const height = useHeight();

  return (
    <div
      className={cn(
        "flex flex-col max-w-[1200px] mx-auto pt-[0px] w-full pb-[100px] px-[10px] md:px-[20px] "
      )}
      style={{ minHeight: height }}
    >
      <Navbar />
      <div className={`w-full pt-[0px] ${className} md:pt-[20px]`}>
        {isLoading ? <Loader /> : children}
      </div>
    </div>
  );
}
