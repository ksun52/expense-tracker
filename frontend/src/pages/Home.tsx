import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts"

import { useEffect, useMemo, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import dynamic from "next/dynamic"
import { HomeHeader } from "@/components/headers/home-header"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// const SankeyChart = dynamic(() => import("@/components/custom/sankey-chart"), { ssr: false })

const fakeNetWorthData = [
  { date: "Jul 1", value: 92000 },
  { date: "Jul 8", value: 93500 },
  { date: "Jul 15", value: 94000 },
  { date: "Jul 22", value: 96000 },
  { date: "Jul 23", value: 96500 },
]

const fakeAssets = [
  { name: "Checking", value: 8500 },
  { name: "Savings", value: 20000 },
  { name: "Brokerage", value: 33000 },
  { name: "401k", value: 35000 },
]

const fakeCashflow = {
  nodes: [
    { name: "Income" },
    { name: "Rent" },
    { name: "Food" },
    { name: "Investments" },
    { name: "Other" },
  ],
  links: [
    { source: 0, target: 1, value: 2000 },
    { source: 0, target: 2, value: 800 },
    { source: 0, target: 3, value: 1500 },
    { source: 0, target: 4, value: 700 },
  ],
}

const fakeTransactions = [
  { date: "2025-07-22", description: "Trader Joe's", amount: -65.23 },
  { date: "2025-07-21", description: "Rent", amount: -2000 },
  { date: "2025-07-19", description: "Amazon", amount: -120.99 },
  { date: "2025-07-18", description: "Payroll", amount: 5000 },
  { date: "2025-07-16", description: "Coffee Shop", amount: -4.5 },
]

const fakeRecurring = [
  { description: "Rent", amount: 2000, cadence: "Monthly" },
  { description: "Spotify", amount: 9.99, cadence: "Monthly" },
  { description: "Internet", amount: 60, cadence: "Monthly" },
  { description: "Gym", amount: 40, cadence: "Monthly" },
]

const generateFakeData = (days: number): { date: string; value: number }[] => {
  const now = new Date()
  const data = []
  let base = 90000
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(now.getDate() - i)
    base += Math.round((Math.random() - 0.4) * 800)
    data.push({
      date: date.toISOString().slice(0, 10),
      value: base,
    })
  }
  return data
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const dateRanges = {
  "7d": 7,
  "mtd": new Date().getDate(),
  "30d": 30,
  "ytd":
    Math.floor(
      (new Date().getTime() -
        new Date(new Date().getFullYear(), 0, 1).getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1,
  "1y": 365,
  "3y": 365 * 3,
  "5y": 365 * 5,
} as const

type RangeKey = keyof typeof dateRanges

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const { value, payload: data } = payload[0]
  return (
    <div className="bg-white p-2 rounded shadow text-sm">
      <div className="font-medium">${value.toLocaleString()}</div>
      <div className="text-muted-foreground">{data.date}</div>
    </div>
  )
}

export default function FinanceDashboard() {

  const [range, setRange] = useState<RangeKey>("30d")
  const fakeNetWorthData = useMemo(() => generateFakeData(dateRanges[range]), [range])
  const netWorth = fakeNetWorthData.at(-1)?.value || 0
  const netWorthChange = netWorth - (fakeNetWorthData[0]?.value || 0)

  return (
    <>
      <HomeHeader/>
      <div className="grid grid-cols-1 xl:grid-cols-1 gap-4 pt-4">
        <Card className="col-span-1">
          <div className="flex justify-between items-start">
            <CardHeader className="flex-1 flex flex-col min-w-0">
              
            <p className="text-sm text-left text-muted-foreground">Net Worth</p>
            <CardTitle className="text-left text-2xl">${netWorth.toLocaleString()}</CardTitle>
            
            {netWorthChange >= 0 ? 
              <CardDescription className="text-left text-green-500">
                +${Math.abs(netWorthChange).toLocaleString()} (+${((netWorthChange / (netWorth - netWorthChange)) * 100).toFixed(2)}%) this period
              </CardDescription>
              :
              <CardDescription className="text-left text-red-500">
                -${Math.abs(netWorthChange).toLocaleString()} (-${((netWorthChange / (netWorth - netWorthChange)) * 100).toFixed(2)}%) this period
              </CardDescription>
            } 
            </CardHeader>
            <div className="pr-4">
              <Select value={range} onValueChange={v => setRange(v as RangeKey)}>
                <SelectTrigger className="">
                  <SelectValue placeholder="Display Range" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(dateRanges).map(key => (
                    <SelectItem key={key} value={key}>{key.toUpperCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <CardContent>
          <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={fakeNetWorthData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
            {/* <ResponsiveContainer width="100%" height={200}>
              <LineChart data={fakeNetWorthData}>
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer> */}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
