import { Order, TwapFill } from "@orbs-network/twap-sdk";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ListCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useFormatNumber } from "@/hooks/use-number-format";
import { ReactNode } from "react";
import moment from "moment";
import { Address } from "@/components/Address";
import { toAmountUI } from "@/lib/utils";
import { useToken } from "@/lib/queries/use-tokens-query";

export const OrderFills = ({ order }: { order: Order }) => {
  return (
    <Dialog >
      <DialogTrigger>
        <Button className="bg-slate-800/50 border border-border rounded-lg text-white p-2 hover:bg-slate-800/70 transition-all duration-300 w-fit flex flex-row items-center gap-2 ml-auto">
          <p>Fills <small className="text-xs text-secondary-foreground font-mono">({order?.fills?.length}/{order?.chunks})</small></p>
          <ListCheck />
        </Button>
      </DialogTrigger>
      <DialogContent className="font-mono">
        <DialogHeader>
          <DialogTitle>#{order?.id} Fills</DialogTitle>
        </DialogHeader>
       {!order.fills?.length ? <div>
        <div className="text-[17px] text-secondary-foreground font-bold flex justify-center mt-10 mb-10">No fills</div>
       </div>  : <div className="flex flex-col gap-2">
          {order?.fills?.map((fill) => (
            <FillCard key={fill.id} fill={fill} order={order} />
          ))}
        </div>}
      </DialogContent>
    </Dialog>
  );
};

const FillCard = ({ fill, order }: { fill: TwapFill; order: Order }) => {
  return (
    <Card className="p-3 flex flex-col gap-1 border border-border rounded-lg">
      <FillCardCardAmount
        address={order.srcTokenAddress}
        amount={fill.srcAmountIn}
        chainId={order.chainId}
        label="Src Filled Amount"
        usd={fill.dollarValueIn}
      />
      <FillCardCardAmount
        address={order.dstTokenAddress}
        amount={fill.dstAmountOut}
        chainId={order.chainId}
        label="Dst Filled Amount"
        usd={fill.dollarValueOut}
      />
      <FillCardCardAmountRow
        label="Tx Hash"
        value={
          <Address
            address={fill.transactionHash}
            chainId={order.chainId}
            type="tx"
          />
        }
      />
      <FillCardCardAmountRow
        label="Time"
        value={moment(fill.timestamp).format("lll")}
      />
      <FillCardCardAmount
        address={order.dstTokenAddress}
        amount={fill.dstFee}
        chainId={order.chainId}
        label="Fee"
        usd="0"
      />
    </Card>
  );
};

const FillCardCardAmountRow = ({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) => {
  return (
    <div className="flex flex-row justify-between">
      <p className="text-sm text-secondary-foreground font-mono font-bold">
        {label}
      </p>
      <div className="text-sm text-white font-mono">{value}</div>
    </div>
  );
};

const FillCardCardAmount = ({
  address,
  amount,
  chainId,
  label,
  usd,
}: {
  address: string;
  amount: string;
  chainId: number;
  label: string;
  usd?: string;
}) => {
  const token = useToken(address, chainId);
  const amountF = useFormatNumber({
    value: toAmountUI(amount, token?.decimals),
  });

  const usdF = useFormatNumber({
    value: usd,
  });
  return (
    <FillCardCardAmountRow
      label={label}
      value={
        <p>
          {amountF} {token?.symbol}{" "}
          {Number(usd) > 0 && (
            <span className="text-xs text-secondary-foreground font-mono">
              ({usdF})
            </span>
          )}
        </p>
      }
    />
  );
};
