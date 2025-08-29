"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Quote, ApprovalStatus } from "@/app/types"
import { downloadQuoteDocument } from "@/app/utils/download_file"
import { StatusPill } from "@/components/ui/status-pill"






interface DataTableProps {
  quotes: Quote[];
  onViewDetails: (quote: Quote) => void;
}

export function DataTable({ quotes, onViewDetails }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  // Define columns inside the component to access the onViewDetails callback
  const columns: ColumnDef<Quote>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
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
          ${row.original.tcv.toLocaleString()}
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
                    // Extract file extension from the actual filename
                    const fileExtension = quote.filename.includes('.') ? quote.filename.split('.').pop() : '';
                    const extension = fileExtension ? `.${fileExtension}` : '';
                    await downloadQuoteDocument(quote.filename, quote.name || 'Quote', extension);
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
                  onViewDetails(quote);
                }}
              >
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: quotes,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })



  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search quotes by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        
        {/* Status Filter */}
        <Select
          value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
          onValueChange={(value) => {
            table.getColumn("status")?.setFilterValue(value === "all" ? "" : value);
          }}
        >
          <SelectTrigger className="w-[180px] ml-4">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value={ApprovalStatus.PENDING}>{ApprovalStatus.PENDING}</SelectItem>
            <SelectItem value={ApprovalStatus.APPROVED}>{ApprovalStatus.APPROVED}</SelectItem>
            <SelectItem value={ApprovalStatus.REJECTED}>{ApprovalStatus.REJECTED}</SelectItem>
            <SelectItem value={ApprovalStatus.INFO_REQUESTED}>{ApprovalStatus.INFO_REQUESTED}</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Company Filter */}
        <Select
          value={(table.getColumn("company")?.getFilterValue() as string) ?? ""}
          onValueChange={(value) => {
            table.getColumn("company")?.setFilterValue(value === "all" ? "" : value);
          }}
        >
          <SelectTrigger className="w-[180px] ml-4">
            <SelectValue placeholder="Filter by company" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Companies</SelectItem>
            {Array.from(new Set(quotes.map(q => q.company.name).filter(Boolean))).map((company) => (
              <SelectItem key={company!} value={company!}>
                {company}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Delete Selected Button */}
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="ml-4"
              >
                Delete Selected ({table.getFilteredSelectedRowModel().rows.length})
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Selected Quotes</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete {table.getFilteredSelectedRowModel().rows.length} selected quote(s)? 
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    const selectedRows = table.getFilteredSelectedRowModel().rows;
                    const selectedIds = selectedRows.map(row => row.original.id);
                    
                    setIsDeleting(true);
                    try {
                      // Delete each selected quote
                      for (const id of selectedIds) {
                        const response = await fetch(`/api/quotes?id=${id}`, {
                          method: 'DELETE'
                        });
                        
                        if (!response.ok) {
                          throw new Error(`Failed to delete quote ${id}`);
                        }
                      }
                      
                      // Clear selection and refresh data
                      table.toggleAllPageRowsSelected(false);
                      setDeleteDialogOpen(false);
                      
                      // Optionally refresh the page or refetch data
                      window.location.reload();
                      
                    } catch (error) {
                      console.error('Delete failed:', error);
                      alert('Failed to delete some quotes. Please try again.');
                    } finally {
                      setIsDeleting(false);
                    }
                  }}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onViewDetails(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
