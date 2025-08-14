import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { fetchIncomeData, IncomeData } from "@/services/incomeService"

export function IncomeTableCard() {
  const [incomeData, setIncomeData] = useState<IncomeData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadIncomeData = async () => {
      try {
        setLoading(true)
        const data = await fetchIncomeData()
        setIncomeData(data)
        setError(null)
      } catch (err) {
        setError('Failed to load income data')
        console.error('Error loading income data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadIncomeData()
  }, [])

  const monthlyIncome = incomeData.reduce((acc, item) => {
    const amount = item.amount;
    if (new Date(item.date_received).getMonth() === new Date().getMonth()) {
      return acc + amount;
    }
    return acc;
  }, 0)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <span className="text-2xl text-left font-bold">Income Overview</span>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading income data...</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <span className="text-2xl text-left font-bold">Income Overview</span>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">{error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-baseline">
        <span className="text-2xl text-left font-bold">Income Overview</span>
        <span className="text-sm text-right">${monthlyIncome.toFixed(2)} this month</span>
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
              {incomeData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-left">{item.name}</TableCell>
                  <TableCell className="text-right">
                    {item.amount < 0 ?
                      (<span className="text-red-600">- ${Math.abs(item.amount).toFixed(2)}</span>) :
                      (<span className="text-green-600">${Math.abs(item.amount).toFixed(2)}</span>)}
                  </TableCell>
                  <TableCell className="text-right">{formatDate(item.date_received)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
