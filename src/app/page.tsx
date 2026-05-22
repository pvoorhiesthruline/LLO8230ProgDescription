"use client";

import dynamic from "next/dynamic";

const PluralisticWorksheet = dynamic(
  () => import("@/components/PluralisticWorksheet").then((m) => m.PluralisticWorksheet),
  { ssr: false }
);

export default function Home() {
  return <PluralisticWorksheet />;
}
