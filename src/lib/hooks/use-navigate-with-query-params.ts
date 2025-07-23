import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useNavigateWithParams = () => {
    const search = useLocation().search;
    const navigate = useNavigate();
  
    return useCallback(
      (
        route: string,
        params?: Record<string, string | number | (string | number)[] | undefined>
      ) => {
        const query = new URLSearchParams();
  
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach((v) => query.append(key, v.toString()));
            } else {
              query.set(key, value?.toString() || "");
            }
          });
        }
  
        const queryString = query.toString();
        const finalUrl = `${route}${queryString ? `?${queryString}` : search}`;
  
        navigate(finalUrl, { replace: true });
      },
      [navigate, search]
    );
  };