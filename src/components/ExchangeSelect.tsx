import { useCallback, useMemo, useState } from "react";
import _ from "lodash";
import { useAppParams } from "hooks";
import { Avatar, Popover, Button } from "antd";
import { styled } from "styled-components";
import { ColumnFlex, RowFlex } from "styles";
import { Configs } from "@orbs-network/twap-sdk";

type Item = {
  address: string;
  label: string;
  image: string;
  chainId: number;
};

let list: Item[] = _.map(Configs, (it) => {
  return {
    address: it.exchangeAddress,
    chainId: it.chainId,
    label: it.name,
    image: "",
  };
});

export function ExchangeSelect() {
  const { query, setQuery } = useAppParams();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
  };
  const onSelect = useCallback(
    (item: Item) => {
      setQuery({ chainId: item.chainId, exchange: item.address });
      setIsOpen(false);
    },
    [setQuery]
  );

  const exchange = useMemo(
    () =>
      list.find(
        (it) => it.address === query.exchange && it.chainId === query.chainId
      ),
    [query.exchange, query.chainId]
  );

  return (
    <>
      <Popover
        content={<List onSelect={onSelect} exchange={exchange?.address} />}
        trigger="click"
        overlayInnerStyle={{ padding: 7 }}
        open={isOpen}
        onOpenChange={handleOpenChange}
      >
        <div>
          <Trigger exchange={exchange} />
        </div>
      </Popover>
    </>
  );
}

const Trigger = ({ exchange }: { exchange?: Item }) => {
  return (
    <Button>
      {!exchange ? (
        "Select exchange"
      ) : (
        <RowFlex>
          <Avatar src={exchange.image} alt={exchange.label} size={25} />
          <span>{exchange.label}</span>
        </RowFlex>
      )}
    </Button>
  );
};

const List = ({
  onSelect,
  exchange,
}: {
  onSelect: (item: Item) => void;
  exchange?: string;
}) => {
  return (
    <StyledList>
      {list.map((item) => {
        return (
          <StyledListItem
            $selected={exchange === item.address}
            key={item.label}
            onClick={() => onSelect(item)}
          >
            <Avatar src={item.image} alt={item.label} size={25} />
            <span>{item.label}</span>
          </StyledListItem>
        );
      })}
    </StyledList>
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
