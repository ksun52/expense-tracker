import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
} from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useMemo, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import dynamic from "next/dynamic"
import { HomeHeader } from "@/components/headers/home-header"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AssetBreakdownCard } from "@/components/custom/asset-breakdown"
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
  networth: {
    label: "Net Worth",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const dateRanges = {
  "7d": 7,
  mtd: new Date().getDate(),
  "30d": 30,
  ytd:
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

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })

export default function FinanceDashboard() {
  const [range, setRange] = useState<RangeKey>("30d")
  const rawData = useMemo(() => generateFakeData(dateRanges[range]), [range])

  const fakeNetWorthData = useMemo(
    () =>
      rawData.map(d => ({
        date: d.date,
        networth: d.value,
      })),
    [rawData]
  )

  const netWorth = fakeNetWorthData.at(-1)?.networth || 0
  const netWorthChange = netWorth - (fakeNetWorthData[0]?.networth || 0)

  return (
    <>
      <HomeHeader />
      <div className="grid grid-cols-1 xl:grid-cols-1 gap-4 pt-4">

        {/* // TODO: fix the chart tooltip */}
        <Card className="col-span-1">
          <div className="flex justify-between items-start">
            <CardHeader className="flex-1 flex flex-col min-w-0">
              <p className="text-sm text-left text-muted-foreground">Net Worth</p>
              <CardTitle className="text-left text-2xl">
                ${netWorth.toLocaleString()}
              </CardTitle>
              {netWorthChange >= 0 ? (
                <CardDescription className="text-left text-green-500">
                  +${Math.abs(netWorthChange).toLocaleString()} (+
                  {((netWorthChange / (netWorth - netWorthChange)) * 100).toFixed(2)}%) this period
                </CardDescription>
              ) : (
                <CardDescription className="text-left text-red-500">
                  -${Math.abs(netWorthChange).toLocaleString()} (
                  {((netWorthChange / (netWorth - netWorthChange)) * 100).toFixed(2)}%) this period
                </CardDescription>
              )}
            </CardHeader>
            <div className="pr-4">
              <Select value={range} onValueChange={v => setRange(v as RangeKey)}>
                <SelectTrigger>
                  <SelectValue placeholder="Display Range" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(dateRanges).map(key => (
                    <SelectItem key={key} value={key}>
                      {key.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[150px] w-full">
              <AreaChart data={fakeNetWorthData} margin={{ left: 0, right: 0 }}>
                {/* <CartesianGrid vertical={false} strokeDasharray="3 3" /> */}
                <XAxis dataKey="date" hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <defs>
                  <linearGradient id="fillNetworth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="networth"
                  stroke="var(--chart-2)"
                  fill="url(#fillNetworth)"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
          <CardFooter>
          <p className="text-xs flex justify-between text-muted-foreground w-full">
            <span>{formatDate(rawData[0]?.date)}</span>
            <span>{formatDate(rawData[rawData.length - 1]?.date)}</span>
          </p>
          </CardFooter>
        </Card>
        <AssetBreakdownCard />
      </div>
    </>
  )
}
