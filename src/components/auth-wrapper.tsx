import { useUser } from "@/lib/auth";
import { Skeleton } from "antd";
import React from "react";
import { Card } from "./card";
import { Button } from "./ui/button";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, login, isLoading: isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div>
        <Skeleton style={{ width: "70%" }} />
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="w-full h-full flex items-center justify-center p-[50px]">
        <div className="flex flex-col gap-4">
          <p>Please login to continue</p>
          <Button onClick={() => login()}>Login</Button>
        </div>
      </Card>
    );
  }

  return children;
}
