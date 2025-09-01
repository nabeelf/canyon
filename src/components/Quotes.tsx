"use client";

import { DataTable } from "./DataTable";
import { Quote, ApprovalStatus } from "@/app/types";
import { useMemo } from "react";
import { PageHeader } from "./PageHeader";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusPill } from "@/components/ui/status-pill";
import { downloadQuoteDocument } from "@/app/utils/download_file";
import { useRouter } from "next/navigation";


export function Quotes({ quotes, onQuotesChange }: { quotes: Quote[]; onQuotesChange?: () => void }) {
  const router = useRouter();

  const handleViewDetails = (quote: Quote) => {
    router.push(`/quote/${quote.id}`);
  };

  // Define quote columns for the DataTable
  const quoteColumns: ColumnDef<Quote>[] = useMemo(() => [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-0"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="capitalize ml-3">{row.getValue("name")}</div>
      ),
    },
    {
      id: "status",
      accessorFn: (row) => row.current_step?.status || "No Status",
      enableSorting: false,
      header: () => {
        return (
          <div className="w-24 pl-0 ml-2 font-medium">
            Status
          </div>
        )
      },
      cell: ({ row }) => {
        const status = row.original.current_step?.status as ApprovalStatus
        return <div className="ml-2"><StatusPill status={status} approvalParty={row.original.current_step?.assignee.role} size="sm" /></div>;
      },
    },
    {
      accessorKey: "company",
      accessorFn: (row) => row.company.name || "No Company",
      header: () => <div className="pl-0 ml-2 font-medium">Company</div>,
      cell: ({ row }) => (
        <div className="ml-2 font-medium">{row.original.company.name}</div>
      ),
    },
    {
      accessorKey: "current_approver",
      header: () => <div className="pl-0 ml-2 font-medium">Current Reviewer</div>,
      cell: ({ row }) => (
        <div className="ml-2 text-muted-foreground">
          {row.original.current_step?.assignee.name || '—'}
        </div>
      ),
    },
    {
      accessorKey: "tcv",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-0 ml-2"
          >
            Total Contract Value
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="ml-5 font-medium">
          ${row.original.tcv ? row.original.tcv.toLocaleString() : '0'}
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full justify-start"
          >
            Created At
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const created_at = row.getValue("created_at") as string

        // Format the date as a readable time
        const formatted = new Date(created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        })

        return <div className="font-medium ml-3">{formatted}</div>
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const quote = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    await downloadQuoteDocument(quote.filename, quote.name || 'Quote');
                  } catch (error) {
                    console.error('Download failed:', error);
                    alert('Download failed. Please try again.');
                  }
                }}
              >
                Download Quote
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails(quote);
                }}
              >
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ], [handleViewDetails]);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 pb-8 animate-slide-in-top">
      <div className="space-y-6">
        <PageHeader
          title="Quotes"
          subtitle="Manage and view all your enterprise quotes in one place."
        />
        
        <DataTable<Quote>
          data={quotes}
          columns={quoteColumns}
          onViewDetails={handleViewDetails}
          searchColumn="name"
          searchPlaceholder="Search quotes by name..."
          enableDelete={true}
          onDelete={async (ids) => {
            // Delete each selected quote
            for (const id of ids) {
              const response = await fetch(`/api/quotes?id=${id}`, {
                method: 'DELETE'
              });
              
              if (!response.ok) {
                throw new Error(`Failed to delete quote ${id}`);
              }
            }
            // Refresh the quotes data instead of reloading the page
            if (onQuotesChange) {
              onQuotesChange();
            }
          }}
          getId={(quote) => quote.id.toString()}
          deleteDialogTitle="Delete Selected Quotes"
          deleteDialogDescription="Are you sure you want to delete the selected quote(s)? This action cannot be undone."
        />
      </div>
    </div>
  );
}
