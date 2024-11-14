import { useLiquidityHubSession } from "applications";
import { DataDisplay, LogModal } from "components";
import { styled } from "styled-components";
import { RowFlex } from "styles";

export const SessionLogs = () => {
  const session = useLiquidityHubSession().data;
  if (!session || !session.logs) return null;
  return (
    <>
      {session.logs.client && (
        <DataDisplay.Row label="Client logs">
          <StyledLogContent>
            {session.logs.client.map((it: any, index: number) => {
              return (
                <LogModal title={`Client ${index + 1}`} key={index} log={it} />
              );
            })}
          </StyledLogContent>
        </DataDisplay.Row>
      )}
      {session.logs.quote && (
        <DataDisplay.Row label="Quote logs">
          <StyledLogContent>
            {session.logs.quote.map((it: any, index: number) => {
              return (
                <LogModal title={`Quote ${index + 1}`} key={index} log={it} />
              );
            })}
          </StyledLogContent>
        </DataDisplay.Row>
      )}
      <DataDisplay.Row label="Swap logs">
        <StyledLogContent>
        <LogModal title={`Swap`} log={session.logs.swap} />
        </StyledLogContent>
      </DataDisplay.Row>
    </>
  );
};

const StyledLogContent = styled(RowFlex)`
  justify-content: flex-start;
  flex-wrap: wrap;
`;
