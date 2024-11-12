import { Order } from "@orbs-network/twap-sdk";
import { Avatar } from "antd";
import { useTwapOrder } from "applications/twap";
import { AddressLink, DataDisplay, Page } from "components";
import {
  useAmountUI,
  useAppParams,
  useChainConfig,
  useNumberFormatter,
  useToken,
  useTwapPartner,
  useTwapPartnerConfig,
} from "hooks";
import moment from "moment";
import { createContext, useContext, useMemo } from "react";
import { useParams } from "react-router";
import { MillisToDuration } from "utils";
import { parseOrderType } from "../utils";

interface ContextType {
  order?: Order;
}

const Context = createContext({} as ContextType);
const useOrderContext = () => {
  return useContext(Context);
};
export function OrderPage() {
  const orderId = useParams().orderId;
  const chainId = useAppParams().query.chainId;
  const { data: order, isLoading } = useTwapOrder(chainId, orderId);

  return (
    <Context.Provider value={{ order }}>
      <Page
        navbar={
          <Page.Navbar.Twap hideChainSelect={true} hidePartnerSelect={true} />
        }
      >
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
      </Page>
    </Context.Provider>
  );
}

const ID = () => {
  const { order } = useOrderContext();

  return (
    <DataDisplay.Row label="Order ID">
      <DataDisplay.Row.Text>#{order?.id}</DataDisplay.Row.Text>
    </DataDisplay.Row>
  );
};

const Dex = () => {
  const { order } = useOrderContext();

  const partner = useTwapPartner(order?.exchange);

  return (
    <DataDisplay.Row label="Partner">
      <Avatar src={partner?.logoUrl} size={20} />
      <DataDisplay.Row.Text>{partner?.name}</DataDisplay.Row.Text>
    </DataDisplay.Row>
  );
};

const Type = () => {
  const { order } = useOrderContext();

  return (
    <DataDisplay.Row label="Type">
      <DataDisplay.Row.Text>
        {parseOrderType(order?.orderType)}
      </DataDisplay.Row.Text>
    </DataDisplay.Row>
  );
};

const CreatedAt = () => {
  const { order } = useOrderContext();
  console.log({ order });

  return (
    <DataDisplay.Row label="Created at">
      <DataDisplay.Row.Text>
        {moment(order?.createdAt).format("lll")}
      </DataDisplay.Row.Text>
    </DataDisplay.Row>
  );
};

const Deadline = () => {
  const { order } = useOrderContext();

  return (
    <DataDisplay.Row label="Deadline">
      <DataDisplay.Row.Text>
        {moment(order?.deadline).format("lll")}
      </DataDisplay.Row.Text>
    </DataDisplay.Row>
  );
};

const DstFilledAmount = () => {
  const { order } = useOrderContext();
  const chainId = useAppParams().query.chainId;
  const token = useToken(order?.dstTokenAddress, chainId);
  const amount = useAmountUI(token?.decimals, order?.dstFilledAmount);
  const usd = order?.dstFilledAmountUsd;

  return (
    <DataDisplay.Row label="Destination Filled Amount">
      <DataDisplay.TokenAmount
        amount={amount}
        address={order?.dstTokenAddress}
        chainId={chainId}
        usd={usd}
        symbol={token?.symbol}
      />
    </DataDisplay.Row>
  );
};

const SrcFilledAmount = () => {
  const { order } = useOrderContext();
  const chainId = useAppParams().query.chainId;
  const token = useToken(order?.srcTokenAddress, chainId);
  const amount = useAmountUI(token?.decimals, order?.srcFilledAmount);
  const usd = order?.srcFilledAmountUsd;
  console.log({});
  

  return (
    <DataDisplay.Row label="Source Filled Amount">
      <DataDisplay.TokenAmount
        amount={amount}
        address={order?.dstTokenAddress}
        chainId={chainId}
        usd={usd}
        symbol={token?.symbol}
      />
    </DataDisplay.Row>
  );
};

const SrcToken = () => {
  const { order } = useOrderContext();
  const chainId = useAppParams().query.chainId;
  const token = useToken(order?.srcTokenAddress, chainId);

  return (
    <DataDisplay.Row label="Source Token">
      <DataDisplay.Row.Text>{token?.symbol}</DataDisplay.Row.Text>
    </DataDisplay.Row>
  );
};

const DstToken = () => {
  const { order } = useOrderContext();
  const chainId = useAppParams().query.chainId;
  const token = useToken(order?.dstTokenAddress, chainId);

  return (
    <DataDisplay.Row label="Destination Token">
      <DataDisplay.Row.Text>{token?.symbol}</DataDisplay.Row.Text>
    </DataDisplay.Row>
  );
};

const DstMinAmount = () => {
  const { order } = useOrderContext();
  const chainId = useAppParams().query.chainId;
  const token = useToken(order?.dstTokenAddress, chainId);
  const amount = useAmountUI(token?.decimals, order?.dstMinAmount);

  return (
    <DataDisplay.Row label="Destination Minumum Amount">
      <DataDisplay.TokenAmount
        amount={amount}
        address={order?.dstTokenAddress}
        chainId={chainId}
        symbol={token?.symbol}
      />
    </DataDisplay.Row>
  );
};

const FillDelay = () => {
  const { order } = useOrderContext();

  return (
    <DataDisplay.Row label="Fill Delay">
      <DataDisplay.Row.Text>
        {MillisToDuration(order?.fillDelay)}
      </DataDisplay.Row.Text>
    </DataDisplay.Row>
  );
};

const Progress = () => {
  const { order } = useOrderContext();

  return (
    <DataDisplay.Row label="Progress">
      <DataDisplay.Row.Text>{order?.progress}%</DataDisplay.Row.Text>
    </DataDisplay.Row>
  );
};

