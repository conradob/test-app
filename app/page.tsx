"use client";
import { CovalProvider, LatencyChart } from "@coval-ai/components";

const token = process.env.NEXT_PUBLIC_COVAL_TOKEN || "";
const apiUrl = process.env.NEXT_PUBLIC_COVAL_API_URL || undefined;

const Component = () => {
  return (
    <div style={{ width: "100%", height: "300px" }}>
      <LatencyChart />
    </div>
  );
};

export default function Home() {
  return (
    <CovalProvider token={token} apiUrl={apiUrl}>
      <Component />
    </CovalProvider>
  );
}
