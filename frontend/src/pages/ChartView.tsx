import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card"
import { ChartConfig } from "@/components/ui/chart"
import { format, subMonths, addMonths } from 'date-fns';
import { ChartHeader } from '@/components/custom/custom-pie-chart/ChartHeader';
import { ChartFooter } from '@/components/custom/custom-pie-chart/ChartFooter';
import { ChartContent } from '@/components/custom/custom-pie-chart/ChartContent';
import { getAllCategories, getNotionColorCSS } from '@/utils/categoryUtils';

interface CategoryData {
  category: string;
  amount: number;
  fill: string;
}


export default function ChartView() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [chartData, setChartData] = useState<CategoryData[]>([]);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({});

  const fetchCategoryData = async (month: Date) => {
    try {
      const formattedMonth = format(month, 'yyyy-MM');
      const response = await fetch(`http://localhost:8000/api/v1/summary/categories?month=${formattedMonth}`);
      const data = await response.json();

      // Get all available categories from categories.json
      const allCategories = getAllCategories();

      // Create data for all categories, including those with $0 spending
      const transformedData: CategoryData[] = allCategories.map(category => {
        const amount = data[category.name] || 0;
        return {
          category: category.name,
          amount: Number(amount),
          fill: getNotionColorCSS(category.color)
        };
      }).sort((a, b) => b.amount - a.amount); // Sort by amount descending

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
