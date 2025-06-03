"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { useState, useEffect, useMemo } from "react"
import { format, parse } from "date-fns"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  CustomExpenseChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A linear line chart"

const chartConfig = {
  amount: {
    label: "Monthly Expenses",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

interface MonthlyData {
  month: string;
  amount: number;
}

export default function MonthlyTrends() {
  const [chartData, setChartData] = useState<MonthlyData[]>([]);

  const fetchMonthlyData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/summary/monthly');
      const data = await response.json();

      // Transform data into format expected by graph 
      // map {2025-01: 100} to {month: "2025-01", amount: 100}
      const transformedData = Object.entries(data).map(([month, amount]) => ({
        month,
        amount: Number(amount),
      }));

      setChartData(transformedData);
    } catch (error) {
      console.error('Error fetching monthly data:', error);
    }
  };

  useEffect(() => {
    fetchMonthlyData();
  }, []);

  const calculateTrend = () => {
    if (chartData.length < 2) return { percentage: 0, isPositive: true };
    const current = chartData[chartData.length - 1].amount;
    const previous = chartData[chartData.length - 2].amount;
    const percentage = ((current - previous) / previous) * 100;
    return {
      percentage: Math.abs(percentage).toFixed(1),
      isPositive: percentage >= 0
    };
  };

  const trend = useMemo(() => calculateTrend(), [chartData]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Spending Trend</CardTitle>
        <CardDescription>Lifetime Spending</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full min-h-[200px]">
          <LineChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              angle={-45}
              textAnchor="end"
              height={50}
              tickFormatter={(value) => format(parse(value, 'yyyy-MM', new Date()), 'yyyy-MMM')}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: number) => `$${Number(value).toFixed(2)}`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent 
                formatter={(value) => `Total: $${Number(value).toFixed(2)}`}
                labelFormatter={(label) => format(parse(label, 'yyyy-MM', new Date()), 'yyyy-MMM')}
                nameKey="month"
              />}
            />
            <Line
              dataKey="amount"
              type="linear"
              stroke="var(--color-amount)"
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {trend.isPositive ? (
            <>
              Spending increased by {trend.percentage}% this month
              <TrendingUp className="h-4 w-4 text-red-500" />
            </>
          ) : (
            <>
              Spending decreased by {trend.percentage}% this month
              <TrendingDown className="h-4 w-4 text-green-500" />
            </>
          )}
        </div>
        <div className="text-muted-foreground leading-none">
          Showing lifetime spending
        </div>
      </CardFooter>
    </Card>
  )
}
