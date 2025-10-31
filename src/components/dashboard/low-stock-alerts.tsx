'use client';

import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCollection } from '@/hooks/use-firestore';
import type { Product } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

export default function LowStockAlerts() {
  const { data: products, loading } = useCollection<Product>('products');

  const lowStockProducts = products.filter(
    (product) => product.stockQuantity <= product.reorderPoint
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Alertas de Stock Bajo
        </CardTitle>
        <CardDescription>Productos que necesitan ser reabastecidos.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {loading && Array.from({length: 2}).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
          {!loading && lowStockProducts.length > 0 ? (
            lowStockProducts.map((product) => (
              <div key={product.id} className="flex justify-between items-center text-sm">
                <p className="font-medium">{product.name}</p>
                <p className="text-destructive font-bold">{product.stockQuantity} en stock</p>
              </div>
            ))
          ) : !loading ? (
            <p className="text-sm text-muted-foreground text-center py-4">¡Todo el stock está en orden!</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
