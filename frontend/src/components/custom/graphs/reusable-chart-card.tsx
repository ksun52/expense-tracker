import { ReactNode } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../../ui/chart";
import { format, parse } from "date-fns";

interface ChartDataPoint {
  month: string;
  amount: number;
}

interface ReusableChartCardProps {
  title: string;
  description: string;
  chartData: ChartDataPoint[];
  chartConfig: ChartConfig;
  isTrendingUp: boolean;
  trendUp: ReactNode;
  trendDown: ReactNode;
  className?: string;
}

export default function ReusableChartCard({
  title,
  description,
  chartData,
  chartConfig,
  isTrendingUp,
  trendUp,
  trendDown,
  className = "",
}: ReusableChartCardProps) {

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full min-h-[200px]">
          <LineChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              bottom: 12,
              top: 12,
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
              interval={0}
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
        <CardFooter className="text-sm">
          <div className="mt-4 flex items-center gap-2 leading-none font-medium">
            {isTrendingUp ? trendUp : trendDown}
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
} 