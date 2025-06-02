import { CardContent } from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    CustomExpenseChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie } from 'recharts';

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
    return (
        <CardContent className="flex-1 pb-0">
            <ChartContainer
                config={chartConfig}
                className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square h-[350px] pb-0"
            >
                <PieChart>
                    <ChartTooltip 
                        cursor={false} 
                        content={({ active, payload }) => (
                            <CustomExpenseChartTooltipContent active={active ?? false} payload={payload ?? []} />
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
    );
} 