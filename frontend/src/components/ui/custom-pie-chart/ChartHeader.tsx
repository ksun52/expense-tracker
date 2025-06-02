import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import {
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

interface ChartHeaderProps {
    title: string;
    selectedMonth: Date;
    onPreviousMonth: () => void;
    onNextMonth: () => void;
}

export function ChartHeader({ 
    title, 
    selectedMonth, 
    onPreviousMonth, 
    onNextMonth 
}: ChartHeaderProps) {
    return (
        <CardHeader className="items-center pb-2">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{format(selectedMonth, 'MMMM yyyy')}</CardDescription>
            <div className="grid grid-cols-3 items-center gap-4 mt-4">
                <Button variant="outline" onClick={onPreviousMonth} className="w-32 justify-self-start">
                    Previous Month
                </Button>
                <span className="text-lg font-medium text-center">
                    {format(selectedMonth, 'MMMM yyyy')}
                </span>
                <Button variant="outline" onClick={onNextMonth} className="w-32 justify-self-end">
                    Next Month
                </Button>
            </div>
        </CardHeader>
    );
} 