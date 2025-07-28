import SyncButton from "@/components/custom/payments-table/sync-button"

export function TransactionsHeader() {
  return (
    <div className="flex flex-row justify-between my-2">
      <h1 className="text-3xl font-semibold text-left">Transactions</h1>
      <SyncButton />
    </div>
  )
}
