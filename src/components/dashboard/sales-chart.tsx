'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { useCollection } from '@/hooks/use-firestore';
import { Sale } from '@/lib/types';
import { subDays, format, eachDayOfInterval, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Skeleton } from '../ui/skeleton';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

const processSalesData = (sales: Sale[]) => {
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date(),
  });

  const dailySales = new Map<string, number>();
  last7Days.forEach(day => {
    dailySales.set(format(day, 'yyyy-MM-dd'), 0);
  });

  sales.forEach(sale => {
    const saleDate = startOfDay(sale.saleDate.toDate());
    const dateString = format(saleDate, 'yyyy-MM-dd');
    if (dailySales.has(dateString)) {
      dailySales.set(dateString, (dailySales.get(dateString) ?? 0) + sale.total);
    }
  });

  return Array.from(dailySales.entries()).map(([date, total]) => ({
    name: format(new Date(date), 'EEE', { locale: es }),
    total,
  })).sort((a,b) => new Date(a.name).getTime() - new Date(b.name).getTime());
};

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {label}
            </span>
            <span className="font-bold text-muted-foreground">
              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(payload[0].value as number)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};


export default function SalesChart() {
  const { data: sales, loading } = useCollection<Sale>('sales', {
    sortField: 'saleDate',
    sortDirection: 'desc'
  });

  const chartData = processSalesData(sales);

  if(loading){
      return (
          <Card>
              <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                  <Skeleton className="h-[300px] w-full" />
              </CardContent>
          </Card>
      )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas Últimos 7 Días</CardTitle>
        <CardDescription>Un resumen de las ventas de tu negocio.</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] w-full p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}€`} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent) / 0.1)' }}/>
            <Line type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--primary))" }} activeDot={{ r: 8, style: { stroke: 'hsl(var(--primary))', strokeWidth: 2, fill: 'hsl(var(--background))' } }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
