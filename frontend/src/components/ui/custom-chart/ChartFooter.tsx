import { format } from 'date-fns';
import { CardFooter } from "@/components/ui/card";

interface ChartFooterProps {
    totalAmount: number;
    selectedMonth: Date;
}

export function ChartFooter({ totalAmount, selectedMonth }: ChartFooterProps) {
    return (
        <CardFooter className="flex-col gap-2 text-sm pt-2">
            <div className="flex items-center gap-2 leading-none font-medium">
                Total Spending: ${totalAmount.toFixed(2)}
            </div>
            <div className="text-muted-foreground leading-none">
                Showing spending breakdown for {format(selectedMonth, 'MMMM yyyy')}
            </div>
        </CardFooter>
    );
} 