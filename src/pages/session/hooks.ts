import { useParams } from "react-router-dom";
import { useGetSessionByIdQuery } from "../../query";

export const useSession = () => {
  const params = useParams();

  return useGetSessionByIdQuery(params.sessionId);
};
