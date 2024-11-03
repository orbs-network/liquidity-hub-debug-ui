import { LogModal } from "components";
import { styled } from "styled-components";
import { RowFlex } from "styles";
import { useSession } from "../hooks";
import { ListItem } from "./shared";

export const SessionLogs = () => {
  const session = useSession().data;
  if (!session || !session.logs) return null;
  return (
    <>
      {session.logs.client && (
        <ListItem label="Client logs">
          <StyledLogContent>
            {session.logs.client.map((it: any, index: number) => {
              return (
                <LogModal title={`Client ${index + 1}`} key={index} log={it} />
              );
            })}
          </StyledLogContent>
        </ListItem>
      )}
      {session.logs.quote && (
        <ListItem label="Quote logs">
          <StyledLogContent>
            {session.logs.quote.map((it: any, index: number) => {
              return (
                <LogModal title={`Quote ${index + 1}`} key={index} log={it} />
              );
            })}
          </StyledLogContent>
        </ListItem>
      )}
      <ListItem label="Swap logs">
        <StyledLogContent>
        <LogModal title={`Swap`} log={session.logs.swap} />
        </StyledLogContent>
      </ListItem>
    </>
  );
};

const StyledLogContent = styled(RowFlex)`
  justify-content: flex-start;
  flex-wrap: wrap;
`;
