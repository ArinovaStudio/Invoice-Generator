import { Suspense } from "react";
import PayClient from "@/components/PayPage";
import LoadingComponent from "@/components/LoadingComponent";

export default function Page() {
  return (
    <Suspense
      fallback={<LoadingComponent text={"Preparing secure payment..."} />}
    >
      <PayClient />
    </Suspense>
  );
}
