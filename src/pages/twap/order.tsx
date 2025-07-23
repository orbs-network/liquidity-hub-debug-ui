import {
  getOrderExcecutionRate,
  getOrderFillDelayMillis,
  getOrderLimitPriceRate,
  Order,
} from "@orbs-network/twap-sdk";
import moment from "moment";
import { createContext, useContext, useMemo } from "react";
import { MillisToDuration } from "@/lib/twap/utils";
import { parseOrderType } from "./utils";
import {
  useTwapConfigByExchange,
  useTwapPartnerByExchange,
} from "@/hooks/twap-hooks";
import { useNetwork } from "@/hooks/hooks";
import { useTwapOrderQuery } from "@/lib/twap/queries";
import { OrderStatusBadge } from "./components/components";
import { ROUTES } from "@/config";
import { useNavigate } from "react-router-dom";
import { Progress } from "./components/progress";
import { Address } from "@/components/Address";
import { useFormatNumber } from "@/hooks/use-number-format";
import { OrderFills } from "./components/fills";
import { TokenAmount, TransactionDisplay } from "@/components";
import { useToken } from "@/lib/queries/use-tokens-query";

interface ContextType {
  order?: Order;
}

const Context = createContext({} as ContextType);
const useOrderContext = () => {
  return useContext(Context);
};
export function OrderPage() {
  const { data: order, isLoading } = useTwapOrderQuery();
  const navigate = useNavigate();


  return (
    <Context.Provider value={{ order }}>
      <TransactionDisplay.Container>
        <TransactionDisplay.ContainerHeader
          onBackClick={() => navigate(ROUTES.twap.root)}
        >
          {order && <OrderFills order={order} />}
        </TransactionDisplay.ContainerHeader>
        <TransactionDisplay
          isLoading={isLoading}
          header={
            <div className="flex flex-row gap-2 items-center justify-between">
              <p className="text-lg font-bold">Order Details</p>
              <div className="flex flex-row gap-4 items-center">
                {order && <OrderStatusBadge order={order} />}
                <p className="text-sm text-secondary-foreground font-mono font-normal">
                  #{order?.id}
                </p>
              </div>
            </div>
          }
        >
          <TransactionDisplay.Grid>
            <BaseInformation />
            <OrderConfig />
          </TransactionDisplay.Grid>
          <ExcecutionProgress />
        </TransactionDisplay>
      </TransactionDisplay.Container>
    </Context.Provider>
  );
}

const Chain = () => {
  const { order } = useOrderContext();
  const network = useNetwork(order?.chainId);
  return (
    <TransactionDisplay.SectionItem label="Chain" className="items-center">
      {network?.shortname}{" "}
      <span className="text-secondary-foreground font-mono text-sm ml-2 ">
        ({order?.chainId})
      </span>
    </TransactionDisplay.SectionItem>
  );
};

const Partner = () => {
  const { order } = useOrderContext();
  const partner = useTwapPartnerByExchange(order?.exchange, order?.chainId);
  return (
    <TransactionDisplay.SectionItem label="Partner">
      <p>{partner?.name}</p>
    </TransactionDisplay.SectionItem>
  );
};

const BaseInformation = ({ className = "" }: { className?: string }) => {
  const { order } = useOrderContext();

  return (
    <TransactionDisplay.Section title="Base Information" className={className}>
      <TransactionDisplay.SectionItem label="Order ID">
        <p>{order?.id}</p>
      </TransactionDisplay.SectionItem>
      <Chain />
      <Partner />
      <TransactionDisplay.SectionItem label="Type">
        {parseOrderType(order?.type)}
      </TransactionDisplay.SectionItem>
      <TransactionDisplay.SectionItem label="Created at">
        {moment(order?.createdAt).format("lll")}
      </TransactionDisplay.SectionItem>
      <TransactionDisplay.SectionItem label="Deadline">
        {moment(order?.deadline).format("lll")}
      </TransactionDisplay.SectionItem>
      <TransactionDisplay.SectionItem label="Tx Hash">
        {order && (
          <Address address={order?.txHash} chainId={order?.chainId} type="tx" />
        )}
      </TransactionDisplay.SectionItem>
    </TransactionDisplay.Section>
  );
};

const OrderConfig = ({ className = "" }: { className?: string }) => {
  const { order } = useOrderContext();
  const config = useTwapConfigByExchange(order?.exchange, order?.chainId);

  return (
    <TransactionDisplay.Section title="Order Config" className={className}>
      <TransactionDisplay.SectionItem label="Source Token">
        {order?.srcTokenSymbol}
      </TransactionDisplay.SectionItem>
      <TransactionDisplay.SectionItem label="Destination Token">
        {order?.dstTokenSymbol}
      </TransactionDisplay.SectionItem>
      <SrcAmount />
      <TransactionDisplay.SectionItem label="Destination Minimum Amount">
        <TokenAmount
          amountWei={order?.dstMinAmount}
          address={order?.dstTokenAddress}
          chainId={order?.chainId}
        />
      </TransactionDisplay.SectionItem>
      <SrcChunkAmount />
      <TransactionDisplay.SectionItem label="Chunks">
        {order?.chunks}
      </TransactionDisplay.SectionItem>
      <TransactionDisplay.SectionItem label="Fill Delay">
        {config &&
          order &&
          MillisToDuration(getOrderFillDelayMillis(order, config))}
      </TransactionDisplay.SectionItem>
      <TransactionDisplay.SectionItem label="Min Chunk Size Usd">
        ${config?.minChunkSizeUsd}
      </TransactionDisplay.SectionItem>
    </TransactionDisplay.Section>
  );
};

