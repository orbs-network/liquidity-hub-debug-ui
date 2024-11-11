import { useCallback, useMemo, useState } from "react";
import _ from "lodash";
import { useAppParams } from "hooks";
import { Avatar, Popover, Button } from "antd";
import { styled } from "styled-components";
import { ColumnFlex, RowFlex } from "styles";
import { Partner, partners } from "partners";
import { XCircle } from "react-feather";

export function PartnerSelect() {
  const { query, setQuery } = useAppParams();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
  };
  const onSelect = useCallback(
    (partner: Partner) => {
      setQuery({
        exchangeAddress: partner.getExchangeByChainId(query.chainId)?.exchangeAddress,
      });
      setIsOpen(false);
    },
    [setQuery, query.chainId]
  );

  const onReset = useCallback(() => {
    setQuery({ exchangeAddress: undefined });
    setIsOpen(false);
  }, [setQuery]);

  const selectedPartner = useMemo(
    () =>
      Object.values(partners).find((it) =>
        it.isExchangeExists(query.exchangeAddress)
      ),
    [query.exchangeAddress]
  );

  return (
    <>
      <Popover
        content={
          <List
            onReset={onReset}
            onSelect={onSelect}
            selectedPartner={selectedPartner}
          />
        }
        trigger="click"
        overlayInnerStyle={{ padding: 7 }}
        open={isOpen}
        onOpenChange={handleOpenChange}
      >
        <div>
          <Trigger selectedPartner={selectedPartner} />
        </div>
      </Popover>
    </>
  );
}

const Trigger = ({ selectedPartner }: { selectedPartner?: Partner }) => {
  return (
    <Button>
      {!selectedPartner ? (
        "All Partners"
      ) : (
        <RowFlex>
          <Avatar
            src={selectedPartner.logoUrl}
            alt={selectedPartner.name}
            size={25}
          />
          <span>{selectedPartner.name}</span>
        </RowFlex>
      )}
    </Button>
  );
};

const List = ({
  onSelect,
  selectedPartner,
  onReset,
}: {
  onSelect: (item: Partner) => void;
  selectedPartner?: Partner;
  onReset: () => void;
}) => {
  const chainId = useAppParams().query.chainId as number;

  return (
    <StyledList>
      {selectedPartner && <StyledListItem onClick={onReset}>
        <XCircle size={25} />
        <span>All Partners</span>
      </StyledListItem>}
      {Object.values(partners)
        .filter((it) => it.isChainSupported(chainId))
        .map((partner) => {
          return (
            <PartnerComponent
              onSelect={onSelect}
              partner={partner}
              key={partner.name}
              isSelected={partner.name === selectedPartner?.name}
            />
          );
        })}
    </StyledList>
  );
};

const PartnerComponent = ({
  isSelected,
  onSelect,
  partner,
}: {
  isSelected: boolean;
  partner: Partner;
  onSelect: (value: Partner) => void;
}) => {
  return (
    <StyledListItem
      $selected={isSelected}
      key={partner.name}
      onClick={() => onSelect(partner)}
    >
      <Avatar src={partner?.logoUrl} alt={partner.name} size={25} />
      <span>{partner.name}</span>
    </StyledListItem>
  );
};

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
