"use client";

import { Companies } from "@/components/Companies";
import { LoggedInLayout } from "@/components/LoggedInLayout";

export default function CompaniesPage() {
  return (
    <LoggedInLayout>
      <Companies />
    </LoggedInLayout>
  );
}
