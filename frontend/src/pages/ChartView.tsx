import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card"
import { ChartConfig } from "@/components/ui/chart"
import { format, subMonths, addMonths } from 'date-fns';
import { ChartHeader } from '@/components/ui/custom-chart/ChartHeader';
import { ChartFooter } from '@/components/ui/custom-chart/ChartFooter';
import { ChartContent } from '@/components/ui/custom-chart/ChartContent';

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

    const totalAmount = chartData.reduce((sum, item) => sum + item.amount, 0);

    return (
        <div className="container mx-auto p-4">
            <Card className="flex flex-col w-full">
                <ChartHeader
                    title="Spending by Category"
                    selectedMonth={selectedMonth}
                    onPreviousMonth={handlePreviousMonth}
                    onNextMonth={handleNextMonth}
                />
                <ChartContent
                    chartData={chartData}
                    chartConfig={chartConfig}
                />
                <ChartFooter
                    totalAmount={totalAmount}
                    selectedMonth={selectedMonth}
                />
            </Card>
        </div>
    );
}
