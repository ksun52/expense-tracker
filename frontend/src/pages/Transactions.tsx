import { TransactionsHeader } from "@/components/headers/transactions-header"
import { Payment, columns } from "../components/custom/payments-table/columns"
import DataTable from "../components/custom/payments-table/data-table"
import { useEffect, useState } from "react"


async function getData(): Promise<Payment[]> {
  const response = await fetch('http://localhost:8000/api/v1/table')
  const data = await response.json()
  return data.map((payment: any) => ({
    ...payment,
    date: new Date(payment.date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  })) as Payment[]
}

export default function TableView() {
  const [data, setData] = useState<Payment[]>([])

  useEffect(() => {
    getData().then(setData)
  }, [])

  return (
    <>
      <TransactionsHeader />
      <div className="w-full overflow-x-auto">
        <DataTable columns={columns} data={data} />
      </div>
    </>
  )
}
