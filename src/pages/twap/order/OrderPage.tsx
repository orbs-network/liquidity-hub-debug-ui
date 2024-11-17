import { Order } from "@orbs-network/twap-sdk";
import { Avatar, Modal, Typography } from "antd";
import { useTwapClientLogs, useTwapOrder } from "applications/twap";
import { DataDisplay, Page, TxHashAddress, WalletAddress } from "components";
import {
  useAmountUI,
  useAppParams,
  useChainConfig,
  useNumberFormatter,
  useToken,
  useTwapConfigByExchange,
  useTwapPartner,
} from "hooks";
import moment from "moment";
import { createContext, useContext, useMemo, useState } from "react";
import { useParams } from "react-router";
import { LightButton, RowFlex } from "styles";
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
            <Logs />
          </DataDisplay>
        </Page.Layout>
      </Page>
    </Context.Provider>
  );
}

const Logs = () => {
  const { order } = useOrderContext();
  const chainId = useTwapConfigByExchange(order?.exchange)?.chainId;
  const { data: logs } = useTwapClientLogs(order?.id, chainId);

  return (
    <DataDisplay.Row label="Client logs">
      {!logs ? (
        <Typography>-</Typography>
      ) : (
        <RowFlex>
          {logs.map((log, index) => {
            return <Log key={index} index={index} log={log} />;
          })}
        </RowFlex>
      )}
    </DataDisplay.Row>
  );
};

const Log = ({ log, index }: { log: any; index: number }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const onClose = () => {
    setIsModalOpen(false);
  };

  const title = `Log #${index + 1}`;

  return (
    <>
      <LightButton style={{ padding: "5px 10px" }} onClick={showModal}>
        {title}
      </LightButton>
      <Modal
        onCancel={() => onClose()}
        title={title}
        open={isModalOpen}
        okButtonProps={{
          style: { display: "none" },
        }}
        cancelButtonProps={{
          style: { display: "none" },
        }}
      >
        {JSON.stringify(log)}
      </Modal>
    </>
  );
};

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

  const partner = useTwapPartner(order?.exchange);

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
      <Typography>
        {parseOrderType(order?.orderType)}
      </Typography>
    </DataDisplay.Row>
  );
};

const CreatedAt = () => {
  const { order } = useOrderContext();

  return (
    <DataDisplay.Row label="Created at">
      <Typography>
        {moment(order?.createdAt).format("lll")}
      </Typography>
    </DataDisplay.Row>
  );
};

const Deadline = () => {
  const { order } = useOrderContext();

  return (
    <DataDisplay.Row label="Deadline">
      <Typography>
        {moment(order?.deadline).format("lll")}
      </Typography>
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

  return (
    <DataDisplay.Row label="Source Filled Amount">
      <DataDisplay.TokenAmount
        amount={amount}
        address={order?.dstTokenAddress}
        chainId={chainId}
        usd={usd}
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
      <Typography>{token?.symbol}</Typography>
    </DataDisplay.Row>
  );
};

const DstToken = () => {
  const { order } = useOrderContext();
  const chainId = useAppParams().query.chainId;
  const token = useToken(order?.dstTokenAddress, chainId);

  return (
    <DataDisplay.Row label="Destination Token">
      <Typography>{token?.symbol}</Typography>
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
      />
    </DataDisplay.Row>
  );
};

const FillDelay = () => {
  const { order } = useOrderContext();
  const config = useTwapConfigByExchange(order?.exchange);

  return (
    <DataDisplay.Row label="Fill Delay">
      <Typography>
        {config && MillisToDuration(order?.getFillDelay(config))}
      </Typography>
    </DataDisplay.Row>
  );
};

const Progress = () => {
  const { order } = useOrderContext();

  return (
    <DataDisplay.Row label="Progress">
      <Typography>{order?.progress}%</Typography>
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
      />
    </DataDisplay.Row>
  );
};

const Status = () => {
  const { order } = useOrderContext();

  return (
    <DataDisplay.Row label="Status">
      <Typography>
        <span style={{ textTransform: "capitalize" }}>{order?.status}</span>
      </Typography>
    </DataDisplay.Row>
  );
};

const TxHash = () => {
  const { order } = useOrderContext();
  const chainId = useAppParams().query.chainId;

  return (
    <DataDisplay.Row label="Tx Hash">
      <TxHashAddress
        chainId={chainId}
        address={order?.txHash}
      />
    </DataDisplay.Row>
  );
};

const Exchange = () => {
  const { order } = useOrderContext();
  const chainId = useAppParams().query.chainId;

  return (
    <DataDisplay.Row label="Exchange Address">
      <WalletAddress
        chainId={chainId}
        address={order?.exchange}
      />
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
      <WalletAddress
        chainId={chainId}
        address={config?.twapAddress}
      />
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
      <Typography>{order?.totalChunks}</Typography>
    </DataDisplay.Row>
  );
};

const ChainId = () => {
  const { order } = useOrderContext();
  const config = useTwapConfigByExchange(order?.exchange);
  const network = useChainConfig(config?.chainId);

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
  const srcToken = useToken(order?.srcTokenAddress, chainId);
  const dstToken = useToken(order?.dstTokenAddress, chainId);

  const price = useMemo(() => {
    if (!order || !srcToken?.decimals || !dstToken?.decimals) return;
    return order?.getExcecutionPrice(srcToken?.decimals, dstToken?.decimals);
  }, [order, srcToken, dstToken]);

  const priceF = useNumberFormatter({ value: price });

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
  const srcToken = useToken(order?.srcTokenAddress, chainId);
  const dstToken = useToken(order?.dstTokenAddress, chainId);

  const price = useMemo(() => {
    if (!order || !srcToken?.decimals || !dstToken?.decimals) return;
    return order?.getLimitPrice(srcToken?.decimals, dstToken?.decimals);
  }, [order, srcToken, dstToken]);

  const priceF = useNumberFormatter({ value: price });

  return (
    <DataDisplay.Row label="Limit Price">
      <Typography>
        {!price ? "-" : `1 ${srcToken?.symbol} = ${priceF} ${dstToken?.symbol}`}
      </Typography>
    </DataDisplay.Row>
  );
};
