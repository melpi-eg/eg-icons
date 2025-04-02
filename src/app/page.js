"use client";
import React from "react";
import { useRouter } from "next/navigation";

function page() {
  const router = useRouter();
  router.replace("/home");
  return null;
}

export default page;
