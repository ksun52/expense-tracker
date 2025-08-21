import IncomeCompare, { CategoryKey, Entry, IncomeCompareDemo } from "../components/custom/income-flow";
import { useState, useEffect } from "react";


export default function CashFlow() {
  const [income, setIncome] = useState(0)
  const [entries, setEntries] = useState<Entry[]>([])

  useEffect(() => {
    // get current month and year
    const month = new Date().getMonth() + 1
    const year = new Date().getFullYear()

    const fetchIncome = async () => {
      const response = await fetch(`http://localhost:8000/api/v1/income/by-month?month=${year}-${month}`)
      const data = await response.json()
      setIncome(data.total)
    }

    const fetchEntries = async () => {
      const response = await fetch(`http://localhost:8000/api/v1/summary/categories?month=${year}-${month}`)
      const data: Record<string, number> = await response.json()

      // map {category: {total} into entry format
      const entries: Entry[] = Object.entries(data).map(([category, total]) => ({
        name: category as CategoryKey,
        amount: Number(total.toFixed(2))
      }))

      setEntries(entries)
    }

    fetchIncome()
    fetchEntries()
  }, [])

  return (

    < IncomeCompare income={income} entries={entries} height={320} />
  );
}
