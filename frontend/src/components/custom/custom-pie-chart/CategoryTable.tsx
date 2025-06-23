import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface CategoryData {
    category: string;
    amount: number;
    fill: string;
}

interface CategoryTableProps {
    chartData: CategoryData[];
}

export function CategoryTable({ chartData }: CategoryTableProps) {
    // Sort data by amount in descending order
    const sortedData = [...chartData].sort((a, b) => b.amount - a.amount);

    return (
        <div className="w-full">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedData.map((item) => (
                        <TableRow key={item.category}>
                            <TableCell className="flex items-center gap-2">
                                <div
                                    className="h-3 w-3 rounded-full"
                                    style={{ backgroundColor: item.fill }}
                                />
                                {item.category}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                                ${item.amount.toFixed(2)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
} 