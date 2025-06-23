import type { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/custom/app-sidebar';
import { SidebarDesktop } from '@/components/custom/youtube-sidebar/sidebar-desktop';
import { Bell, Home } from 'lucide-react';
interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar/>
      <main className="p-4">
        <SidebarTrigger/>   
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