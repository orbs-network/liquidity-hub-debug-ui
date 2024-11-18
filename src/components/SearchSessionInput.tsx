import { useCallback, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { isValidSessionId, isValidTxHash, isValidWalletAddress } from "utils";
import { LightButton, RowFlex } from "styles";
import { ROUTES } from "config";
import { ArrowUp } from "react-feather";
import { notification } from "antd";
import { colors } from "consts";
import { useIsMobile } from "hooks";

export function SearchSessionInput({ className = "" }: { className?: string }) {
  const [value, setVale] = useState("");
  const navigate = useNavigate();
  const isMobile= useIsMobile();
  const [api, contextHolder] = notification.useNotification();

  const searchSession = useCallback(() => {
    if (!value) return;
    if (isValidWalletAddress(value)) {
      navigate(ROUTES.navigate.address(value));
    } else if (isValidSessionId(value) || isValidTxHash(value)) {
      navigate(ROUTES.navigate.tx(value));
    } else {
      api.error({
        showProgress: true,
        pauseOnHover: true,
        message: "Invalid input",
        description:
          "Please enter a valid Tx Hash, Wallet Address or Session ID",
        placement: "top",
      });
    }
  }, [value, navigate, api]);

  const onKeyDown = useCallback(
    (e: any) => {
      if (e.key === "Enter") {
        searchSession();
      }
    },
    [searchSession]
  );

  return (
    <>
      {contextHolder}
      <StyledInputContainer className={className}>
        <StyledInput
          placeholder="Tx Hash / Session ID / Wallet "
          value={value}
          onKeyDown={onKeyDown}
          onChange={(e: any) => setVale(e.target.value)}
        />
       {isMobile &&  <StyledButton
          className="search-input-button"
          $disabled={!value}
          onClick={searchSession}
        >
          <ArrowUp size={16} color="white" />
        </StyledButton>}
      </StyledInputContainer>
    </>
  );
}

const StyledButton = styled(LightButton)<{ $disabled: boolean }>(
  ({ $disabled }) => ({
    borderRadius: "50%",
    border: "none",
    boxShadow: "none",
    width: "35px",
    height: "35px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    opacity: $disabled ? 0.5 : 1,
    position: "absolute",
    right: 5,
  })
);

const StyledInputContainer = styled(RowFlex)`
  background-color: ${colors.dark.inputBg};
  border-radius: 14px;
  padding: 0;
  position: relative;
`;

const StyledInput = styled("input")`
  height: 35px;
  width: 100%;
  text-indent: 10px;
  border: none;
  outline: none;
  background-color: transparent;
  color: ${colors.dark.textMain};
  font-family: "IBM Plex Mono", monospace;
  padding-right: 40px;
  &::placeholder {
    transition: opacity 0.2s;
  }
  &:focus::placeholder {
    opacity: 0; /* Hides the placeholder */
  }
`;
