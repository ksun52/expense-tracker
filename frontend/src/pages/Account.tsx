import { useParams } from "react-router-dom"

export default function AccountPage() {
  const { accountName } = useParams<{ accountName: string }>()

  // accountName will be decoded string from URL like "Apple HYSA"

  return (
    <div>
      {/* Use your existing JSX here */}
      <h1 className="text-2xl font-bold">{accountName}</h1>
    </div>
  )
}
