import { Order, OrderStatus, OrderType } from "@orbs-network/twap-sdk";
import _ from "lodash";
import { useTwapOrders } from "@/lib/queries/use-twap-orders-query";
import { useEffect, useMemo } from "react";
import { abbreviate, getPartnerByTwapExchange } from "@/utils";
import { useAppParams, usePartnerWithId } from "@/hooks";
import moment from "moment";
import { Card } from "@/components/card";
import { useNetwork } from "@/hooks/hooks";
import { Partner } from "@/types";
import { useConfigs } from "@/lib/queries/use-configs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "../components/progress";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { OverviewHeader } from "./header";
import { DateSelector } from "@/components/date-selector";

type ExtendedOrder = Order & {
  partner: Partner;
};

const useGroupByExchange = () => {
  const { data: orders } = useTwapOrders();
  const { data: configs } = useConfigs();

  return useMemo(() => {
    if (!orders || !configs) return {};
    const extendedOrders: ExtendedOrder[] = orders
      .map((order) => {
        const partner = getPartnerByTwapExchange(
          configs,
          order.exchange,
          order.chainId
        );
        if (!partner) return null;
        return {
          ...order,
          partner,
        };
      })
      .filter((order) => order !== null);
    return _.mapValues(
      _.groupBy(extendedOrders, "partner.id"),
      (exchangeGroup) => _.groupBy(exchangeGroup, "chainId")
    );
  }, [orders, configs]);
};

const useInitPage = () => {
  const { query, setQuery } = useAppParams();

  useEffect(() => {
    if (!query.timestamp) {
      setQuery.updateQuery({
        ...query,
        timestamp: moment().subtract(1, "day").valueOf(),
      });
    }
  }, [query, setQuery]);
};

export function OverviewPage() {
  const { isLoading } = useTwapOrders();

  useInitPage();

  return (
    <div className="flex flex-col gap-4">
    
      <div className="flex items-center gap-2 ml-auto">
        <DateSelector />
      </div>
      <OverviewHeader />
      {isLoading ? <Loader /> : <Exchanges />}
    </div>
  );
}

const Exchanges = () => {
  const groupedOrders = useGroupByExchange();
  return (
    <div className="w-full grid grid-cols-2 gap-4">
      {Object.entries(groupedOrders).map(([partnerId, exchanges]) => {
        return Object.entries(exchanges).map(([chainId, orders]) => {
          return (
            <Exchange
              key={`${chainId}-${partnerId}`}
              orders={orders}
              chainId={Number(chainId)}
              partnerId={partnerId}
            />
          );
        });
      })}
    </div>
  );
};

const Loader = () => {
  return (
    <Card
      className="w-full h-[200px] flex items-center justify-center"
      isLoading
    />
  );
};

const Label = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-secondary-foreground text-[14px]">{children}</p>;
};
const Exchange = ({
  orders,
  chainId,
  partnerId,
}: {
  orders: Order[];
  chainId: number;
  partnerId: string;
}) => {
  const chain = useNetwork(chainId);
  const partner = usePartnerWithId(partnerId);

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={partner?.logo} className="object-cover" />
            </Avatar>
            {partner?.name}
          </div>
          <Badge className="text-xs uppercase flex items-center gap-2">
            {chain?.shortname}
            <Avatar className="w-5 h-5">
              <AvatarImage src={chain?.logoUrl} className="object-cover" />
            </Avatar>
          </Badge>
        </div>
      </Card.Header>
      <Card.Content className="flex flex-col gap-[12px]">
        <div className="flex items-center gap-2 justify-between">
          <Label>Total:</Label>
          <p className="font-bold text-white text-lg">
            {" "}
            {abbreviate(orders.length.toString())}
          </p>
        </div>
        <CompletionRate orders={orders} />
        <StatusesRates orders={orders} />

        <OrderTypes orders={orders} />
        <TotalUsd orders={orders} />
        <FilledUsd orders={orders} />
      </Card.Content>
    </Card>
  );
};