const SrcAmount = () => {
  const { order } = useOrderContext();
  return (
    <TransactionDisplay.SectionItem label="Source Amount">
      <TokenAmount
        amountWei={order?.srcAmount}
        address={order?.srcTokenAddress}
        chainId={order?.chainId}
        usd={order?.tradeDollarValueIn}
      />
    </TransactionDisplay.SectionItem>
  );
};

const SrcChunkAmount = () => {
  const { order } = useOrderContext();

  return (
    <TransactionDisplay.SectionItem label="Src Chunk Amount">
      <TokenAmount
        amountWei={order?.srcAmountPerChunk}
        address={order?.srcTokenAddress}
        chainId={order?.chainId}
        usd={Number(order?.tradeDollarValueIn || "0") / (order?.chunks || 1)}
      />
    </TransactionDisplay.SectionItem>
  );
};

const ProgressBar = () => {
  const { order } = useOrderContext();
  const percentF = useFormatNumber({
    value: order?.progress,
    decimalScale: 2,
  });
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
  return (
    <TransactionDisplay.Section title="Excecution Progress" className="mt-8">
      <ProgressBar />
      <FilledSrcAmount />
      <FilledDstAmount />
      <FilledFee />
      <ExecutionPrice />
      <LimitPrice />
      <Exchange />
      <TwapAddress />
      <MakerAddress />
    </TransactionDisplay.Section>
  );
};

const FilledFee = () => {
  const { order } = useOrderContext();

  return (
    <TransactionDisplay.SectionItem label="Fee">
      <TokenAmount
        amountWei={order?.filledFee}
        address={order?.dstTokenAddress}
        chainId={order?.chainId}
      />
    </TransactionDisplay.SectionItem>
  );
};

const FilledDstAmount = () => {
  const { order } = useOrderContext();

  return (
    <TransactionDisplay.SectionItem label="Destination Filled Amount">
      <TokenAmount
        amountWei={order?.filledDstAmount}
        address={order?.dstTokenAddress}
        chainId={order?.chainId}
        usd={order?.filledDollarValueOut}
      />
    </TransactionDisplay.SectionItem>
  );
};
const FilledSrcAmount = () => {
  const { order } = useOrderContext();
  return (
    <TransactionDisplay.SectionItem label="Source Filled Amount">
      <TokenAmount
        amountWei={order?.filledSrcAmount}
        address={order?.srcTokenAddress}
        chainId={order?.chainId}
        usd={order?.filledDollarValueIn}
      />
    </TransactionDisplay.SectionItem>
  );
};

const Exchange = () => {
  const { order } = useOrderContext();

  return (
    <TransactionDisplay.SectionItem label="Exchange Address">
      {order && <Address chainId={order?.chainId} address={order?.exchange} />}
    </TransactionDisplay.SectionItem>
  );
};

const TwapAddress = () => {
  const { order } = useOrderContext();

  return (
    <TransactionDisplay.SectionItem label="Twap Address">
      {order && (
        <Address address={order?.twapAddress} chainId={order?.chainId} />
      )}
    </TransactionDisplay.SectionItem>
  );
};

const MakerAddress = () => {
  const { order } = useOrderContext();

  return (
    <TransactionDisplay.SectionItem label="Maker Address">
      {order && <Address address={order?.maker} chainId={order?.chainId} />}
    </TransactionDisplay.SectionItem>
  );
};

const ExecutionPrice = () => {
  const { order } = useOrderContext();
  const srcToken = useToken(order?.srcTokenAddress, order?.chainId);
  const dstToken = useToken(order?.dstTokenAddress, order?.chainId);

  const price = useMemo(() => {
    if (!order || !srcToken?.decimals || !dstToken?.decimals) return;
    return getOrderExcecutionRate(
      order,
      srcToken?.decimals,
      dstToken?.decimals
    );
  }, [order, srcToken, dstToken]);
  if (!price) {
    return (
      <TransactionDisplay.SectionItem label="Excecution Price">
        -
      </TransactionDisplay.SectionItem>
    );
  }

  return (
    <TransactionDisplay.SectionItem label="Excecution Price">
      {`1 ${srcToken?.symbol} =`}
      <TokenAmount
        className="ml-2"
        amountWei={price}
        address={order?.dstTokenAddress}
        chainId={order?.chainId}
        amountUI={price}
      />
    </TransactionDisplay.SectionItem>
  );
};

const LimitPrice = () => {
  const { order } = useOrderContext();
  const srcToken = useToken(order?.srcTokenAddress, order?.chainId);
  const dstToken = useToken(order?.dstTokenAddress, order?.chainId);

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
    <TransactionDisplay.SectionItem label="Limit Price">
      {!price ? "-" : `1 ${srcToken?.symbol} = ${priceF} ${dstToken?.symbol}`}
    </TransactionDisplay.SectionItem>
  );
};
