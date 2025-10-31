'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type MobileNavProps = {
  navItems: {
    href: string;
    icon: LucideIcon;
    label: string;
  }[];
};

export default function MobileNav({ navItems }: MobileNavProps) {
  const pathname = usePathname();
  // Show only first 5 items on mobile nav
  const mobileNavItems = navItems.slice(0, 5);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t bg-background/80 backdrop-blur-sm md:hidden">
      <div className="flex h-16 items-center justify-around">
        {mobileNavItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-col items-center gap-1 rounded-md p-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
              pathname.startsWith(href) && 'text-primary'
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
