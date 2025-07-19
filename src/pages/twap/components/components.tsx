import { Badge } from "@/components/ui/badge";
import { OrderStatus as IOrderStatus, Order } from "@orbs-network/twap-sdk";
import { useMemo } from "react";

export const OrderStatusBadge = ({ order }: { order: Order }) => {
  const status = order.status;
  const statusColor = useMemo(() => {
    if (status === IOrderStatus.Completed) return "#5CB85C";
    if (status === IOrderStatus.Expired) return "#D9534F";
    if (status === IOrderStatus.Canceled) return "#F0AD4E";
    return "#F0AD4E";
  }, [status]);

  return (
    <Badge className="text-white" style={{ background: statusColor }}>
      {status}
    </Badge>
  );
};
