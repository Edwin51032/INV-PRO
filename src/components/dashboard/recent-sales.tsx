'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCollection } from '@/hooks/use-firestore';
import type { Sale } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Skeleton } from '../ui/skeleton';
import { Avatar, AvatarFallback } from '../ui/avatar';

export default function RecentSales() {
  const { data: sales, loading } = useCollection<Sale>('sales', { sortField: 'saleDate', sortDirection: 'desc', dataLimit: 10 });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas Recientes</CardTitle>
        <CardDescription>Las últimas 10 ventas de tu tienda.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading && Array.from({ length: 5 }).map((_, i) => (
             <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-1">
                   <Skeleton className="h-4 w-3/4" />
                   <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-5 w-12" />
             </div>
          ))}
          {!loading && sales.map((sale) => (
            <div key={sale.id} className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{sale.productName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium leading-none">{sale.productName}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(sale.saleDate.toDate(), { addSuffix: true, locale: es })}
                </p>
              </div>
              <div className="font-medium">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(sale.total)}</div>
            </div>
          ))}
           {!loading && sales.length === 0 && (
             <p className="text-sm text-muted-foreground text-center py-4">No hay ventas recientes.</p>
           )}
        </div>
      </CardContent>
    </Card>
  );
}
