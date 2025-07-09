import { ReactNode, useCallback, useMemo, useState } from "react";
import { useAppParams, useIsMobile, usePartnerWithId } from "@/hooks";
import { Avatar, Drawer, Typography } from "antd";
import { styled } from "styled-components";
import { ColumnFlex, LightButton, RowFlex } from "@/styles";
import { ChevronDown } from "react-feather";
import { partners } from "@/partners";
import { colors, MOBILE } from "@/consts";
import { ROUTES } from "@/config";
import { useLocation } from "react-router-dom";
import { networks } from "@/networks";
import { useNetwork } from "@/hooks/hooks";

export const ChainSelect = () => {
  const isTwap = useLocation().pathname.includes(ROUTES.twap.root);
  const [open, setOpen] = useState(false);
  const { query, setQuery } = useAppParams();
  const selectedChain = useNetwork(query.chainId);
  const selectedPartner = usePartnerWithId(query.partner);

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
    if (selectedPartner && !isTwap) {
      return Object.values(networks).filter((it) =>
        selectedPartner.isSupportedLH(it.id)
      );
    }
    if (selectedPartner && isTwap) {
      return Object.values(networks).filter((it) =>
        selectedPartner.isSupportedTwap(it.id)
      );
    }
    if (!isTwap) {
      return Object.values(networks).filter((it) => {
        return Object.values(partners).some((partner) =>
          partner.isSupportedLH(it.id)
        );
      });
    }
    if (isTwap) {
      return Object.values(networks).filter((it) => {
        return Object.values(partners).some((partner) =>
          partner.isSupportedTwap(it.id)
        );
      });
    }
    return [];
  }, [selectedPartner, isTwap]);

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
                <Avatar
                  src={network.native.logoUrl}
                  alt={network.name}
                  size={25}
                />
                <Typography>{network.name}</Typography>
              </StyledListItem>
            );
          })}
        </StyledList>
      </FilterDrawer>
    </>
  );
};

export const PartnerSelect = () => {
  const [open, setOpen] = useState(false);
  const { query, setQuery } = useAppParams();
  const selectedPartner = usePartnerWithId(query.partner);
  const isTwap = useLocation().pathname.includes(ROUTES.twap.root);

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
    if (query.chainId && !isTwap) {
      return Object.values(partners).filter((it) =>
        it.isSupportedLH(query.chainId)
      );
    }
    if (query.chainId && isTwap) {
      return Object.values(partners).filter((it) =>
        it.isSupportedTwap(query.chainId)
      );
    }
    if (!isTwap) {
      return Object.values(partners).filter((partner) => {
        return Object.values(networks).some((network) =>
          partner.isSupportedLH(network.id)
        );
      });
    }

    if (isTwap) {
      return Object.values(partners).filter((partner) => {
        return Object.values(networks).some((network) =>
          partner.isSupportedTwap(network.id)
        );
      });
    }
    return [];
  }, [isTwap, query.chainId]);

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
                <Typography>{partner.name}</Typography>
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
    <CustomDrawer
      title={title}
      styles={{
        header: {
          border: "unset",
        },
        content: {
          backgroundColor: colors.dark.cardBg,
          color: colors.dark.textMain,
        },
      }}
      placement={isMobile ? "bottom" : "right"}
      width={isMobile ? "100%" : "400px"}
      onClose={onClose}
      open={isOpen}
      height={isMobile ? "96%" : "100%"}
      extra={
        showReset ? (
          <StyledReset onClick={reset}>
            <Typography>Reset</Typography>
          </StyledReset>
        ) : null
      }
    >
      {children}
    </CustomDrawer>
  );
};

const CustomDrawer = styled(Drawer)`

`;

const StyledReset = styled(LightButton)({
  padding: "4px 12px"
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
    <StyledFilterButton onClick={onClick}>
      <Avatar src={logo} alt={label} size={34} />
      {!isMobile && (
        <Typography style={{ whiteSpace: "nowrap" }}>{label}</Typography>
      )}
      <ChevronDown size="16px" />
    </StyledFilterButton>
  );
};

const StyledFilterButton = styled(LightButton)({
  height: 34,
});

const StyledTriggerEmpty = styled(StyledFilterButton)({
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
  padding: 8px 20px 8px 5px;
  cursor: pointer;
  transition: background 0.3s;
  background: ${(props) =>
    props.$selected ? colors.dark.inputBg : "transparent"};

  &:hover {
    background: ${colors.dark.inputBg};
  }
`;
