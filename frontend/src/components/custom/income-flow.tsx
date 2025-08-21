
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import categoriesStyles from "@/data/categories.json"


// IncomeCompare (shadcn version)
// ----------------------------------------------------
// Left: one big block = total income
// Right: one stacked block = all spend categories + final slice = savings
// Colors/labels come from data/categories.json
// Tailwind-only visuals (no chart lib). Uses shadcn <Card/>.
//
// Usage:
// <IncomeCompareDemo/>  // demo with fake data covering all categories
// or
// <IncomeCompare income={...} entries={[{ name:"groceries", amount: 300 }, ...]}/>

export type CategoryKey = string // must match categories.json "name"

export type Entry = {
  name: CategoryKey
  amount: number
}

export type IncomeCompareProps = {
  income: number
  entries: Entry[]
  height?: number // px height for the blocks
}

type CategoryStyle = {
  name: string
  color: string
  bg: string
  text: string
}

const CAT_STYLES: CategoryStyle[] = categoriesStyles as unknown as CategoryStyle[]

function findStyle(cat: string): CategoryStyle | undefined {
  return CAT_STYLES.find(c => c.name.toLowerCase() === cat.toLowerCase())
}

export default function IncomeCompare({
  income,
  entries,
  height = 280,
}: IncomeCompareProps) {


  const spent = Math.max(0, entries.reduce((s, e) => s + (e.amount || 0), 0))
  const savings = income - spent
  const ratioOver = spent < income ? income : spent

  // Sort by largest spend for readability
  const sorted = [...entries].sort((a, b) => b.amount - a.amount)

  // add the rest of the cateogies from categories.json that are not in the entries
  const restOfCategories = CAT_STYLES.filter(c => !entries.some(e => e.name === c.name))
  console.log(restOfCategories)
  const restOfEntries = restOfCategories.map(c => ({ name: c.name, amount: 0 }))
  const allEntries = [...sorted, ...restOfEntries]

  // add savings to the stack if its greater than 0
  const allStacks: Array<Entry> = savings > 0 ? [...allEntries, { name: "savings", amount: savings }] : allEntries

  return (
    <div className="w-full">

      {/* Allocation block */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Income and Allocation</CardTitle>
          <CardDescription>Income vs Spending + Savings</CardDescription>
        </CardHeader>
        <CardContent>

          {/* stacks vs legend */}
          <div className="flex flex-col items-center">

            {/* income vs spending stacks */}
            <div className="flex flex-row items-center gap-4">

              {/* income stacks */}
              <div className="flex flex-col items-center">
                <div
                  className="w-45 rounded-xl border border-gray-200 bg-blue-500 shadow-sm"
                  style={{ height }}
                />
                {/* if income not enough, need to add another block to show negative spending */}
                {income < spent && (
                  <div className="w-45 bg-white" style={{ height }} />
                )}
                <div className="mt-2 text-sm font-medium text-gray-800">Income: ${income.toFixed(2)}</div>
              </div>

              {/* spending stacks*/}
              <div className="flex flex-col items-center">

                {/* if income not enough, need to add another block to show negative spending */}
                {income < spent && (
                  <div className="w-45 bg-white" style={{ height }} />
                )}
                <div className="w-45 overflow-hidden rounded-xl border border-gray-200 shadow-sm" style={{ height }}>
                  {allStacks.map((s, idx) => {
                    const h = (s.amount / ratioOver) * height
                    const style = s.name === "savings" ? { bg: "bg-green-200", text: "text-green-900" } : findStyle(s.name)
                    const bgClass = style?.bg || "bg-slate-200"
                    const textClass = style?.text || "text-slate-800"
                    const percentage = ((s.amount / ratioOver) * 100).toFixed(1)

                    console.log(s.name, h, style, bgClass, textClass)

                    return (
                      <Tooltip key={`${s.name}-${idx}`}>
                        <TooltipTrigger asChild>
                          <div
                            className={`flex items-center justify-center text-[10px] ${textClass} ${bgClass} cursor-pointer`}
                            style={{ height: h }}
                          >
                            {h > 18 ? s.name : ""}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-center">
                            <div className="font-medium capitalize">{s.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {spent < income ? `${s.amount.toFixed(2)} (${percentage}% of income)` : `${s.amount.toFixed(2)} (${percentage}% of total spend)`}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )
                  })}
                </div>

                <div className="mt-2 text-sm font-medium text-gray-800">Total Spent: ${spent.toFixed(2)}</div>
              </div>

            </div>


            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-2 text-xs">
              {allEntries.map((e) => {
                const style = findStyle(e.name)
                return (
                  <span key={e.name} className={`inline-flex items-center gap-2 rounded-md px-2 py-1 ${style?.bg || "bg-slate-200"} ${style?.text || "text-slate-800"}`}>
                    <span className={`h-3 w-3 rounded-sm ${style?.bg || "bg-slate-300"} border border-white shadow`} />
                    <span className="font-medium capitalize">{e.name}</span>
                    <span className="tabular-nums">${e.amount}</span>
                  </span>
                )
              })}
              <span className={`inline-flex items-center gap-2 rounded-md bg-green-200 px-2 py-1 text-green-900`}>
                <span className="h-3 w-3 rounded-sm bg-green-200" />
                <span className="font-medium capitalize">savings</span>
                <span className="tabular-nums">${savings.toFixed(2)}</span>
              </span>
            </div>
          </div>

        </CardContent>
      </Card>

    </div>
  )
}

// ----------------------------------------------------
// Demo with fake data across all categories.json entries
// ----------------------------------------------------
export function IncomeCompareDemo() {
  const income = 500
  const entries: Entry[] = [
    { name: "rent", amount: 1850 }, // not in JSON; will default style
    { name: "groceries", amount: 520 },
    { name: "utilities", amount: 260 },
    { name: "transportation", amount: 260 },
    { name: "subscriptions", amount: 120 },
    { name: "going out", amount: 380 },
    { name: "restaurants/coffee", amount: 420 },
    { name: "clothes/care", amount: 160 },
    { name: "entertainment", amount: 240 },
    { name: "misc", amount: 150 },
  ]

  return <IncomeCompare income={income} entries={entries} height={320} />
}
