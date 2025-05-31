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
            const response = await fetch(`/api/v1/summary/categories?month=${formattedMonth}`);
            const data = await response.json();
            
            // Transform the data into the format expected by the chart
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
                ...transformedData.reduce((acc, { category }) => ({
                    ...acc,
                    [category]: {
                        label: category,
                        color: COLORS[transformedData.findIndex(d => d.category === category) % COLORS.length]
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
            <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                    <CardTitle>Spending by Category</CardTitle>
                    <CardDescription>{format(selectedMonth, 'MMMM yyyy')}</CardDescription>
                    <div className="flex items-center gap-4 mt-4">
                        <Button variant="outline" onClick={handlePreviousMonth}>
                            Previous Month
                        </Button>
                        <span className="text-lg font-medium">
                            {format(selectedMonth, 'MMMM yyyy')}
                        </span>
                        <Button variant="outline" onClick={handleNextMonth}>
                            Next Month
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    <ChartContainer
                        config={chartConfig}
                        className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
                    >
                        <PieChart>
                            <ChartTooltip
                                content={<ChartTooltipContent nameKey="amount" hideLabel />}
                            />
                            <Pie data={chartData} dataKey="amount">
                                <LabelList
                                    dataKey="category"
                                    className="fill-background"
                                    stroke="none"
                                    fontSize={12}
                                    formatter={(value: keyof typeof chartConfig) =>
                                        chartConfig[value]?.label
                                    }
                                />
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
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
