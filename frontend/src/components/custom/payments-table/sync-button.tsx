import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function SyncButton() {
const [isSyncing, setIsSyncing] = useState(false)

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      const response = await fetch('http://localhost:8000/api/v1/sync')
      const data = await response.json()
      console.log('Sync completed:', data)
    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  return (
        <Button 
            onClick={handleSync} 
            disabled={isSyncing}
        >
            {isSyncing ? 'Syncing...' : 'Sync with Notion'}
        </Button>
    )
}
