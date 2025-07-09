import { getOrderExcecutionRate, getOrderFillDelayMillis, getOrderLimitPriceRate, Order } from "@orbs-network/twap-sdk";
import { Avatar, Typography } from "antd";
import { DataDisplay, Page, TxHashAddress, WalletAddress } from "@/components";
import { useAmountUI, useAppParams, useNumberFormatter, useToken } from "@/hooks";
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

interface ContextType {
  order?: Order;
}

const Context = createContext({} as ContextType);
const useOrderContext = () => {
  return useContext(Context);
};
export function OrderPage() {
  const { data: order, isLoading } = useTwapOrderQuery();

  return (
    <Context.Provider value={{ order }}>
      <Page.Layout isLoading={isLoading}>
        <DataDisplay>
          <ID />
          <ChainId />
          <Dex />
          <CreatedAt />
          <Deadline />
          <DataDisplay.Divider />
          <Status />
          <TxHash />
          <Type />
          <SrcAmount />
          <SrcToken />
          <DstToken />
          <DstMinAmount />
          <SrcChunkAmount />
          <Chunks />
          <FillDelay />
          <MinChunkSizeUsd />
          <DataDisplay.Divider />

          <Progress />
          <SrcFilledAmount />
          <DstFilledAmount />
          <ExecutionPrice />
          <LimitPrice />
          <DataDisplay.Divider />
          <Exchange />
          <TwapAddress />
          <TwapVersion />

        </DataDisplay>
      </Page.Layout>
    </Context.Provider>
  );
}



const ID = () => {
  const { order } = useOrderContext();

  return (
    <DataDisplay.Row label="Order ID">
      <Typography>#{order?.id}</Typography>
    </DataDisplay.Row>
  );
};

const Dex = () => {
  const { order } = useOrderContext();

  const partner = useTwapPartnerByExchange(order?.exchange, order?.chainId);

  return (
    <DataDisplay.Row label="Partner">
      <Avatar src={partner?.logoUrl} size={20} />
      <Typography>{partner?.name}</Typography>
    </DataDisplay.Row>
  );
};

const Type = () => {
  const { order } = useOrderContext();

  return (
    <DataDisplay.Row label="Type">
      <Typography style={{ textTransform: "uppercase" }}>
        {parseOrderType(order?.type)}
      </Typography>
    </DataDisplay.Row>
  );
};

const CreatedAt = () => {
  const { order } = useOrderContext();

  return (
    <DataDisplay.Row label="Created at">
      <Typography>{moment(order?.createdAt).format("lll")}</Typography>
    </DataDisplay.Row>
  );
};

const Deadline = () => {
  const { order } = useOrderContext();

  return (
    <DataDisplay.Row label="Deadline">
      <Typography>{moment(order?.deadline).format("lll")}</Typography>
    </DataDisplay.Row>
  );
};

const DstFilledAmount = () => {
  const { order } = useOrderContext();
  const chainId = useAppParams().query.chainId;
  const { data: token } = useToken(order?.dstTokenAddress, chainId);
  const amount = useAmountUI(token?.decimals, order?.filledDstAmount);
  const usd = order?.filledDollarValueOut;

  return (
    <DataDisplay.Row label="Destination Filled Amount">
      <DataDisplay.TokenAmount
        amount={amount}
        address={order?.dstTokenAddress}
        chainId={chainId}
        usd={usd}
      />
    </DataDisplay.Row>
  );
};

const SrcFilledAmount = () => {
  const { order } = useOrderContext();
  const chainId = useAppParams().query.chainId;
  const { data: token } = useToken(order?.srcTokenAddress, chainId);
  const amount = useAmountUI(token?.decimals, order?.filledSrcAmount);
  const usd = order?.filledDollarValueIn;

  return (
    <DataDisplay.Row label="Source Filled Amount">
      <DataDisplay.TokenAmount
        amount={amount}
        address={order?.srcTokenAddress}
        chainId={chainId}
        usd={usd}
      />
    </DataDisplay.Row>
  );
};

const SrcToken = () => {
  const { order } = useOrderContext();
  const chainId = useAppParams().query.chainId;
  const { data: token } = useToken(order?.srcTokenAddress, chainId);

  return (
    <DataDisplay.Row label="Source Token">
      <Typography>{token?.symbol}</Typography>
    </DataDisplay.Row>
  );
};

const DstToken = () => {
  const { order } = useOrderContext();
  const chainId = useAppParams().query.chainId;
  const { data: token } = useToken(order?.dstTokenAddress, chainId);

  return (
    <DataDisplay.Row label="Destination Token">
      <Typography>{token?.symbol}</Typography>
    </DataDisplay.Row>
  );
};

const DstMinAmount = () => {
  const { order } = useOrderContext();
  const chainId = useAppParams().query.chainId;
  const { data: token } = useToken(order?.dstTokenAddress, chainId);
  const amount = useAmountUI(token?.decimals, order?.dstMinAmount);

  return (
    <DataDisplay.Row label="Destination Minimum Amount">
      <DataDisplay.TokenAmount
        amount={amount}
        address={order?.dstTokenAddress}
        chainId={chainId}
      />
    </DataDisplay.Row>
  );
};

const FillDelay = () => {
  const { order } = useOrderContext();
  const config = useTwapConfigByExchange(order?.exchange, order?.chainId);

  if (!order || !config) return null;
  return (
    <DataDisplay.Row label="Fill Delay">
      <Typography>
        {config && MillisToDuration(getOrderFillDelayMillis(order, config))}
      </Typography>
    </DataDisplay.Row>
  );
};

