import {
  getOrderExcecutionRate,
  getOrderFillDelayMillis,
  getOrderLimitPriceRate,
  Order,
} from "@orbs-network/twap-sdk";
import { DataDisplay, WalletAddress } from "@/components";
import { useNumberFormatter, useToken } from "@/hooks";
import moment from "moment";
import { createContext, useContext, useMemo } from "react";
import { MillisToDuration } from "@/utils";
import { parseOrderType } from "./utils";
import {
  useTwapConfigByExchange,
  useTwapPartnerByExchange,
} from "@/hooks/twap-hooks";
import { useNetwork } from "@/hooks/hooks";
import { useTwapOrderQuery } from "@/lib/queries/use-twap-orders-query";
import { Card } from "@/components/card";
import { cn } from "@/lib/utils";
import { OrderStatusBadge } from "./components/components";
import { ROUTES } from "@/config";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import { Progress } from "./components/progress";
import { Address } from "@/components/Address";
import { useFormatNumber } from "@/hooks/use-number-format";
import { OrderFills } from "./components/fills";

interface ContextType {
  order?: Order;
}

const Section = ({
  children,
  title,
  className,
}: {
  children: React.ReactNode;
  title: string;
  className?: string;
}) => {
  return (
    <div className="flex flex-col ">
      <div
        className={cn(
          "font-bold text-lg border-b border-border pb-2",
          className
        )}
      >
        {title}
      </div>
      <div className="flex flex-col gap-2 pt-[10px] flex-1">{children}</div>
    </div>
  );
};

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button
      className="bg-slate-800/50 border border-border rounded-lg text-white p-2 hover:bg-slate-800/70 transition-all duration-300 w-fit flex flex-row items-center gap-2"
      onClick={() => navigate(ROUTES.twap.root)}
    >
      <ArrowLeftIcon className="w-4 h-4" />
      <p className="text-sm">Back</p>
    </button>
  );
};

const Context = createContext({} as ContextType);
const useOrderContext = () => {
  return useContext(Context);
};
export function OrderPage() {
  const { data: order, isLoading } = useTwapOrderQuery();

  return (
    <Context.Provider value={{ order }}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between">
          <BackButton />
          {order && <OrderFills order={order} />}
        </div>
        <Card isLoading={isLoading}>
          <Card.Header className="flex flex-row justify-between">
            <p className="text-lg font-bold">Order Details</p>
            <div className="flex flex-row gap-4 items-center">
              {order && <OrderStatusBadge order={order} />}
              <p className="text-sm text-secondary-foreground font-mono font-normal">
                #{order?.id}
              </p>
            </div>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-2 gap-8">
              <BaseInformation className="col-span-1" />
              <OrderConfig className="col-span-1" />
            </div>
            <ExcecutionProgress />
          </Card.Content>
        </Card>
      </div>
    </Context.Provider>
  );
}

const Chain = () => {
  const { order } = useOrderContext();
  const network = useNetwork(order?.chainId);
  return (
    <DataDisplay.Row label="Chain" className="items-center">
      {network?.shortname}{" "}
      <span className="text-secondary-foreground font-mono text-sm ml-2 ">
        ({order?.chainId})
      </span>
    </DataDisplay.Row>
  );
};

const Partner = () => {
  const { order } = useOrderContext();
  const partner = useTwapPartnerByExchange(order?.exchange, order?.chainId);
  return (
    <DataDisplay.Row label="Partner">
      <p>{partner?.name}</p>
    </DataDisplay.Row>
  );
};

const BaseInformation = ({ className = "" }: { className?: string }) => {
  const { order } = useOrderContext();

  return (
    <Section title="Base Information" className={className}>
      <DataDisplay.Row label="Order ID">
        <p>#{order?.id}</p>
      </DataDisplay.Row>
      <Chain />
      <Partner />
      <DataDisplay.Row label="Type">
        {parseOrderType(order?.type)}
      </DataDisplay.Row>
      <DataDisplay.Row label="Created at">
        {moment(order?.createdAt).format("lll")}
      </DataDisplay.Row>
      <DataDisplay.Row label="Deadline">
        {moment(order?.deadline).format("lll")}
      </DataDisplay.Row>
      <DataDisplay.Row label="Tx Hash">
        <Address address={order?.txHash} chainId={order?.chainId} type="tx" />
      </DataDisplay.Row>
    </Section>
  );
};

const OrderConfig = ({ className = "" }: { className?: string }) => {
  const { order } = useOrderContext();
  const config = useTwapConfigByExchange(order?.exchange, order?.chainId);

  return (
    <Section title="Order Config" className={className}>
      <DataDisplay.Row label="Source Amount">
        <DataDisplay.FormattedTokenAmountFromWei
          amount={order?.srcAmount}
          address={order?.srcTokenAddress}
          chainId={order?.chainId}
          usd={order?.tradeDollarValueIn}
        />
      </DataDisplay.Row>
      <DataDisplay.Row label="Source Token">
        {order?.srcTokenSymbol}
      </DataDisplay.Row>
      <DataDisplay.Row label="Destination Token">
        {order?.dstTokenSymbol}
      </DataDisplay.Row>
      <DataDisplay.Row label="Destination Minimum Amount">
        <DataDisplay.FormattedTokenAmountFromWei
          amount={order?.dstMinAmount}
          address={order?.dstTokenAddress}
          chainId={order?.chainId}
        />
      </DataDisplay.Row>
      <SrcChunkAmount />
      <DataDisplay.Row label="Chunks">{order?.chunks}</DataDisplay.Row>
      <DataDisplay.Row label="Fill Delay">
        {config &&
          order &&
          MillisToDuration(getOrderFillDelayMillis(order, config))}
      </DataDisplay.Row>
      <DataDisplay.Row label="Min Chunk Size Usd">
        ${config?.minChunkSizeUsd}
      </DataDisplay.Row>
    </Section>
  );
};

