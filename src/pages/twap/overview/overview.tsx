import {
  eqIgnoreCase,
  Order,
  OrderStatus,
  OrderType,
} from "@orbs-network/twap-sdk";
import { useTwapOrders } from "@/lib/queries/use-twap-orders-query";
import { useEffect, useMemo } from "react";
import { abbreviate, getPartnerByTwapConfig } from "@/utils";
import { useAppParams } from "@/hooks";
import moment from "moment";
import { Card } from "@/components/card";
import { useNetwork } from "@/hooks/hooks";
import { useConfigs } from "@/lib/queries/use-configs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "../components/progress";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { OverviewHeader } from "./header";
import { DateSelector } from "@/components/date-selector";
import { Partner } from "@/types";
import { QueryFilters } from "@/components/query-filters";
import { Pie, PieChart, Label as RechartsLabel } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import COLORS from "@/colors.json";
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
  const { data: configs } = useConfigs();

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
        <QueryFilters
          filters={{
            partnerIdFilter: true,
            chainIdFilter: true,
          }}
        />
        <DateSelector />
      </div>
      <OverviewHeader />

      {isLoading ? <Loader /> : <Exchanges />}
    </div>
  );
}

const Exchanges = () => {
  const exchanges = useExchanges();

  return (
    <div className="w-full grid grid-cols-2 gap-4">
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
      className="w-full h-[200px] flex items-center justify-center"
      isLoading
    />
  );
};

const Label = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-secondary-foreground text-[14px]">{children}</p>;
};
const Exchange = ({ exchange }: { exchange: Exchange }) => {
  const chain = useNetwork(exchange.chainId);

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage
                src={exchange.partner?.logo}
                className="object-cover"
              />
            </Avatar>
            {exchange.partner?.name}
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
            {abbreviate(exchange.orders.length.toString())}
          </p>
        </div>
        <CompletionRate orders={exchange.orders} />
        <StatusesRates orders={exchange.orders} />

        <OrderTypes orders={exchange.orders} />
        <TotalUsd orders={exchange.orders} />
        <FilledUsd orders={exchange.orders} />
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

console.log({ COLORS });

const OrdersChart = () => {
  const exchanges = useExchanges();

  const data = useMemo(() => {
    return exchanges?.map((it, index) => ({
      partner: it.partner.name,
      orders: it.orders.length,
      fill: COLORS[index % COLORS.length],
    }));
  }, [exchanges]);


  const totalOrders = useMemo(() => {
    return exchanges?.reduce((acc, it) => acc + it.orders.length, 0);
  }, [exchanges]);

  const chartConfig = {
    orders: { label: "orders" },
    ...data.reduce((config, item) => {
      const key = item.partner.toLowerCase().replace(/\s+/g, "") + item.fill;
      config[key] = {
        label: item.partner,
        color: item.fill,
      };
      return config;
    }, {} as Record<string, { label: string; color: string }>),
  } satisfies ChartConfig;

  return (
    <div className="flex flex-row gap-2 justify-start">
      <ChartContainer
        config={chartConfig}
        className="aspect-square max-h-[250px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={data}
            dataKey="orders"
            nameKey="partner"
            innerRadius={60}
            strokeWidth={5}
          >
            <RechartsLabel
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-white text-3xl font-bold"
                      >
                        {abbreviate(totalOrders.toString())}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Orders
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="grid grid-cols-3 gap-2">
        {data.map((item) => (
          <div key={item.partner} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: item.fill }}
            />
            <p>{item.partner}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
