import { FC } from "react";

export type ListDesktopRow<T> = {
  Component: FC<{ item: T }>;
  label: string;
  width: number;
  alignCenter?: boolean;
};

export type MobileRowComponent<T> = FC<{ item: T }>;
export type DesktopRowComponent<T> = FC<{ item: T }>;