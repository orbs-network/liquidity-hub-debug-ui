import {
  eqIgnoreCase,
  Order,
  OrderStatus,
  OrderType,
} from "@orbs-network/twap-sdk";
import { useTwapOrders } from "@/lib/twap/queries";
import { useEffect, useMemo } from "react";
import { getPartnerByTwapConfig } from "@/lib/twap/utils";
import { useQueryFilterParams } from "@/lib/hooks/use-query-filter-params";
import moment from "moment";
import { Card } from "@/components/card";
import { useNetwork } from "@/hooks/hooks";
import { useTwapConfigs } from "@/lib/twap/queries";
import { Badge } from "@/components/ui/badge";
import { Progress } from "./components/progress";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { DateSelector } from "@/components/date-selector";
import { Partner } from "@/lib/types";
import { PartnerConfigs } from "./components/partner-configs";
import { AuthWrapper } from "@/components/auth-wrapper";
import { abbreviate } from "@/lib/utils";
import { ChartArea, ChartLineIcon, ChartPieIcon } from "lucide-react";
import { OverviewHeader } from "@/components/overview-header";
type Exchange = {
  partner: Partner;
  chainId: number;
  orders: Order[];
};

const Percent = ({ value }: { value: number }) => {
  return (
    <small className="text-[13px] text-secondary-foreground">
      {" "}
      ({!value ? "0%" : `${Number(value.toFixed(2))}%`})
    </small>
  );
};

const useExchanges = () => {
  const { data: orders } = useTwapOrders();
  const { data: configs } = useTwapConfigs();

  return useMemo((): Exchange[] => {
    if (!orders || !configs) return [];

    const result = configs
      .map((config) => {
        const partner = getPartnerByTwapConfig(config);
        if (!partner) return null;
        return {
          partner,
          chainId: config.chainId,
          orders: orders.filter(
            (order) =>
              eqIgnoreCase(order.exchange, config.exchangeAddress) &&
              order.chainId === config.chainId
          ),
        };
      })
      .filter((exchange) => exchange !== null)
      .sort((a, b) => b.orders.length - a.orders.length);

    return result;
  }, [orders, configs]);
};

const useInitPage = () => {
  const { query, setQuery } = useQueryFilterParams();

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
    <AuthWrapper>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 ml-auto">
          <DateSelector />
        </div>
        <Header />

        {isLoading ? <Loader /> : <Exchanges />}
      </div>
    </AuthWrapper>
  );
}

const Exchanges = () => {
  const exchanges = useExchanges();

  return (
    <div className="w-full grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
      {exchanges.map((exchange) => {
        return (
          <Exchange
            key={`${exchange.chainId}-${exchange.partner?.id}`}
            exchange={exchange}
          />
        );
      })}
    </div>
  );
};

const Loader = () => {
  return (
    <Card
      className="w-full h-[200px] flex items-center justify-center">
        <Card.Content isLoading={true} />
      </Card>
  );
};

const Label = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-secondary-foreground text-[14px]">{children}</p>;
};
const Exchange = ({ exchange }: { exchange: Exchange }) => {
  return (
    <Card>
      <Card.Header>
        <ExchangeHeader exchange={exchange} />
      </Card.Header>
      <Card.Content className="flex flex-col gap-[12px]">
        <ExchangeTotalOrders orders={exchange.orders} />
        <StatusesRates orders={exchange.orders} />
        <CompletionRate orders={exchange.orders} />
        <OrderTypes orders={exchange.orders} />
      </Card.Content>
    </Card>
  );
};

const ExchangeHeader = ({ exchange }: { exchange: Exchange }) => {
  const chain = useNetwork(exchange.chainId);

  return (
    <div className="flex items-center gap-2 justify-between">
      <div className="flex items-center gap-2">
        <Avatar className="w-6 h-6">
          <AvatarImage src={exchange.partner?.logo} className="object-cover" />
        </Avatar>
        {exchange.partner?.name}
      </div>
      <PartnerConfigs
        partner={exchange.partner}
        initialChainId={exchange.chainId}
        trigger={
          <Badge className="text-xs uppercase flex items-center gap-2 hover:bg-slate-700/60">
            {chain?.shortname}
            <Avatar className="w-5 h-5">
              <AvatarImage src={chain?.logoUrl} className="object-cover" />
            </Avatar>
          </Badge>
        }
      />
    </div>
  );
};

const ExchangeTotalOrders = ({ orders }: { orders: Order[] }) => {
  const { data: allOrders } = useTwapOrders();
  return (
    <div className="flex items-center gap-2 justify-between">
      <Label>Total:</Label>
      <p className="font-bold text-white text-lg">
        {" "}
        {abbreviate(orders.length.toString())}
        <Percent value={(orders.length / (allOrders?.length || 0)) * 100} />
      </p>
    </div>
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
        <p className="text-sm">
          {completed?.percent
            ? `${Number(completed?.percent?.toFixed(2))}%`
            : "0%"}
        </p>
      </div>
      <Progress progress={completed?.percent || 0} className="w-full" />
    </div>
  );
};

const StatusesRates = ({ orders }: { orders: Order[] }) => {
  const { open, completed, cancelled, expired } = useStatusesRates(orders);

  if (!open || !completed || !cancelled || !expired) return null;

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
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
          Limit: {limit.amount} <Percent value={limit.percent} />
        </p>
        <p className="text-sm">
          Market: {twapMarket.amount} <Percent value={twapMarket.percent} />
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
        <Percent value={percent} />
      </p>
    </div>
  );
};

function Header() {
  const { data: orders } = useTwapOrders();

  const openOrders = useMemo(() => {
    return (
      orders?.filter((order) => order.status === OrderStatus.Open).length || 0
    );
  }, [orders]);

  const completedOrders = useMemo(() => {
    return (
      orders?.filter((order) => order.status === OrderStatus.Completed)
        .length || 0
    );
  }, [orders]);

  return (
    <OverviewHeader>
      <OverviewHeader.Item
        title="Total Orders"
        value={abbreviate(orders?.length.toString() || "0")}
        icon={<ChartPieIcon />}
      />
      <OverviewHeader.Item
        title="Open Orders"
        value={abbreviate(openOrders.toString() || "0")}
        icon={<ChartArea />}
      />
      <OverviewHeader.Item
        title="Completed Orders"
        value={abbreviate(completedOrders.toString() || "0")}
        icon={<ChartLineIcon />}
      />
    </OverviewHeader>
  );
}
