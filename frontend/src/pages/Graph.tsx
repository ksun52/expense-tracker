"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { getAllCategories } from "@/utils/categoryUtils"

import {
  ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import CategoryGraphs from "@/components/custom/graphs/category-graphs"
import ReusableChartCard from "@/components/custom/graphs/reusable-chart-card"

export const description = "A linear line chart"

const dateRanges = {
  "3 Months": 3,
  "6 Months": 6,
  "9 Months": 9,
  "YTD": new Date().getMonth() + 1,
  "1 Year": 12,
  "3 Years": 36,
  "5 Years": 60,
  "All Time": 0,
} as const

type RangeKey = keyof typeof dateRanges

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

type GraphBudgetData = {
  budget: number
}

const initialBudgets: Record<string, GraphBudgetData> = getAllCategories().reduce(
  (acc, cat) => {
    acc[cat.name] = { budget: 0 }
    return acc
  },
  {} as Record<string, GraphBudgetData>
)

export default function MonthlyTrends() {
  const [chartData, setChartData] = useState<MonthlyData[]>([]);
  const [range, setRange] = useState<RangeKey>("6 Months")
  const [budgets, setBudgets] = useState<Record<string, GraphBudgetData>>(initialBudgets)

  const fetchMonthlyData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/summary/monthly?months=${dateRanges[range]}`);
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
    const fetchBudgetData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/budget/")
        const budgetData = await response.json()

        // Build a map from API
        const apiBudgets: Record<string, GraphBudgetData> = budgetData.reduce(
          (acc: Record<string, GraphBudgetData>, item: any) => {
            acc[item.category] = { budget: item.budget_amount }
            return acc
          },
          {}
        )

        // Merge into current state
        setBudgets(prev => {
          const merged = { ...prev }
          for (const [cat, data] of Object.entries(apiBudgets)) {
            merged[cat] = data // overwrite if exists, add if new
          }
          return merged
        })
      } catch (error) {
        console.error("Error fetching budget data:", error)
      }
    }

    fetchBudgetData()
  }, [])

  const totalBudget = Object.values(budgets).reduce((sum, data) => sum + data.budget, 0)

  useEffect(() => {
    fetchMonthlyData();
  }, [range]);

  const calculateTrend = () => {
    if (chartData.length < 2) return { percentage: 0, isPositive: false };

    const current = chartData.at(-1)?.amount ?? 0
    const previous = chartData.at(-2)?.amount ?? current;

    if (previous === 0) {
      return { percentage: 0, isPositive: true }; // avoid divide-by-zero
    }

    const percentage = ((current - previous) / previous) * 100;
    return {
      percentage: Math.abs(percentage).toFixed(1),
      isPositive: percentage >= 0
    };
  };

  const trend = useMemo(() => calculateTrend(), [chartData]);

  return (
    <div>
      {/* Date Range Selector*/}
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">Display Range</p>
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
      <ReusableChartCard
        title="Monthly Spending Trends"
        description="Lifetime Spending"
        chartData={chartData}
        chartConfig={chartConfig}
        budget={totalBudget}
        className="mt-6"
        isTrendingUp={trend.isPositive}
        trendUp={
          <>
            Spending increased by {trend.percentage}% this month
            <TrendingUp className="h-4 w-4 text-red-500" />
          </>
        }
        trendDown={
          <>
            Spending decreased by {trend.percentage}% this month
            <TrendingDown className="h-4 w-4 text-green-500" />
          </>
        }
      />

      <CategoryGraphs monthRange={dateRanges[range]} budgets={budgets} />
    </div>
  )
}
