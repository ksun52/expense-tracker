import { Payment, columns } from "../components/layout/payments-table/columns"
import DataTable from "../components/layout/payments-table/data-table"
import { useEffect, useState } from "react"
import paymentData from "../data/payment_data.json"

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return paymentData.map(payment => ({
    ...payment,
    date: new Date(payment.date)
  })) as Payment[]
}

export default function TableView() {
  const [data, setData] = useState<Payment[]>([])

  useEffect(() => {
    getData().then(setData)
  }, [])

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
