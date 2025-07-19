import { useTwapOrders } from "@/lib/queries/use-twap-orders-query";
import { abbreviate } from "@/utils";
import { OrderStatus } from "@orbs-network/twap-sdk";
import { ChartArea, ChartLineIcon, ChartPieIcon } from "lucide-react";
import React, { useMemo } from "react";

export function OverviewHeader() {
  const { data: orders } = useTwapOrders();


  const openOrders = useMemo(() => {
    return orders?.filter((order) => order.status === OrderStatus.Open).length || 0;
  }, [orders]);

  const completedOrders = useMemo(() => {
    return orders?.filter((order) => order.status === OrderStatus.Completed).length || 0;
  }, [orders]);

  return <div className="w-full grid grid-cols-3 gap-4">
    <ItemCard title="Total Orders" value={abbreviate(orders?.length.toString() || "0")} icon={<ChartPieIcon />} />
    <ItemCard title="Open Orders" value={abbreviate(openOrders.toString() || "0")} icon={<ChartArea />} />
    <ItemCard title="Completed Orders" value={abbreviate(completedOrders.toString() || "0")} icon={<ChartLineIcon />} />
  </div>;
}

const ItemCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="flex items-start gap-2 bg-card-foreground rounded-lg p-4">
      {icon}
      <div className="flex flex-col gap-1">
        <p className="text-sm text-secondary-foreground">{title}</p>
        <p className="text-lg font-bold text-[20px]">{value}</p>
      </div>
    </div>
  );
};
