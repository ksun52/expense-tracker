import { useEffect, useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import categories from "@/data/categories.json";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { format, parse } from "date-fns";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../../ui/chart";
import { TrendingDown } from "lucide-react";
import { TrendingUp } from "lucide-react";
import ReusableChartCard from "./reusable-chart-card";

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

// Backend returns: { category: { 'YYYY-MM': total, ... }, ... }
interface CategoryMonthlyData {
  [category: string]: {
    [month: string]: number;
  };
}

type CategoryGraphsProps = {
  monthRange: number;
}

export default function CategoryGraphs({ monthRange }: CategoryGraphsProps) {
  const [data, setData] = useState<CategoryMonthlyData>({});
  const [months, setMonths] = useState<string[]>([]);

  const fetchCategoryData = async () => {
    try {

      console.log("monthRange", monthRange);
      const response = await fetch(`http://localhost:8000/api/v1/summary/monthly-categories?months=${monthRange}`);
      const result = await response.json();
      setData(result);

      // Collect all months across all categories to make sure the x-axis is complete
      const allMonths = new Set<string>();
      Object.values(result).forEach((category: any) => {
        Object.keys(category).forEach(month => allMonths.add(month));
      });
      setMonths(Array.from(allMonths).sort());
    } catch (error) {
      console.error('Error fetching monthly category data:', error);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, [monthRange]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
      {categories.map((cat) => {

        // Prepare data for recharts - format as array of {month, amount} objects
        // grab data from the month or set as 0 if no data
        const chartData: MonthlyData[] = months.map(month => ({
          month,
          amount: data[cat.name]?.[month] || 0
        }));

        const calculateTrend = () => {
          if (chartData.length < 2) return { percentage: 0, isPositive: false };
          const current = chartData.at(-1)?.amount ?? 0
          const previous = chartData.length >= 2  // prevent division by zero
            ? chartData.at(-2)?.amount || current
            : current
          const percentage = ((current - previous) / previous) * 100;
          return {
            percentage: Math.abs(percentage).toFixed(1),
            isPositive: percentage >= 0
          };
        };

        const trend = calculateTrend();

        return (
          <ReusableChartCard
            key={cat.name}
            title={cat.name.toUpperCase()}
            description={`Monthly spending for "${cat.name}"`}
            chartData={chartData}
            chartConfig={chartConfig}
            className=""
            isTrendingUp={trend.isPositive}
            trendUp={<span className="text-red-600">▲ {trend.percentage}% increase</span>}
            trendDown={<span className="text-green-600">▼ {trend.percentage}% decrease</span>}
          />
        );
      })}
    </div>
  );
}