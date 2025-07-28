"use client"
import * as React from "react"
import { Input } from "@/components/ui/input"
import { DataTablePagination } from "@/components/custom/custom-table/pagination-control"
import { DataTableViewOptions } from "@/components/custom/custom-table/column-visibility"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import categories from "@/data/categories.json" // already used in columns
import { subDays } from "date-fns"
import { useState } from "react"
import { Check } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export default function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 50, // ✅ default page size
  })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  })

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  // Custom state and functions for date filter
  const [dateRange, setDateRange] = useState<{startDate: Date | null; endDate: Date | null;}>({ startDate: null, endDate: null });
  const [selectedDatePreset, setSelectedDatePreset] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // Generic handler
  const handlePresetClick = (key: string, start: Date, end: Date) => {
    setDateRange({ startDate: start, endDate: end })
    setSelectedDatePreset(key)

    // apply filtering here
    table.getColumn("date")?.setFilterValue({ startDate: start, endDate: end })

    // close the popover
    setOpen(false);
  }

  return (
    <div>
        <div className="flex flex-wrap items-center gap-8 py-4">
        {/* Text Search */}
        <Input
          placeholder="Search transactions..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        {/* Category Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-4">Select Category</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem 
              onClick={() => {
                table.getColumn("category")?.setFilterValue("");
                setSelectedCategory("all");
              }}>
              all
              {(selectedCategory === "all" || selectedCategory === null) && <Check className="w-4 h-4 text-muted-foreground" />}
            </DropdownMenuItem>
            {categories.map(cat => (
              <DropdownMenuItem
                key={cat.name}
                onClick={() => {
                  table.getColumn("category")?.setFilterValue(cat.name);
                  setSelectedCategory(cat.name);
                }}
              >
                {cat.name}
                {selectedCategory === cat.name && <Check className="w-4 h-4 text-muted-foreground" />}
              </DropdownMenuItem> 
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Date Filter */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline">Filter Date</Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto">
            <div className="flex flex-col justify-start space-y-1">
              <Button
                variant={selectedDatePreset === "last7" ? "secondary" : "ghost"}
                onClick={() =>
                  handlePresetClick("last7", subDays(new Date(), 7), new Date())
                }
                className="justify-start"
              >
                Last 7 days
              </Button>
              <Button
                variant={selectedDatePreset === "last14" ? "secondary" : "ghost"}
                onClick={() =>
                  handlePresetClick("last14", subDays(new Date(), 14), new Date())
                }
                className="justify-start"
              >
                Last 14 days
              </Button>
              <Button
                variant={selectedDatePreset === "last30" ? "secondary" : "ghost"}
                onClick={() =>
                  handlePresetClick("last30", subDays(new Date(), 30), new Date())
                }
                className="justify-start"
              >
                Last 30 days
              </Button>
              <Button
                variant={selectedDatePreset === "thisMonth" ? "secondary" : "ghost"}
                onClick={() =>
                  handlePresetClick(
                    "thisMonth",
                    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    new Date()
                  )
                }
                className="justify-start"
              >
                This month
              </Button>
              <Button
                variant={selectedDatePreset === "lastMonth" ? "secondary" : "ghost"}
                onClick={() =>
                  handlePresetClick(
                    "lastMonth",
                    new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
                    new Date(new Date().getFullYear(), new Date().getMonth(), 0)
                  )
                }
                className="justify-start"
              >
                Last month
              </Button>
              <Button
                variant={selectedDatePreset === "thisYear" ? "secondary" : "ghost"}
                onClick={() =>
                  handlePresetClick(
                    "thisYear",
                    new Date(new Date().getFullYear(), 0, 1),
                    new Date()
                  )
                }
                className="justify-start"
              >
                This year
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* View Options */}
        <DataTableViewOptions table={table} />
      </div>
      <div className="rounded-md border">
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
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
