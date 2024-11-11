import { useCallback, useMemo, useState } from "react";
import _ from "lodash";
import { networks } from "networks";
import { useAppParams } from "hooks";
import { Avatar, Popover, Button } from "antd";
import { styled } from "styled-components";
import { ColumnFlex, RowFlex } from "styles";
import {XCircle} from "react-feather"
import { useLocation } from "react-router";

type Item = {
  id: number;
  label: string;
  image: string;
};

let list = _.map(networks, (it) => {
  return {
    id: it.id,
    label: it.name,
    image: it.logoUrl,
  };
});

export function ChainSelect() {

  const { query, setQuery } = useAppParams();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
  };
  const onSelect = useCallback(
    (chainId?: number) => {
      setQuery({ chainId, exchangeAddress: undefined });
      setIsOpen(false);
    },
    [setQuery]
  );

  const selectedChain = useMemo(
    () => list.find((it) => it.id === query.chainId),
    [query.chainId]
  );

  return (
    <>
      <Popover
        content={<List onSelect={onSelect} selectedChain={selectedChain?.id} />}
        trigger="click"
        overlayInnerStyle={{ padding: 7 }}
        open={isOpen}
        onOpenChange={handleOpenChange}
      >
        <div>
          <Trigger selectedChain={selectedChain} />
        </div>
      </Popover>
    </>
  );
}

const Trigger = ({ selectedChain }: { selectedChain?: Item }) => {
  return (
    <Button>
      {!selectedChain ? (
        "All chains"
      ) : (
        <RowFlex>
          <Avatar
            src={selectedChain.image}
            alt={selectedChain.label}
            size={25}
          />
          <span>{selectedChain.label}</span>
        </RowFlex>
      )}
    </Button>
  );
};

const List = ({
  onSelect,
  selectedChain,
}: {
  onSelect: (chainId?: number) => void;
  selectedChain?: number;
}) => {
  const pathname = useLocation().pathname
  const hideReset = useMemo(() => pathname.includes('twap'), [pathname])
  return (
    <StyledList>
      {!hideReset && selectedChain && (
        <StyledListItem onClick={() => onSelect(undefined)}>
          <XCircle size={25} />
          <span>All Chains</span>
        </StyledListItem>
      )}
      {list.map((item) => {
        return (
          <StyledListItem
            $selected={selectedChain === item.id}
            key={item.id}
            onClick={() => onSelect(item.id)}
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
