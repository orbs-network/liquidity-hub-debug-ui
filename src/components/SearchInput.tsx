/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from "react";
import styled from "styled-components";
import { LightButton, RowFlex, StyledInput } from "@/styles";
import { ArrowUp } from "react-feather";
import { notification } from "antd";
import { colors } from "@/consts";
import { useIsMobile } from "@/hooks";

export function SearchInput({
  className = "",
  placeholder = "Search...",
  onSubmit,
}: {
  className?: string;
  placeholder?: string;
  onSubmit: (value: string) => void;
}) {
  const [value, setVale] = useState("");
  const isMobile = useIsMobile();
  const [api, contextHolder] = notification.useNotification();

  const onSearch = useCallback(() => {
    if (!value) return;
    try {
      onSubmit(value);
      setVale("");
    } catch (error) {
      api.error({
        showProgress: true,
        pauseOnHover: true,
        message: "Invalid input",
        description: (error as Error).message,
        placement: "top",
      });
    }
  }, [value, onSubmit, api]);

  const onKeyDown = useCallback(
    (e: any) => {
      if (e.key === "Enter") {
        onSearch();
      }
    },
    [onSearch]
  );

  return (
    <>
      {contextHolder}
      <StyledInputContainer className={className}>
        <StyledInput
          placeholder={placeholder}
        value={value}
          onKeyDown={onKeyDown}
          onChange={(e: any) => setVale(e.target.value)}
        />
        {isMobile && (
          <StyledButton
            className="search-input-button"
            $disabled={!value}
            onClick={onSearch}
          >
            <ArrowUp size={16} color="white" />
          </StyledButton>
        )}
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
  width: 100%;
`;


