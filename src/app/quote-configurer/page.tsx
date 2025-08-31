"use client";

import { QuoteConfigurer } from "@/components/QuoteConfigurer";
import { LoggedInLayout } from "@/components/LoggedInLayout";

export default function QuoteConfigurerPage() {
  return (
    <LoggedInLayout>
      <QuoteConfigurer />
    </LoggedInLayout>
  );
}
