import { useContext } from "react";
import { Context } from "./context";

export const useSwapPageContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useSwapPageContext must be used within a SwapPageContextProvider");
  }
  return context;
};
