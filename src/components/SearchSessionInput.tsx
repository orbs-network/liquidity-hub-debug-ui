import { useCallback, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { isValidSessionId, isValidTxHash, isValidWalletAddress } from "utils";
import { RowFlex } from "styles";
import { ROUTES } from "config";
import { ArrowUp } from "react-feather";
import { notification } from "antd";

export function SearchSessionInput({ className = "" }: { className?: string }) {
  const [value, setVale] = useState("");
  const navigate = useNavigate();
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
        <StyledButton
          className="search-input-button"
          $disabled={!value}
          onClick={searchSession}
        >
          <ArrowUp size={16} color="white" />
        </StyledButton>
      </StyledInputContainer>
    </>
  );
}

const StyledButton = styled("button")<{ $disabled: boolean }>(
  ({ $disabled }) => ({
    borderRadius: "50%",
    border: "none",
    boxShadow: "none",
    width: "35px",
    height: "35px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background-color 0.3s",
    backgroundColor: $disabled ? "rgb(215 215 215/1)" : "black",
  })
);

const StyledInputContainer = styled(RowFlex)`
  background-color: rgb(244 244 244/1);
  border-radius: 20px;
  padding: 8px 8px 8px 15px;
`;

const StyledInput = styled("input")`
  flex: 1;
  border: none;
  outline: none;
  background-color: transparent;
  font-size: 16px;
  height: unset;
  &::placeholder {
    transition: opacity 0.2s;
  }
  &:focus::placeholder {
    opacity: 0; /* Hides the placeholder */
  }
`;
