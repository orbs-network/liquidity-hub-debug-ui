import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-sh";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import ReactJson from "react-json-view";
import { Card } from "@/components/card";
import { TokenAmount, TransactionDisplay } from "@/components";
import { useCallback, useMemo, useState } from "react";
import { Address, TokenAddress } from "@/components/Address";
import { Context } from "./context";
import copy from "copy-to-clipboard";

import {
  AddressFieldValue,
  AmountFieldValue,
  AvatarFieldValue,
  Field,
  TransferLog,
  useAmounts,
  useBaseInfo,
  useLHLogTrace,
  useLHSwap,
  useTransfers,
} from "@/lib/liquidity-hub";
import { useParams } from "react-router-dom";
import { useSwapPageContext } from "./use-swap-page-context";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAmountUI } from "@/lib/hooks/use-amount-ui";
import { abbreviate } from "@/lib/utils";
import { eqIgnoreCase } from "@orbs-network/twap-sdk";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTokens } from "@/lib/queries/use-tokens-query";
import { Token } from "@/lib/types";
import { ROUTES } from "@/config";
import { useNavigate } from "react-router-dom";
import { useHeight } from "@/lib/hooks/use-height";
import { Switch } from "@/components/ui/switch";
import { AuthWrapper } from "@/components/auth-wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { navigation } from "@/router";
import { CopyIcon } from "lucide-react";

export function SwapPage({ isPreview }: { isPreview?: boolean }) {
  const navigate = useNavigate();

  const content = (
    <TransactionDisplay.Container>
      {!isPreview && (
        <TransactionDisplay.ContainerHeader
          onBackClick={() => navigate(ROUTES.liquidityHub.root)}
        />
      )}
      <State isPreview={isPreview} />
    </TransactionDisplay.Container>
  );

  if (isPreview) {
    return content;
  }

  return <AuthWrapper>{content}</AuthWrapper>;
}

