import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { fetchTravelData, TravelData } from "@/services/travelService"

export function TravelTableCard() {
  const [travelData, setTravelData] = useState<TravelData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTravelData = async () => {
      try {
        setLoading(true)
        const data = await fetchTravelData()
        setTravelData(data)
        setError(null)
      } catch (err) {
        setError('Failed to load travel data')
        console.error('Error loading travel data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadTravelData()
  }, [])

  const average = travelData.length > 0
    ? travelData.reduce((acc, item) => acc + item.total, 0) / travelData.length
    : 0

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-left font-bold">Travel Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading travel data...</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-left font-bold">Travel Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">{error}</div>
        </CardContent>
      </Card>
    )
  }

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
              {travelData.map((item, index) => {
                const percent_diff = average > 0 ? ((item.total - average) / average) * 100 : 0

                return (
                  <TableRow key={index}>
                    <TableCell className="text-left">{item.sub_category}</TableCell>
                    <TableCell className="text-right">
                      ${Math.abs(item.total).toFixed(2)}
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
