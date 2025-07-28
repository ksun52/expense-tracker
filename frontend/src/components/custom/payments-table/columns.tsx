"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/custom/custom-table/column-header"
import categories from "@/data/categories.json"
import paymentMethods from "@/data/payment_methods.json"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: number
  notion_id: string | null
  name: string
  amount: number
  date: string
  category: string
  sub_category: string
  method: string
  created_at: Date
  updated_at: Date
}

// Function to get category styling from categories.json
const getCategoryStyle = (categoryName: string): string => {
  const category = categories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase())
  if (category) {
    return `${category.bg} ${category.text}`
  }
  return "bg-gray-100 text-gray-800" // fallback for unknown categories
}

export const getMethodIconUrl = (methodName: string): string | null => {
  const entry = paymentMethods.find(
    (m: { name: string; icon: string }) => m.name.toLowerCase() === methodName.toLowerCase()
  )
  return entry?.icon || null
}

export const columns: ColumnDef<Payment>[] = [
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
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string
      return (
        <div
          className="max-w-[180px] truncate text-left"
          title={name}
        >
          {name}
        </div>
      )
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("date")}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
 
      return <div className="text-left font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("category") as string
      const color = getCategoryStyle(value)
      return (
        <div className="flex justify-left">
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${color}`}>
            {value}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "sub_category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subcategory" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("sub_category") as string
      const color = getCategoryStyle(value)
      return (
        <div className="flex justify-left">
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${color}`}>
            {value}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "method",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Method" />
    ),
    cell: ({ row }) => {
      const method = row.getValue("method") as string
      const icon = getMethodIconUrl(method)
  
      return (
        <div className="flex items-center gap-2 text-left">
          {icon && (
            <img
              src={icon}
              alt={`${method} icon`}
              className="w-4 h-4"
            />
          )}
          <span>{method}</span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id.toString())}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.amount.toString())}
            >
              Copy amount
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    size: 50,
  },
]
