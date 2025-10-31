'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { usePathname } from 'next/navigation';
import { Boxes } from 'lucide-react';

const getPageTitle = (path: string) => {
  if (path.startsWith('/dashboard')) return 'Dashboard';
  if (path.startsWith('/inventory')) return 'Inventario';
  if (path.startsWith('/sales')) return 'Ventas';
  if (path.startsWith('/purchases')) return 'Compras';
  if (path.startsWith('/reports')) return 'Reportes';
  if (path.startsWith('/documents')) return 'Documentos';
  if (path.startsWith('/settings')) return 'Ajustes';
  return 'InvControl Pro';
};

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
       <div className="flex items-center gap-2">
         <div className="md:hidden">
            <SidebarTrigger />
         </div>
         <div className="hidden md:block">
            <h1 className="font-headline text-xl font-semibold">{getPageTitle(pathname)}</h1>
         </div>
         <div className="md:hidden flex items-center gap-2">
            <Boxes className="h-6 w-6 text-primary" />
            <span className="font-headline text-lg font-bold">InvControl Pro</span>
         </div>
       </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
