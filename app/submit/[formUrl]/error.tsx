"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect } from "react";

const error = ({ error }: { error: Error }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="flex w-full h-full flex-col items-center justify-center gap-4">
      <h2 className="text-4xl text-destructive">Something went wrong!</h2>
      <Button asChild>
        <Link href={"/"}>Go back to home</Link>
      </Button>
    </div>
  );
};

export default error;
