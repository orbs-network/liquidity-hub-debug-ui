import { getPartnersById } from "../utils";
import { useMemo } from "react";


export const usePartner = (id?: string) => {

    return useMemo(() => (id ? getPartnersById([id])?.[0] : undefined), [id]);
  };