const SrcChunkAmount = () => {
  const { order } = useOrderContext();
  const usd = useMemo(() => {
    const filledUsd = order?.filledDollarValueIn || "0";
    const chunks = order?.chunks || 0;
    return Number(filledUsd) / chunks;
  }, [order]);
  return (
    <DataDisplay.Row label="Src Chunk Amount">
      <DataDisplay.FormattedTokenAmountFromWei
        amount={order?.srcAmountPerChunk}
        address={order?.srcTokenAddress}
        chainId={order?.chainId}
        usd={usd}
      />
    </DataDisplay.Row>
  );
};

const ProgressBar = () => {
  const { order } = useOrderContext();
  const percentF = useNumberFormatter({
    value: order?.progress,
    decimalScale: 2,
  }).formatted;
  return (
    <div className="bg-card-foreground rounded-lg p-4 flex flex-col gap-2 mb-4">
      <div className="flex flex-row justify-between">
        <p className="text-sm text-secondary-foreground font-mono font-bold uppercase">
          Progress
        </p>
        <p className="text-sm text-secondary-foreground font-mono">
          {percentF}%
        </p>
      </div>
      <Progress progress={order?.progress ?? 0} />
    </div>
  );
};

const ExcecutionProgress = () => {
  const { order } = useOrderContext();

  return (
    <Section title="Excecution Progress" className="mt-8">
      <ProgressBar />
      <DataDisplay.Row label="Source Filled Amount">
        <DataDisplay.FormattedTokenAmountFromWei
          amount={order?.filledSrcAmount}
          address={order?.srcTokenAddress}
          usd={order?.filledDollarValueIn}
          chainId={order?.chainId}
        />
      </DataDisplay.Row>
      <DataDisplay.Row label="Destination Filled Amount">
        <DataDisplay.FormattedTokenAmountFromWei
          amount={order?.filledDstAmount}
          address={order?.dstTokenAddress}
          chainId={order?.chainId}
          usd={order?.filledDollarValueOut}
        />
      </DataDisplay.Row>
      <ExecutionPrice />
      <LimitPrice />
      <Exchange />
      <TwapAddress />
      <MakerAddress />
    </Section>
  );
};

const Exchange = () => {
  const { order } = useOrderContext();

  return (
    <DataDisplay.Row label="Exchange Address">
      <WalletAddress chainId={order?.chainId} address={order?.exchange} />
    </DataDisplay.Row>
  );
};

const TwapAddress = () => {
  const { order } = useOrderContext();

  return (
    <DataDisplay.Row label="Twap Address">
      <Address address={order?.twapAddress} chainId={order?.chainId} />
    </DataDisplay.Row>
  );
};

const MakerAddress = () => {
  const { order } = useOrderContext();

  return (
    <DataDisplay.Row label="Maker Address">
      <Address address={order?.maker} chainId={order?.chainId} />
    </DataDisplay.Row>
  );
};

const ExecutionPrice = () => {
  const { order } = useOrderContext();
  const srcToken = useToken(order?.srcTokenAddress, order?.chainId).data;
  const dstToken = useToken(order?.dstTokenAddress, order?.chainId).data;

  const price = useMemo(() => {
    if (!order || !srcToken?.decimals || !dstToken?.decimals) return;
    return getOrderExcecutionRate(
      order,
      srcToken?.decimals,
      dstToken?.decimals
    );
  }, [order, srcToken, dstToken]);

  const priceF = useFormatNumber({ value: price });

  return (
    <DataDisplay.Row label="Excecution Price">
      {!price ? "-" : `1 ${srcToken?.symbol} = ${priceF} ${dstToken?.symbol}`}
    </DataDisplay.Row>
  );
};

const LimitPrice = () => {
  const { order } = useOrderContext();
  const srcToken = useToken(order?.srcTokenAddress, order?.chainId).data;
  const dstToken = useToken(order?.dstTokenAddress, order?.chainId).data;

  const price = useMemo(() => {
    if (!order || !srcToken?.decimals || !dstToken?.decimals) return;
    return getOrderLimitPriceRate(
      order,
      srcToken?.decimals,
      dstToken?.decimals
    );
  }, [order, srcToken, dstToken]);

  const priceF = useFormatNumber({ value: price });
  if (order?.isMarketOrder) return null;

  return (
    <DataDisplay.Row label="Limit Price">
      {!price ? "-" : `1 ${srcToken?.symbol} = ${priceF} ${dstToken?.symbol}`}
    </DataDisplay.Row>
  );
};
