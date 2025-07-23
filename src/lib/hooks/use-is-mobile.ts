import { MOBILE } from "@/consts";
import { useEffect, useState } from "react";

export const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE);
  
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= MOBILE);
      };
  
      window.addEventListener("resize", handleResize);
  
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);
  
    return isMobile;
  };