const Progress = () => {
  const { order } = useOrderContext();
  const value = useNumberFormatter({
    value: order?.progress,
    decimalScale: 2,
  }).formatted;

  return (
    <DataDisplay.Row label="Progress">
      <Typography>{value}%</Typography>
    </DataDisplay.Row>
  );
};

const SrcAmount = () => {
  const { order } = useOrderContext();
  const chainId = useAppParams().query.chainId;
  const { data: token } = useToken(order?.srcTokenAddress, chainId);
  const amount = useAmountUI(token?.decimals, order?.srcAmount);

  return (
    <DataDisplay.Row label="Source Amount">
      <DataDisplay.TokenAmount
        amount={amount}
        address={order?.srcTokenAddress}
        chainId={chainId}
      />
    </DataDisplay.Row>
  );
};

const SrcChunkAmount = () => {
  const { order } = useOrderContext();
  const chainId = useAppParams().query.chainId;
  const { data: token } = useToken(order?.srcTokenAddress, chainId);
  const amount = useAmountUI(token?.decimals, order?.srcAmountPerChunk);

  return (
    <DataDisplay.Row label="Src Chunk Amount">
      <DataDisplay.TokenAmount
        amount={amount}
        address={order?.srcTokenAddress}
        chainId={chainId}
      />
    </DataDisplay.Row>
  );
};

const Status = () => {
  const { order } = useOrderContext();

  return (
    <DataDisplay.Row label="Status">
      <Typography style={{ textTransform: "uppercase" }}>
        {order?.status}
      </Typography>
    </DataDisplay.Row>
  );
};

const TxHash = () => {
  const { order } = useOrderContext();
  const chainId = useAppParams().query.chainId;

  return (
    <DataDisplay.Row label="Tx Hash">
      <TxHashAddress chainId={chainId} address={order?.txHash} />
    </DataDisplay.Row>
  );
};

const Exchange = () => {
  const { order } = useOrderContext();
  const chainId = useAppParams().query.chainId;

  return (
    <DataDisplay.Row label="Exchange Address">
      <WalletAddress chainId={chainId} address={order?.exchange} />
    </DataDisplay.Row>
  );
};

const MinChunkSizeUsd = () => {
  const { order } = useOrderContext();
  const config = useTwapConfigByExchange(order?.exchange);

  return (
    <DataDisplay.Row label="Min Chunk Size Usd">
      <Typography>${config?.minChunkSizeUsd}</Typography>
    </DataDisplay.Row>
  );
};

const TwapAddress = () => {
  const { order } = useOrderContext();
  const chainId = useAppParams().query.chainId;
  const config = useTwapConfigByExchange(order?.exchange);

  return (
    <DataDisplay.Row label="Twap Address">
      <WalletAddress chainId={chainId} address={config?.twapAddress} />
    </DataDisplay.Row>
  );
};

const TwapVersion = () => {
  const { order } = useOrderContext();
  const config = useTwapConfigByExchange(order?.exchange);

  return (
    <DataDisplay.Row label="Twap Version">
      <Typography>{config?.twapVersion}</Typography>
    </DataDisplay.Row>
  );
};

const Chunks = () => {
  const { order } = useOrderContext();

  return (
    <DataDisplay.Row label="Chunks">
      <Typography>{order?.chunks}</Typography>
    </DataDisplay.Row>
  );
};

const ChainId = () => {
  const { order } = useOrderContext();
  const config = useTwapConfigByExchange(order?.exchange);
  const network = useNetwork(config?.chainId);

  return (
    <DataDisplay.Row label="Chain">
      <Avatar size={20} src={network?.logoUrl} />
      <Typography>{network?.name}</Typography>
    </DataDisplay.Row>
  );
};

const ExecutionPrice = () => {
  const { order } = useOrderContext();
  const chainId = useAppParams().query.chainId;
  const {data: srcToken} = useToken(order?.srcTokenAddress, chainId);
  const {data: dstToken} = useToken(order?.dstTokenAddress, chainId);

  const price = useMemo(() => {
    if (!order || !srcToken?.decimals || !dstToken?.decimals) return;
    return getOrderExcecutionRate(order, srcToken?.decimals, dstToken?.decimals);
  }, [order, srcToken, dstToken]);

  const priceF = useNumberFormatter({ value: price }).formatted;

  return (
    <DataDisplay.Row label="Excecution Price">
      <Typography>
        {!price ? "-" : `1 ${srcToken?.symbol} = ${priceF} ${dstToken?.symbol}`}
      </Typography>
    </DataDisplay.Row>
  );
};

const LimitPrice = () => {
  const { order } = useOrderContext();
  const chainId = useAppParams().query.chainId;
  const {data: srcToken} = useToken(order?.srcTokenAddress, chainId);
  const {data: dstToken} = useToken(order?.dstTokenAddress, chainId);

  const price = useMemo(() => {
    if (!order || !srcToken?.decimals || !dstToken?.decimals) return;
    return getOrderLimitPriceRate(order, srcToken?.decimals, dstToken?.decimals);
  }, [order, srcToken, dstToken]);

  const priceF = useNumberFormatter({ value: price }).formatted;

  return (
    <DataDisplay.Row label="Limit Price">
      <Typography>
        {!price ? "-" : `1 ${srcToken?.symbol} = ${priceF} ${dstToken?.symbol}`}
      </Typography>
    </DataDisplay.Row>
  );
};
