import React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { Link } from "react-router-dom"

import { cn } from "@/lib/utils"

const assetData = [
  {
    category: "Cash",
    color: "bg-violet-500",
    weight: 0.1846,
    accounts: [
      { name: "PNC", value: 5531.93 },
      { name: "Venmo", value: 1000.00 },
    ],
  },
  {
    category: "Investments",
    color: "bg-blue-500",
    weight: 0.8154,
    accounts: [
      { name: "Apple HYSA", value: 24429.96 },
    ],
  },
  {
    category: "Debt",
    color: "bg-red-500",
    weight: 0.0000,
    accounts: [
      { name: "Chase", value: 1000.00 },
      { name: "Discover", value: 1000.00 },
      { name: "Apple", value: 1000.00 },
      { name: "Amex", value: 1000.00 },
    ],
  }
]

const total = assetData.reduce(
  (sum, cat) =>
    sum + cat.accounts.reduce((s, a) => s + a.value, 0), 0
)

export function AssetBreakdownCard() {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-xl text-left">
          Assets · <span className="text-muted-foreground">${total.toLocaleString()}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* custom progress bar */}
        <div className="flex h-2 w-full overflow-hidden rounded-full">
          {assetData.map((cat, i) => (
            <div
              key={i}
              className={cn(cat.color, "h-full")}
              style={{ width: `${cat.weight * 100}%` }}
            />
          ))}
        </div>
        {/* progress bar labels */}
        <div className="flex gap-4 text-sm text-muted-foreground">
          {assetData.map(cat => (
            <div key={cat.category} className="flex items-center gap-1">
              <div className={cn(cat.color, "w-2 h-2 rounded-full")} />
              <span>{cat.category}</span>
              <span className="font-semibold">
                {(cat.weight * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>

        <div className="rounded-lg border bg-gray-100">
          {/* your header row stays as-is */}
          <div className="grid grid-cols-3 py-2 px-3 text-xs text-muted-foreground uppercase">
            <div className="text-left">Name</div>
            <div className="text-right">Weight</div>
            <div className="text-right">Value</div>
          </div>

          <Accordion
            type="multiple"
            className="m-1 rounded-md bg-white divide-y divide-black/10"
          >
            {assetData.map((cat) => {
              const subtotal = cat.accounts.reduce((sum, a) => sum + a.value, 0);
              const weight = (subtotal / total) * 100;

              return (
                <AccordionItem key={cat.category} value={cat.category}>
                  {/* ------------------------- */}
                  {/* 1) TRIGGER: use the same grid + px-3 as your header */}
                  <AccordionTrigger className="px-3 py-3 text-bold flex-row-reverse font-medium">
                    <div className="grid grid-cols-3 items-center w-full">
                      <div className="text-left">{cat.category}</div>

                      <div className="text-right">
                        {weight.toFixed(2)}%
                      </div>
                      <div className="text-right">
                        ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </AccordionTrigger>

                  {/* ------------------------- */}
                  {/* 2) CONTENT: same grid & px-3 */}
                  <AccordionContent className="p-0">
                    <div className="grid grid-cols-[1fr_1.11fr_1fr] px-3 py-2 text-sm">
                      {cat.accounts.map((acc, i) => (
                        <React.Fragment key={i}>
                          {/* name */}
                          <div className="flex items-center gap-2">
                            <span className="text-transparent">......</span>  {/* BAD CODE -- FIGURE OUT HOW TO ALIGN BETTER */}
                            <div className={cn(cat.color, "w-3 h-3 rounded-full")} />
                            <Link to={`/accounts/${encodeURIComponent(acc.name)}`} className="hover:underline">
                              {acc.name}
                            </Link>
                          </div>
                          {/* weight */}
                          <div className="text-sm text-right">
                            {((acc.value / total) * 100).toFixed(2)}%
                          </div>
                          {/* value */}
                          <div className="text-right">
                            ${acc.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </CardContent>
    </Card>
  )
}
