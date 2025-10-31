'use client';

import { Boxes, ShoppingCart, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection } from '@/hooks/use-firestore';
import type { Product, Sale, Purchase } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

const StatCard = ({ title, value, icon: Icon, isLoading }: { title: string; value: string | number; icon: React.ElementType; isLoading: boolean }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        <div className="text-2xl font-bold">{value}</div>
      )}
    </CardContent>
  </Card>
);

export default function StatCards() {
  const { data: products, loading: productsLoading } = useCollection<Product>('products');
  const { data: sales, loading: salesLoading } = useCollection<Sale>('sales');
  const { data: purchases, loading: purchasesLoading } = useCollection<Purchase>('purchases');

  const totalSalesValue = sales.reduce((acc, sale) => acc + sale.total, 0);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard 
        title="Productos Totales" 
        value={products.length} 
        icon={Boxes}
        isLoading={productsLoading}
      />
      <StatCard 
        title="Ventas Totales" 
        value={new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totalSalesValue)} 
        icon={ShoppingCart}
        isLoading={salesLoading}
      />
      <StatCard 
        title="Compras Totales" 
        value={purchases.length} 
        icon={Package}
        isLoading={purchasesLoading}
      />
    </div>
  );
}
