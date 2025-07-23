import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts"
import { useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import dynamic from "next/dynamic"
import { HomeHeader } from "@/components/headers/home-header"

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

export default function FinanceDashboard() {
  const netWorth = fakeNetWorthData[fakeNetWorthData.length - 1].value
  const netWorthChange = netWorth - fakeNetWorthData[0].value

  return (
    <>
      <HomeHeader/>
      <div className="grid grid-cols-1 xl:grid-cols-1 gap-4 pt-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Net Worth</CardTitle>
            <CardDescription>
              ${netWorth.toLocaleString()} ({netWorthChange >= 0 ? '+' : ''}${netWorthChange.toLocaleString()} this month)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={fakeNetWorthData}>
                <XAxis dataKey="date" />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