const SrcAmount = () => {
  const { order } = useOrderContext();
  const chainId = useAppParams().query.chainId;
  const token = useToken(order?.srcTokenAddress, chainId);
  const amount = useAmountUI(token?.decimals, order?.srcAmount);

  return (
    <DataDisplay.Row label="Source Amount">
      <DataDisplay.TokenAmount
        amount={amount}
        address={order?.srcTokenAddress}
        chainId={chainId}
        symbol={token?.symbol}
      />
    </DataDisplay.Row>
  );
};

const SrcChunkAmount = () => {
  const { order } = useOrderContext();
  const chainId = useAppParams().query.chainId;
  const token = useToken(order?.srcTokenAddress, chainId);
  const amount = useAmountUI(token?.decimals, order?.srcBidAmount);

  return (
    <DataDisplay.Row label="Src Chunk Amount">
      <DataDisplay.TokenAmount
        amount={amount}
        address={order?.srcTokenAddress}
        chainId={chainId}
        symbol={token?.symbol}
      />
    </DataDisplay.Row>
  );
};

const Status = () => {
  const { order } = useOrderContext();

  return (
    <DataDisplay.Row label="Status">
      <DataDisplay.Row.Text>
        <span style={{ textTransform: "capitalize" }}>{order?.status}</span>
      </DataDisplay.Row.Text>
    </DataDisplay.Row>
  );
};

const TxHash = () => {
  const { order } = useOrderContext();
  const chainId = useAppParams().query.chainId;

  return (
    <DataDisplay.Row label="Tx Hash">
      <AddressLink
        path="tx"
        chainId={chainId}
        address={order?.txHash}
        short={true}
      />
    </DataDisplay.Row>
  );
};

const Exchange = () => {
  const { order } = useOrderContext();
  const chainId = useAppParams().query.chainId;

  return (
    <DataDisplay.Row label="Exchange Address">
      <AddressLink
        chainId={chainId}
        address={order?.exchange}
        short={true}
        path="address"
      />
    </DataDisplay.Row>
  );
};

const MinChunkSizeUsd = () => {
  const { order } = useOrderContext();
  const config = useTwapPartnerConfig(order?.exchange);

  return (
    <DataDisplay.Row label="Min Chunk Size Usd">
      <DataDisplay.Row.Text>${config?.minChunkSizeUsd}</DataDisplay.Row.Text>
    </DataDisplay.Row>
  );
};

const TwapAddress = () => {
  const { order } = useOrderContext();
  const chainId = useAppParams().query.chainId;
  const config = useTwapPartnerConfig(order?.exchange);

  return (
    <DataDisplay.Row label="Twap Address">
      <AddressLink
        chainId={chainId}
        address={config?.twapAddress}
        short={true}
        path="address"
      />
    </DataDisplay.Row>
  );
};

const TwapVersion = () => {
  const { order } = useOrderContext();
  const config = useTwapPartnerConfig(order?.exchange);
  config?.twapVersion;
  return (
    <DataDisplay.Row label="Twap Version">
      <DataDisplay.Row.Text>{config?.twapVersion}</DataDisplay.Row.Text>
    </DataDisplay.Row>
  );
};

const Chunks = () => {
  const { order } = useOrderContext();

  return (
    <DataDisplay.Row label="Chunks">
      <DataDisplay.Row.Text>{order?.totalChunks}</DataDisplay.Row.Text>
    </DataDisplay.Row>
  );
};

const ChainId = () => {
  const { order } = useOrderContext();
  const config = useTwapPartnerConfig(order?.exchange);
  const network = useChainConfig(config?.chainId);

  return (
    <DataDisplay.Row label="Chain">
      <Avatar size={20} src={network?.logoUrl} />
      <DataDisplay.Row.Text>{network?.name}</DataDisplay.Row.Text>
    </DataDisplay.Row>
  );
};

const ExecutionPrice = () => {
  const { order } = useOrderContext();
  const chainId = useAppParams().query.chainId;
  const srcToken = useToken(order?.srcTokenAddress, chainId);
  const dstToken = useToken(order?.dstTokenAddress, chainId);

  const price = useMemo(() => {
    if (!order || !srcToken?.decimals || !dstToken?.decimals) return;
    return order?.getExcecutionPrice(srcToken?.decimals, dstToken?.decimals);
  }, [order, srcToken, dstToken]);

  const priceF = useNumberFormatter({ value: price });

  return (
    <DataDisplay.Row label="Excecution Price">
      <DataDisplay.Row.Text>
        {!price ? "-" : `1 ${srcToken?.symbol} = ${priceF} ${dstToken?.symbol}`}
      </DataDisplay.Row.Text>
    </DataDisplay.Row>
  );
};

const LimitPrice = () => {
  const { order } = useOrderContext();
  const chainId = useAppParams().query.chainId;
  const srcToken = useToken(order?.srcTokenAddress, chainId);
  const dstToken = useToken(order?.dstTokenAddress, chainId);

  const price = useMemo(() => {
    if (!order || !srcToken?.decimals || !dstToken?.decimals) return;
    return order?.getLimitPrice(srcToken?.decimals, dstToken?.decimals);
  }, [order, srcToken, dstToken]);

  const priceF = useNumberFormatter({ value: price });

  return (
    <DataDisplay.Row label="Limit Price">
      <DataDisplay.Row.Text>
        {!price ? "-" : `1 ${srcToken?.symbol} = ${priceF} ${dstToken?.symbol}`}
      </DataDisplay.Row.Text>
    </DataDisplay.Row>
  );
};
