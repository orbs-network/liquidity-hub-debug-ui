import { ReactNode, useCallback, useMemo, useState } from "react";
import _ from "lodash";
import { networks } from "networks";
import {
  useAppParams,
  useChainConfig,
  useIsMobile,
  usePartnerFromName,
} from "hooks";
import { Avatar, Drawer, Typography } from "antd";
import { styled } from "styled-components";
import { ColumnFlex, LightButton, RowFlex } from "styles";
import { ChevronDown } from "react-feather";
import { partners } from "partners";
import { MOBILE } from "consts";

export const ChainSelect = ({ type }: { type: "twap" | "lh" }) => {
  const [open, setOpen] = useState(false);
  const { query, setQuery } = useAppParams();
  const selectedChain = useChainConfig(query.chainId);
  const selectedPartner = usePartnerFromName(query.partner);

  const onOpen = useCallback(() => setOpen(true), []);

  const onClose = useCallback(() => setOpen(false), []);

  const onSelect = useCallback(
    (chainId?: number) => {
      setQuery({ chainId });
      setOpen(false);
    },
    [setQuery]
  );

  const onReset = useCallback(() => {
    setQuery({ chainId: undefined });
  }, [setQuery]);

  const filteredChains = useMemo(() => {
    if (selectedPartner && type === "lh") {
      return Object.values(networks).filter((it) =>
        selectedPartner.supportsLiquidityHub(it.id)
      );
    }
    if (selectedPartner && type === "twap") {
      return Object.values(networks).filter((it) =>
        selectedPartner.supportsTwap(it.id)
      );
    }
    if (type === "lh") {
      return Object.values(networks).filter((it) => {
        return Object.values(partners).some((partner) =>
          partner.supportsLiquidityHub(it.id)
        );
      });
    }
    if (type === "twap") {
      return Object.values(networks).filter((it) => {
        return Object.values(partners).some((partner) =>
          partner.supportsTwap(it.id)
        );
      });
    }
    return [];
  }, [selectedPartner, type, query.chainId]);

  return (
    <>
      <Trigger
        emptyText="Chain"
        onClick={onOpen}
        logo={selectedChain?.logoUrl}
        label={selectedChain?.name}
      />
      <FilterDrawer
        showReset={Boolean(selectedChain)}
        onReset={onReset}
        title="Select Chain"
        onClose={onClose}
        isOpen={open}
      >
        <StyledList>
          {filteredChains?.map((network) => {
            return (
              <StyledListItem
                $selected={selectedChain?.id === network.id}
                key={network.id}
                onClick={() => onSelect(network.id)}
              >
                <Avatar src={network.logoUrl} alt={network.name} size={25} />
                <span>{network.name}</span>
              </StyledListItem>
            );
          })}
        </StyledList>
      </FilterDrawer>
    </>
  );
};

export const PartnerSelect = ({ type }: { type: "lh" | "twap" }) => {
  const [open, setOpen] = useState(false);
  const { query, setQuery } = useAppParams();
  const selectedPartner = usePartnerFromName(query.partner);

  const onOpen = useCallback(() => setOpen(true), []);

  const onClose = useCallback(() => setOpen(false), []);

  const onSelect = useCallback(
    (partner?: string) => {
      setQuery({ partner: partner?.toLowerCase() });
      setOpen(false);
    },
    [setQuery]
  );

  const onReset = useCallback(() => {
    setQuery({ partner: undefined });
  }, [setQuery]);

  const filteredPartners = useMemo(() => {
    if (query.chainId && type === "lh") {
      return Object.values(partners).filter((it) =>
        it.supportsLiquidityHub(query.chainId)
      );
    }
    if (query.chainId && type === "twap") {
      return Object.values(partners).filter((it) =>
        it.supportsTwap(query.chainId)
      );
    }
    if (type === "lh") {
      return Object.values(partners).filter((partner) => {
        return Object.values(networks).some((network) =>
          partner.supportsLiquidityHub(network.id)
        );
      });
    }

    if (type === "twap") {
      return Object.values(partners).filter((partner) => {
        return Object.values(networks).some((network) =>
          partner.supportsTwap(network.id)
        );
      });
    }
    return [];
  }, [selectedPartner, type, query.chainId]);

  return (
    <>
      <Trigger
        emptyText="Partner"
        onClick={onOpen}
        logo={selectedPartner?.logoUrl}
        label={selectedPartner?.name}
      />
      <FilterDrawer
        showReset={Boolean(selectedPartner)}
        onReset={onReset}
        title="Select Partner"
        onClose={onClose}
        isOpen={open}
      >
        <StyledList>
          {filteredPartners.map((partner) => {
            return (
              <StyledListItem
                $selected={selectedPartner?.name === partner.name}
                key={partner.name}
                onClick={() => onSelect(partner.name)}
              >
                <Avatar src={partner.logoUrl} alt={partner.name} size={25} />
                <span>{partner.name}</span>
              </StyledListItem>
            );
          })}
        </StyledList>
      </FilterDrawer>
    </>
  );
};

