import { Payment, columns } from "../components/layout/payments-table/columns"
import DataTable from "../components/layout/payments-table/data-table"
import { useEffect, useState } from "react"
import SyncButton from "@/components/layout/payments-table/sync-button"

async function getData(): Promise<Payment[]> {
  const response = await fetch('http://localhost:8000/api/v1/table')
  const data = await response.json()
  return data.map((payment: any) => ({
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
      <div className="mb-4">
        <SyncButton />
      </div>
      <div className="w-full overflow-x-auto">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}