const State = ({ isPreview }: { isPreview?: boolean }) => {
  const identifier = useParams().identifier;

  const { data, isLoading } = useLHSwap(identifier);

  if (isLoading) {
    return (
      <Card>
        <Card.Content isLoading />
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <Card.Content>
          <p>Session not found</p>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Context.Provider
      value={{
        swap: data?.swap,
        quotes: data?.quotes,
        clientLogs: data?.clientLogs,
        quote: data?.quote,
        isPreview,
      }}
    >
      <Content />
    </Context.Provider>
  );
};

const Header = () => {
  const { swap } = useSwapPageContext();
  return (
    <div className="flex flex-row gap-2 items-center justify-between">
      <p>Session: {swap.sessionId}</p>
      <CopyLinkButton />
    </div>
  );
};

const Content = () => {
  const { swap, isPreview } = useSwapPageContext();
  const baseInfo = useBaseInfo();
  const amounts = useAmounts(swap);
  return (
    <div className="flex flex-col gap-4">
      <TransactionDisplay header={<Header />}>
        <TransactionDisplay.Grid>
          <Section key={baseInfo.title} section={baseInfo} />
          <Section key={amounts.title} section={amounts} />
        </TransactionDisplay.Grid>
      
        
      </TransactionDisplay>
      {!isPreview && (
        <div className="flex flex-row gap-2 ml-auto">
          <Transfers />
          <LogTrace />
          <Logs />
          <DexRouterData />
        </div>
      )}
    </div>
  );
};

const DexRouterData = () => {
  const { swap } = useSwapPageContext();
  return (

      <Dialog>
        <DialogTrigger>
          <Button variant="outline">Dex Data</Button>
        </DialogTrigger>
        <DialogContent className='max-h-[80vh] h-full overflow-y-auto w-full sm:max-w-[98vw] sm:max-h-[95vh]'>
          <DialogHeader>
            <DialogTitle>Dex Data - {swap.sessionId}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
          <div className="flex flex-col gap-2">
            <p className="text-[17px] font-bold">Data:</p>
            <p className="text-[15px] font-mono break-all">
              {swap.dexRouteData}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[17px] font-bold">To:</p>
            <Address address={swap.dexRouteTo} chainId={swap.chainId}>
              {swap.dexRouteTo}
            </Address>
          </div>
          </div>
        </DialogContent>
      </Dialog>

  );
};

const Section = ({
  section,
}: {
  section: { title: string; items: Field[] };
}) => {
  return (
    <TransactionDisplay.Section title={section.title}>
      {section.items.map((item) => (
        <FieldsComponents field={item} />
      ))}
    </TransactionDisplay.Section>
  );
};

const FieldsComponents = ({ field }: { field: Field }) => {
  const data = useSwapPageContext();
  const value = useMemo(() => field.value(data), [data, field]);
  let content = null;
  if (field.type === "text") {
    content = <p>{value as string}</p>;
  }
  if (field.type === "avatar") {
    const avatarFieldValue = value as AvatarFieldValue;
    content = (
      <div className="flex flex-row gap-2 items-center">
        <Avatar className="w-5 h-5">
          <AvatarImage src={avatarFieldValue.logoUrl} />
        </Avatar>
        <p>{avatarFieldValue.value}</p>
      </div>
    );
  }
  if (field.type === "amount") {
    const amountFieldValue = value as AmountFieldValue;
    content = (
      <TokenAmount
        amountWei={amountFieldValue.value}
        address={amountFieldValue.address}
        chainId={amountFieldValue.chainId}
        usd={amountFieldValue.usd}
      />
    );
  }
  if (field.type === "address") {
    const addressFieldValue = value as AddressFieldValue;
    content = (
      <Address
        address={addressFieldValue.value}
        chainId={addressFieldValue.chainId}
        type={addressFieldValue.type}
      />
    );
  }
  return (
    <TransactionDisplay.SectionItem
      label={field.title}
      description={field.subtitle}
    >
      {content}
    </TransactionDisplay.SectionItem>
  );
};


const Transfers = () => {
  const { swap } = useSwapPageContext();
  const transfers = useTransfers(swap).data;
  const addresses = useMemo(() => {
    if (!transfers) return [];
    return transfers
      .filter((transfer) => transfer.value)
      .map((it) => [it.tokenAddress, it.from, it.to])
      .flat();
  }, [transfers]);

  const tokens = useTokens(addresses, swap.chainId).data;
  if (!transfers || !swap) return null;

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline">
          <p className="hidden md:block">Transfers</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Transfers - {swap.sessionId}</DialogTitle>
          <DialogClose />
        </DialogHeader>
        <div className="flex flex-col gap-2  overflow-y-auto flex-1 max-h-[500px]">
          {transfers?.map((transfer, index) => {
            return (
              <Transfer key={index} log={transfer} tokens={tokens ?? []} />
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Transfer = ({ log, tokens }: { log: TransferLog; tokens: Token[] }) => {
  const { swap } = useSwapPageContext();
  const { valueToken, fromToken, toToken } = useMemo(() => {
    return {
      valueToken: tokens.find((it) => it.address === log.tokenAddress),
      fromToken: tokens.find((it) => it.address === log.from),
      toToken: tokens.find((it) => it.address === log.to),
    };
  }, [log.tokenAddress, log.from, log.to, tokens]);

  const value = useAmountUI(valueToken?.decimals, log.value);
  return (
    <div className="flex flex-row gap-2 items-center bg-slate-700/30 p-2 rounded-lg w-full text-sm flex-wrap">
      <p style={{ whiteSpace: "nowrap" }}>
        <strong>From </strong>
      </p>
      {fromToken ? (
        <TokenAddress
          chainId={swap.chainId}
          address={log.from}
          symbol={fromToken?.symbol}
        />
      ) : (
        <Address chainId={swap.chainId} address={log.from}>
          {eqIgnoreCase(log.from, swap.user) ? "User wallet" : undefined}
        </Address>
      )}
      <p style={{ whiteSpace: "nowrap" }}>
        <strong> To </strong>
      </p>
      {toToken ? (
        <TokenAddress
          chainId={swap.chainId}
          address={log.to}
          symbol={toToken?.symbol}
        />
      ) : (
        <Address chainId={swap.chainId} address={log.to}>
          {eqIgnoreCase(log.to, swap.user) ? "User wallet" : undefined}
        </Address>
      )}
      <p style={{ whiteSpace: "nowrap" }}>
        <strong>For</strong> {abbreviate(value)}{" "}
      </p>
      <TokenAddress
        chainId={swap.chainId}
        address={log.tokenAddress}
        symbol={valueToken?.symbol}
      />
    </div>
  );
};

const CopyLinkButton = () => {
  const { swap, isPreview } = useSwapPageContext();
  const url = useMemo(() => {
    return `${window.location.origin}${navigation.liquidityHub.swapPreview(
      swap.sessionId
    )}`;
  }, [swap.sessionId]);

  const onCopy = useCallback(() => {
    if (!navigator.clipboard) {
      console.warn("Clipboard API not supported");
    } else {
      copy(url);
      toast.success("Link copied to clipboard");
    }
  }, [url]);

  if (isPreview) return null;

  return (
    <Button variant="ghost" onClick={onCopy}>
      Copy link <CopyIcon />
    </Button>
  );
};

const LogTrace = () => {
  const { swap } = useSwapPageContext();
  const { data, isLoading, error } = useLHLogTrace(swap);
  const height = useHeight();
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline">
          <p className="hidden md:block">Log trace</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] h-full overflow-y-auto w-full sm:max-w-[98vw] sm:max-h-[95vh]">
        <DialogHeader className="flex flex-row gap-2 items-center justify-between">
          <DialogTitle>Log trace - {swap.sessionId}</DialogTitle>
          <div className="flex flex-row gap-2 items-center relative top-[-10px] right-[20px]">
            <p>Mode:</p>
            <Switch
              checked={darkMode}
              onCheckedChange={(checked) => setDarkMode(checked)}
            />
          </div>
        </DialogHeader>

        <AceEditor
          theme={darkMode ? "monokai" : "github"}
          mode="sh" // Set mode to shell script
          value={isLoading ? "Loading..." : error ? `Error: ${error}` : data}
          readOnly={true} // Make it read-only to resemble a terminal output
          width="100%" // Adjust width as needed
          height={`${height - 100}px`}
          fontSize={15} // Set the font size here
        />
      </DialogContent>
    </Dialog>
  );
};

const Logs = () => {
  const { swap, clientLogs, quotes } = useSwapPageContext();
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline">Logs</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] h-full overflow-y-auto w-full sm:max-w-[98vw] sm:max-h-[95vh]">
        <DialogHeader>
          <DialogTitle>Logs - {swap.sessionId}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="swap" className="overflow-y-auto">
          <div className="sticky top-0 z-10 bg-background pb-2">
            <TabsList>
              <TabsTrigger value="swap">Swap</TabsTrigger>
              <TabsTrigger value="client">Client Logs</TabsTrigger>
              <TabsTrigger value="quote">Quotes</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="client">
            <LogDisplay logs={clientLogs} />
          </TabsContent>
          <TabsContent value="swap">
            <LogDisplay logs={swap} />
          </TabsContent>
          <TabsContent value="quote">
            <LogDisplay logs={quotes ?? []} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

const LogDisplay = ({ logs }: { logs: object | object[] }) => {
  return (
    <ReactJson
      src={logs}
      name={false}
      collapsed={1}
      enableClipboard={true}
      displayDataTypes={false}
      theme="monokai"
      style={{
        fontSize: "14px",
        fontFamily: "monospace",
      }}
    />
  );
};