const Filters = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

Filters.Chain = ChainSelect;
Filters.Partner = PartnerSelect;

export { Filters };

const FilterDrawer = ({
  isOpen,
  onClose,
  children,
  title,
  onReset,
  showReset,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
  onReset: () => void;
  showReset?: boolean;
}) => {
  const isMobile = useIsMobile();
  const reset = useCallback(() => {
    onReset();
    onClose();
  }, [onReset, onClose]);

  return (
    <Drawer
      title={title}
      placement={isMobile ? "bottom" : "right"}
      width={isMobile ? "100%" : "300px"}
      onClose={onClose}
      open={isOpen}
      height={isMobile ? "96%" : "100%"}
      extra={
        showReset ? <StyledReset onClick={reset}>Reset</StyledReset> : null
      }
    >
      {children}
    </Drawer>
  );
};

const StyledReset = styled("button")({
  border: "none",
  background: "transparent",
  cursor: "pointer",
  padding: "5px 10px",
  borderRadius: 20,
  backgroundColor: "#75DBE3",
  color: "white",
});

const Trigger = ({
  onClick,
  logo,
  label,
  emptyText,
}: {
  onClick?: () => void;
  logo?: string;
  label?: string;
  emptyText: string;
}) => {
  const isMobile = useIsMobile();
  if (!label) {
    return (
      <StyledTriggerEmpty onClick={onClick}>
        <Typography>{emptyText}</Typography>
      </StyledTriggerEmpty>
    );
  }
  return (
    <LightButton onClick={onClick}>
      <Avatar src={logo} alt={label} size={35} />
      {!isMobile && (
        <Typography style={{ whiteSpace: "nowrap" }}>{label}</Typography>
      )}
      <ChevronDown size="16px" />
    </LightButton>
  );
};
const StyledTriggerEmpty = styled(LightButton)({
  boxShadow: "rgba(14, 14, 44, 0.4) 0px -1px 0px 0px inset",
  background: "#1fc7d4",
  color: "white",
  borderRadius: 20,
  padding: "5px 15px",
  cursor: "pointer",
  ".ant-typography": {
    color: "white",
    fontWeight: 500,
    whiteSpace: "nowrap",
  },
  [`@media (max-width: ${MOBILE}px)`]: {
    padding: "4px 10px",
    ".ant-typography": {
      fontSize: 13,
    },
  },
});

const StyledList = styled(ColumnFlex)({
  gap: 5,
});

const StyledListItem = styled(RowFlex)<{ $selected?: boolean }>`
  gap: 10px;
  justify-content: flex-start;
  width: 100%;
  border-radius: 10px;
  padding: 5px 20px 5px 5px;
  cursor: pointer;
  transition: background 0.3s;
  background: ${(props) => (props.$selected ? "#f0f0f0" : "transparent")};

  &:hover {
    background: #f0f0f0;
  }
`;
