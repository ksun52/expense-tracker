import React from 'react';
import { Button, Typography } from '@mui/material';
import { format } from 'date-fns';
import { DateRange } from '../../../pages/ReportsPage';

interface DateRangePickerProps {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ dateRange }) => {
  return (
    <>
      <Typography variant="subtitle1" mr={2}>
        {format(dateRange.start, 'MMM d, yyyy')} - {format(dateRange.end, 'MMM d, yyyy')}
      </Typography>
      <Button variant="outlined" onClick={() => alert('Date range picker coming soon!')}>
        Change Date Range
      </Button>
    </>
  );
};

export default DateRangePicker; 