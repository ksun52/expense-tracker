import { CardContent } from "@/components/ui/card";
import { Card } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  CustomExpenseChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie } from 'recharts';
import { CategoryTable } from './CategoryTable';

interface CategoryData {
  category: string;
  amount: number;
  fill: string;
}

interface ChartContentProps {
  chartData: CategoryData[];
  chartConfig: ChartConfig;
}

export function ChartContent({ chartData, chartConfig }: ChartContentProps) {
  const totalAmount = chartData.reduce((acc, curr) => acc + curr.amount, 0);
  return (
    <CardContent className="flex-1 pb-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* Pie Chart Card */}
        <Card className="flex flex-col">
          <CardContent className="flex-1 flex flex-col items-center justify-center px-6">
            <ChartContainer
              config={chartConfig}
              className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square min-h-[400px] w-full max-w-2xl pb-0"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={({ active, payload }) => (
                    <CustomExpenseChartTooltipContent active={active ?? false} payload={payload ?? []} totalAmount={totalAmount} />
                  )}
                />
                <Pie
                  data={chartData}
                  dataKey="amount"
                  nameKey="category"
                />
                <ChartLegend
                  content={<ChartLegendContent nameKey="category" />}
                  className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Category Table Card */}
        <Card className="flex flex-col">
          <CardContent className="flex-1 flex flex-col justify-center px-6">
            <CategoryTable chartData={chartData} />
          </CardContent>
        </Card>
      </div>
    </CardContent>
  );
} 