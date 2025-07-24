"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { useState, useEffect, useMemo } from "react"

import {
  ChartConfig,
} from "@/components/ui/chart"
import CategoryGraphs from "@/components/custom/graphs/category-graphs"
import ReusableChartCard from "@/components/custom/graphs/reusable-chart-card"

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
    if (chartData.length < 2) return { percentage: 0, isPositive: false };
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
    <div>
      <ReusableChartCard
        title="Monthly Spending Trends"
        description="Lifetime Spending"
        chartData={chartData}
        chartConfig={chartConfig}
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
      <CategoryGraphs />
    </div>
  )
}
