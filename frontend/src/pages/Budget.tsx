"use client"

import { useEffect, useState } from "react"
import categories from "@/data/categories.json"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { format, subMonths } from 'date-fns';
import { getAllCategories } from "@/utils/categoryUtils"

type Category = {
  name: string
  color: string
  bg: string
  text: string
}

type BudgetData = {
  budget: number
  spent: number
  prevMonth: number
}


// Initialize budgets with all categories from categories.json with 0 as default values

const initialBudgets: Record<string, BudgetData> = getAllCategories().reduce(
  (acc, cat) => {
    acc[cat.name] = { budget: 0, spent: 0, prevMonth: 0 }
    return acc
  },
  {} as Record<string, BudgetData>
)

// Tester dummy data
// const initialBudgets: Record<string, BudgetData> = {
//   misc: { budget: 150, spent: 40, prevMonth: 120 },
//   "going out": { budget: 200, spent: 130, prevMonth: 180 },
//   groceries: { budget: 400, spent: 280, prevMonth: 390 },
//   "restaurants/coffee": { budget: 250, spent: 180, prevMonth: 220 },
//   "clothes/care": { budget: 150, spent: 50, prevMonth: 90 },
//   entertainment: { budget: 120, spent: 95, prevMonth: 140 },
//   utilities: { budget: 300, spent: 290, prevMonth: 310 },
//   transportation: { budget: 100, spent: 60, prevMonth: 80 },
//   subscriptions: { budget: 90, spent: 85, prevMonth: 85 },
// }

export default function BudgetPage() {
  const [budgets, setBudgets] = useState(initialBudgets)

  const fetchCategoryData = async (month: Date) => {
    const formattedMonth = format(month, 'yyyy-MM')
    const response = await fetch(`http://localhost:8000/api/v1/summary/categories?month=${formattedMonth}`)
    return await response.json()
  }

  const fetchBudgetData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/budget/')
      const budgetData = await response.json()

      // Convert array to object keyed by category
      const budgetMap: Record<string, number> = {}
      budgetData.forEach((item: any) => {
        budgetMap[item.category] = item.budget_amount
      })

      return budgetMap
    } catch (error) {
      console.error('Error fetching budget data:', error)
      return {}
    }
  }

  const updateBudgetAmount = async (category: string, amount: number) => {
    try {
      // replace / in category name with %2F
      const response = await fetch(`http://localhost:8000/api/v1/budget/category?category=${category.replace('/', '%2F')}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ budget_amount: amount }),
      })

      if (!response.ok) {
        // If budget doesn't exist, create it
        if (response.status === 404) {
          await fetch('http://localhost:8000/api/v1/budget/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ category, budget_amount: amount }),
          })
        } else {
          throw new Error('Failed to update budget')
        }
      }
    } catch (error) {
      console.error('Error updating budget:', error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      const now = new Date()
      const prev = subMonths(now, 1)

      const [thisMonthData, prevMonthData, budgetData] = await Promise.all([
        fetchCategoryData(now),
        fetchCategoryData(prev),
        fetchBudgetData(),
      ])

      // Shape assumption: { "groceries": 280, "misc": 40, ... }
      setBudgets((prevBudgets) => {
        const updated = { ...prevBudgets }

        // update budget amounts from API
        for (const [category, amount] of Object.entries(budgetData)) {
          if (updated[category]) {
            updated[category] = {
              ...updated[category],
              budget: amount as number,
            }
          }
        }

        // update current month spent
        for (const [category, spent] of Object.entries(thisMonthData)) {
          if (updated[category]) {
            updated[category] = {
              ...updated[category],
              spent: spent as number,
            }
          }
        }

        // update previous month spent
        for (const [category, spent] of Object.entries(prevMonthData)) {
          if (updated[category]) {
            updated[category] = {
              ...updated[category],
              prevMonth: spent as number,
            }
          }
        }

        return updated
      })
    }

    loadData()
  }, [])

  const handleBudgetChange = async (category: string, newBudget: number) => {
    // Update local state immediately for responsiveness
    setBudgets((prev) => ({
      ...prev,
      [category]: { ...prev[category], budget: newBudget },
    }))

    // Save to API
    await updateBudgetAmount(category, newBudget)
  }

  // Compute total spent to show in footer
  const totalSpent = Object.values(budgets).reduce(
    (sum, data) => sum + data.spent,
    0
  )

  return (
    <Table>
      <TableCaption>Your monthly category budgets.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Budget</TableHead>
          <TableHead>Spent</TableHead>
          <TableHead>Remaining</TableHead>
          <TableHead>Predicted Spend</TableHead>
          <TableHead>Previous Month</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((cat: Category) => {
          const data = budgets[cat.name]
          const remaining = data.budget - data.spent
          const remainingPercentage = data.budget > 0 ? (remaining / data.budget) * 100 : 0
          // take the current spend and extrapolate it to the end of the month
          const now = new Date()
          const predictedSpend = data.spent * (new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() / now.getDate())
          const predictedRemaining = data.budget - predictedSpend
          const predictedRemainingPercentage = data.budget > 0 ? (predictedRemaining / data.budget) * 100 : 0

          const prevMonthRemainingPercentage = data.budget > 0 ? ((data.budget - data.prevMonth) / data.budget) * 100 : 0

          return (
            <TableRow key={cat.name}>
              {/* Category name + color dot */}
              <TableCell className="font-medium flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full ${cat.bg} border`} />
                <span className={cat.text}>{cat.name}</span>
              </TableCell>

              {/* Editable budget */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={data.budget}
                    onChange={(e) =>
                      handleBudgetChange(cat.name, Number(e.target.value))
                    }
                    className="w-24"
                  />
                </div>
              </TableCell>

              {/* Spent */}
              <TableCell className="text-left">${data.spent.toFixed(2)}</TableCell>

              {/* Remaining */}
              <TableCell
                className={
                  remaining < 0 ? "text-red-600 font-semibold text-left" : "text-green-700 text-left"
                }
              >
                ${remaining.toFixed(2)} ({remainingPercentage.toFixed(2)}%)
              </TableCell>

              {/* Predicted spend */}
              <TableCell
                className={
                  predictedSpend > data.budget ? "text-red-600 font-semibold text-left" : "text-green-700 text-left"
                }
              >
                ${predictedSpend.toFixed(2)} ({predictedRemainingPercentage.toFixed(2)}%)
              </TableCell>

              {/* Previous month */}
              <TableCell
                className={
                  data.prevMonth > data.budget ? "text-red-400 text-left" : "text-green-400 text-left"
                }
              >
                ${data.prevMonth.toFixed(2)} ({prevMonthRemainingPercentage.toFixed(2)}%)
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total Spent</TableCell>
          <TableCell colSpan={3} className="text-left font-medium">
            ${totalSpent}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
