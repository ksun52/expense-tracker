import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function HomeHeader() {
  return (
    // return a simple header that says "Welcome back, Kevin" as big text and subtext "Here's what's happening with your finances"
    // text left aligned
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-semibold text-left">Welcome back, Kevin</h1>
      <p className="text-lg text-gray-500 text-left">Here's what's happening with your finances</p>
    </div>
  )
}
