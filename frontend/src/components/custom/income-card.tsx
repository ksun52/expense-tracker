import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"

const data = [
  { name: "UM Grader Pay 1", amount: 291.08, date: "February 7, 2025" },
  { name: "UM Grader Pay 2", amount: 291.08, date: "February 21, 2025" },
  { name: "UM Grader Pay 3", amount: 291.08, date: "March 7, 2025" },
  { name: "Michigan Tax Payment", amount: -15, date: "March 17, 2025" },
  { name: "UM Grader Pay 4", amount: 291.08, date: "March 21, 2025" },
  { name: "IRS tax refund", amount: 6472, date: "March 21, 2025" },
  { name: "NY State Tax refund", amount: 3395, date: "March 27, 2025" },
  { name: "UM Grader Pay 5", amount: 291.08, date: "April 4, 2025" },
  { name: "UM Grader Pay 6", amount: 291.08, date: "April 18, 2025" },
  { name: "Car Sale Commission", amount: 800, date: "April 30, 2025" },
  { name: "UM Grader Pay 7", amount: 291.08, date: "May 2, 2025" },
  { name: "UM Grader Pay 8", amount: 291.08, date: "May 16, 2025" },
]

export function IncomeTableCard() {

  const sortedData = [...data].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  const monthlyIncome = sortedData.reduce((acc, item) => {
    const amount = item.amount;
    if (new Date(item.date).getMonth() === new Date().getMonth()) {
      return acc + amount;
    }
    return acc;
  }, 0)
  
  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-baseline">
        <span className="text-2xl text-left font-bold">Income Overview</span>
        <span className="text-sm text-right">${monthlyIncome} this month</span>
      </CardHeader>

      <CardContent>
        <div className="max-h-80 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Name</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="text-left">{item.name}</TableCell>
                  <TableCell className="text-right">
                    {item.amount < 0 ? 
                    ( <span className="text-red-600">- ${Math.abs(item.amount).toFixed(2)}</span> ) : 
                    ( <span className="text-green-600">${Math.abs(item.amount).toFixed(2)}</span> )}
                  </TableCell>
                  <TableCell className="text-right">{item.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
