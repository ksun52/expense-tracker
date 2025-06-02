import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LabelList } from 'recharts';
import { TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button";
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
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { format, subMonths, addMonths } from 'date-fns';

interface CategoryData {
    category: string;
    amount: number;
    fill: string;
}

const COLORS = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
    'var(--chart-6)',
];

export default function ChartView() {
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [chartData, setChartData] = useState<CategoryData[]>([]);
    const [chartConfig, setChartConfig] = useState<ChartConfig>({});

    const fetchCategoryData = async (month: Date) => {
        try {
            const formattedMonth = format(month, 'yyyy-MM');
            const response = await fetch(`http://localhost:8000/api/v1/summary/categories?month=${formattedMonth}`);
            const data = await response.json();
            
            // Transform the data into the format expected by the chart
            // TODO: change colors 
            const transformedData = Object.entries(data).map(([category, amount], index) => ({
                category,
                amount: Number(amount),
                fill: COLORS[index % COLORS.length]
            }));
            
            setChartData(transformedData);

            // Create chart config dynamically based on the categories
            const config: ChartConfig = {
                amount: {
                    label: "Amount",
                },
                ...transformedData.reduce((acc, { category, fill }) => ({
                    ...acc,
                    [category]: {
                        label: category,
                        color: fill
                    }
                }), {})
            };
            
            setChartConfig(config);
        } catch (error) {
            console.error('Error fetching category data:', error);
        }
    };

    useEffect(() => {
        fetchCategoryData(selectedMonth);
    }, [selectedMonth]);

    const handlePreviousMonth = () => {
        setSelectedMonth(prev => subMonths(prev, 1));
    };

    const handleNextMonth = () => {
        setSelectedMonth(prev => addMonths(prev, 1));
    };

    return (
      <div className="container mx-auto p-4">
        <Card className="flex flex-col w-full">
          <CardHeader className="items-center pb-2">
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>{format(selectedMonth, 'MMMM yyyy')}</CardDescription>
            <div className="flex items-center gap-4 mt-4">
                <Button variant="outline" onClick={handlePreviousMonth} className="w-32">
                    Previous Month
                </Button>
                <span className="text-lg font-medium">
                    {format(selectedMonth, 'MMMM yyyy')}
                </span>
                <Button variant="outline" onClick={handleNextMonth} className="w-32">
                    Next Month
                </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square h-[350px] pb-0"
            >
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie 
                  data={chartData} 
                  dataKey="amount" 
                  nameKey="category"
                  label={({ amount }) => amount.toFixed(2)}
                  labelLine={true}
                />
                <ChartLegend
                  content={<ChartLegendContent nameKey="category" />}
                  className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm pt-2">
            <div className="flex items-center gap-2 leading-none font-medium">
                Total Spending: ${chartData.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
            </div>
            <div className="text-muted-foreground leading-none">
                Showing spending breakdown for {format(selectedMonth, 'MMMM yyyy')}
            </div>
          </CardFooter>
        </Card>
      </div>
    );
}
