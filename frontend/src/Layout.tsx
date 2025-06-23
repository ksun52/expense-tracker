import type { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/custom/app-sidebar';
import { SiteHeader } from './components/site-header';
interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 56)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar/>
      <main className="w-full">
        {/* <SidebarTrigger/>    */}
        <SiteHeader/>
        {children}
      </main>
    </SidebarProvider>

    // <div>
    //   <SidebarDesktop sidebarItems = {{
    //     links: [
    //       { label: 'Home', href: '/', icon: Home},
    //       { label: 'Notifications', href: '/item/notifications', icon: Bell},
    //       { label: 'Home', href: '/', icon: Home},
    //       // { label: 'About', href: '/about' }
    //     ]
    //   }}/>
    //   <main className='ml-[200px]'>
    //     {children}
    //   </main>
    // </div>
  );
} 