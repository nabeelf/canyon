"use client";

import { PricingPlans } from "@/components/PricingPlans";
import { LoggedInLayout } from "@/components/LoggedInLayout";

export default function PricingPlansPage() {
  return (
    <LoggedInLayout>
      <PricingPlans />
    </LoggedInLayout>
  );
}
