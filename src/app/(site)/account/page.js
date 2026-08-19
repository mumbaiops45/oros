import { Suspense } from "react";
import AccountDashboard from "@/components/account/AccountDashboard";

export const metadata = {
  title: "Your account — OROS 3D",
};

export default function AccountPage() {
  return (
    // The dashboard reads its active tab from the query string, so it has to
    // sit behind a boundary of its own.
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center bg-cream">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-navy/20 border-t-primary" />
        </div>
      }
    >
      <AccountDashboard />
    </Suspense>
  );
}
