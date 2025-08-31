"use client";

import { CreateQuote } from "@/components/CreateQuote";
import { LoggedInLayout } from "@/components/LoggedInLayout";

export default function CreateQuotePage() {
  return (
    <LoggedInLayout>
      <CreateQuote />
    </LoggedInLayout>
  );
}
