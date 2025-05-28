// export default function Home() {
//   return (
//     <div className="space-y-6">
//       <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         {/* Add your dashboard cards here */}
//         <div className="rounded-lg border p-4">
//           <h3 className="font-semibold">Total Expenses</h3>
//           <p className="text-2xl font-bold">$0.00</p>
//         </div>
//       </div>
//     </div>
//   );
// } 

// import { AppSidebar } from "@/components/layout/app-sidebar"
// import { ChartAreaInteractive } from "@/components/layout/chart-area-interactive"
// import { DataTable } from "@/components/layout/data-table"
// import { SectionCards } from "@/components/layout/section-cards"
// import { SiteHeader } from "@/components/layout/site-header"
// import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

// import data from "./data.json"

// export default function Home() {
//   return (
//     <SidebarProvider>
//       <AppSidebar variant="sidebar" />
//       <SidebarInset>
//         <SiteHeader />
//         <div className="flex flex-1 flex-col">
//           <div className="@container/main flex flex-1 flex-col gap-2">
//             <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
//               <SectionCards />
//               <div className="px-4 lg:px-6">
//                 <ChartAreaInteractive />
//               </div>
//               <DataTable data={data} />
//             </div>
//           </div>
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   )
// }

export default function Home() {
  return (
    <div>
      {/* <h1>Home</h1> */}
    </div>
  )
}
