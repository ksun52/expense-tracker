import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"

const data = [
  { name: "Trip to Hawaii", amount: 2000 },
  { name: "Trip to Hawaii", amount: 3420 },
  { name: "Trip to Hawaii", amount: 970 },
  { name: "Trip to Hawaii", amount: 1280 },
  { name: "Trip to Hawaii", amount: 1000 },
  { name: "Trip to Hawaii", amount: 800 },
]

export function TravelTableCard() {
  const average = data.reduce((acc, item) => acc + item.amount, 0) / data.length

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col">
        <CardTitle className="text-2xl text-left font-bold">Travel Overview</CardTitle>
        <CardDescription className="text-sm text-right">Here's what you spent on recent trips</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="max-h-80 overflow-y-auto text-left">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Trip</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">% vs Average</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => {
                const percent_diff = ((item.amount - average) / average) * 100

                return (
                  <TableRow key={index}>
                    <TableCell className="text-left">{item.name}</TableCell>
                    <TableCell className="text-right">
                      ${Math.abs(item.amount).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {percent_diff > 0 ? (
                        <span className="text-red-600">+{percent_diff.toFixed(2)}%</span>
                      ) : (
                        <span className="text-green-600">{percent_diff.toFixed(2)}%</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          <span className="text-sm text-left text-muted-foreground">
            Average Spend: ${average.toFixed(2)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
