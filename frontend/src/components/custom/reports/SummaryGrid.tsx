import React from 'react';

export interface Summary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  savingsRate: number;
}

interface SummaryGridProps {
  summary: Summary;
}

const cardClass =
  'bg-white rounded-lg shadow p-4 flex flex-col items-start justify-center';
const labelClass = 'text-sm text-gray-500 mb-1';
const valueClass = 'text-2xl font-bold';

const SummaryGrid: React.FC<SummaryGridProps> = ({ summary }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    <div className={cardClass}>
      <span className={labelClass}>Total Income</span>
      <span className={`${valueClass} text-green-600`}>${summary.totalIncome.toLocaleString()}</span>
    </div>
    <div className={cardClass}>
      <span className={labelClass}>Total Expenses</span>
      <span className={`${valueClass} text-red-600`}>${summary.totalExpenses.toLocaleString()}</span>
    </div>
    <div className={cardClass}>
      <span className={labelClass}>Total Net Income</span>
      <span className={valueClass}>${summary.netIncome.toLocaleString()}</span>
    </div>
    <div className={cardClass}>
      <span className={labelClass}>Savings Rate</span>
      <span className={valueClass}>{summary.savingsRate}%</span>
    </div>
  </div>
);

export default SummaryGrid; 