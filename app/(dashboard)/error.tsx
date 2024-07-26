"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Error = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/sign-in");
  }, []);
  return <></>;
};

export default Error;
