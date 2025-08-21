import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import SummaryGrid from '../components/custom/reports/SummaryGrid';
import DateRangePicker from '../components/custom/reports/DateRangePicker';
import SankeyChart from '../components/custom/reports/SankeyChart';


export interface DateRange {
  start: Date;
  end: Date;
}

const dummySummary = {
  totalIncome: 4200,
  totalExpenses: 3719.46,
  netIncome: 480.54,
  savingsRate: 11.4,
};

const dummySankeyData = {
  nodes: [
    { name: 'Paychecks' },
    { name: 'Income' },
    { name: 'Savings' },
    { name: 'Housing' },
    { name: 'Mortgage' },
    { name: 'Home Improvement' },
    { name: 'Financial' },
    { name: 'Loan Repayment' },
    { name: 'Insurance' },
    { name: 'Bills & Utilities' },
    { name: 'Cash & ATM' },
    { name: 'Garbage' },
    { name: 'Phone' },
    { name: 'Food & Dining' },
    { name: 'Travel & Lifestyle' },
  ],
  links: [
    { source: 0, target: 1, value: 4200 },
    { source: 1, target: 2, value: 480.54 },
    { source: 1, target: 3, value: 1593 },
    { source: 3, target: 4, value: 1385 },
    { source: 3, target: 5, value: 208 },
    { source: 1, target: 6, value: 741.68 },
    { source: 6, target: 7, value: 500.23 },
    { source: 6, target: 8, value: 201.45 },
    { source: 1, target: 9, value: 683.47 },
    { source: 9, target: 10, value: 40 },
    { source: 9, target: 11, value: 320.47 },
    { source: 9, target: 12, value: 140 },
    { source: 1, target: 13, value: 232.35 },
    { source: 1, target: 14, value: 188.42 },
  ],
};

const ReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(2024, 11, 1),
    end: new Date(2024, 11, 31),
  });

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>
      <SummaryGrid summary={dummySummary} />
      <Box display="flex" alignItems="center" mb={2}>
        <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
      </Box>
      <SankeyChart data={dummySankeyData} />
    </Box>
  );
};

export default ReportsPage; 