const useStatusesRates = (orders: Order[]) => {
  return useMemo(() => {
    if (!orders) return {};
    const open = orders.filter(
      (order) => order.status === OrderStatus.Open
    ).length;
    const completed = orders.filter(
      (order) => order.status === OrderStatus.Completed
    ).length;
    const cancelled = orders.filter(
      (order) => order.status === OrderStatus.Canceled
    ).length;
    const expired = orders.filter(
      (order) => order.status === OrderStatus.Expired
    ).length;
    return {
      open: {
        amount: open,
        percent: (open / orders.length) * 100,
      },
      completed: {
        amount: completed,
        percent: (completed / orders.length) * 100,
      },
      cancelled: {
        amount: cancelled,
        percent: (cancelled / orders.length) * 100,
      },
      expired: {
        amount: expired,
        percent: (expired / orders.length) * 100,
      },
    };
  }, [orders]);
};

const CompletionRate = ({ orders }: { orders: Order[] }) => {
  const { completed } = useStatusesRates(orders);

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center gap-2 justify-between">
        <Label>Completion Rate</Label>
        <p className="text-sm">{Number(completed?.percent?.toFixed(2))}%</p>
      </div>
      <Progress progress={completed?.percent || 0} className="w-full" />
    </div>
  );
};

const StatusesRates = ({ orders }: { orders: Order[] }) => {
  const { open, completed, cancelled, expired } = useStatusesRates(orders);

  if (!open || !completed || !cancelled || !expired) return null;

  return (
    <div className="grid grid-cols-2 gap-2">
      <StatusRate text="Open" amount={open.amount} percent={open.percent} />
      <StatusRate
        text="Completed"
        amount={completed.amount}
        percent={completed.percent}
      />
      <StatusRate
        text="Cancelled"
        amount={cancelled.amount}
        percent={cancelled.percent}
      />
      <StatusRate
        text="Expired"
        amount={expired.amount}
        percent={expired.percent}
      />
    </div>
  );
};

const TotalUsd = ({ orders }: { orders: Order[] }) => {
  const totalUsd = useMemo(() => {
    return orders.reduce((acc, order) => {
      return acc + Number(order.tradeDollarValueIn);
    }, 0);
  }, [orders]);

  return (
    <div className="flex items-center gap-2 justify-between">
      <Label>Total USD:</Label>
      <p className="text-sm">${abbreviate(totalUsd.toString())}</p>
    </div>
  );
};


const FilledUsd = ({ orders }: { orders: Order[] }) => {
  const filledUsd = useMemo(() => {
    return orders.reduce((acc, order) => {
      return acc + Number(order.filledDollarValueIn);
    }, 0);
  }, [orders]);

  return (
    <div className="flex items-center gap-2 justify-between">
      <Label>Filled USD:</Label>
      <p className="text-sm">${abbreviate(filledUsd.toString())}</p>
    </div>
  );
};

const OrderTypes = ({ orders }: { orders: Order[] }) => {
  const { limit, twapMarket } = useMemo(() => {
    const limit = orders.filter(
      (order) => order.type === OrderType.LIMIT
    ).length;
    const twapLimit = orders.filter(
      (order) => order.type === OrderType.TWAP_LIMIT
    ).length;
    const twapMarket = orders.filter(
      (order) => order.type === OrderType.TWAP_MARKET
    ).length;

    return {
      limit: {
        amount: limit + twapLimit,
        percent: ((limit + twapLimit) / orders.length) * 100,
      },

      twapMarket: {
        amount: twapMarket,
        percent: (twapMarket / orders.length) * 100,
      },
    };
  }, [orders]);

  return (
    <div className="flex flex-col gap-2">
      <Label>Order Types:</Label>
      <div className="flex items-center gap-2 justify-between">
        <p className="text-sm">
          Limit: {limit.amount}{" "}
          <small className="text-xs text-secondary-foreground">
            ({Number(limit.percent.toFixed(2))}%)
          </small>
        </p>
        <p className="text-sm">
          Market: {twapMarket.amount}{" "}
          <small className="text-xs text-secondary-foreground">
            ({Number(twapMarket.percent.toFixed(2))}%)
          </small>
        </p>
      </div>
    </div>
  );
};

const StatusRate = ({
  text,
  amount,
  percent,
}: {
  text: string;
  amount: number;
  percent: number;
}) => {
  return (
    <div className="flex items-center gap-2 justify-between bg-slate-400/10 rounded-lg p-2">
      <Label>{text}</Label>
      <p className="text-sm">
        {abbreviate(amount.toString())}
        <small className="text-xs text-secondary-foreground">
          {" "}
          ({Number(percent.toFixed(2))}%)
        </small>
      </p>
    </div>
  );
};

