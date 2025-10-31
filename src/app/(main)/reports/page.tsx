'use client'

import { useState, useMemo } from "react"
import { DateRange } from "react-day-picker"
import { addDays, format, startOfDay } from "date-fns"
import { es } from "date-fns/locale"
import { Download } from "lucide-react"
import { useCollection } from "@/hooks/use-firestore"
import type { Product, Sale, Purchase } from "@/lib/types"
import { exportToCsv } from "@/lib/utils"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import ReportsLoading from "./loading"

type ReportType = 'sales' | 'purchases' | 'inventory' | 'top-selling' | 'profitability'

export default function ReportsPage() {
  const { data: products, loading: productsLoading } = useCollection<Product>('products');
  const { data: sales, loading: salesLoading } = useCollection<Sale>('sales');
  const { data: purchases, loading: purchasesLoading } = useCollection<Purchase>('purchases');

  const [reportType, setReportType] = useState<ReportType>('sales');
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const loading = productsLoading || salesLoading || purchasesLoading;

  const filteredData = useMemo(() => {
    if (loading) return [];
    const from = date?.from ? startOfDay(date.from) : null;
    const to = date?.to ? startOfDay(addDays(date.to, 1)) : null; // include the whole 'to' day

    const filterByDate = (items: (Sale | Purchase)[]) => {
      return items.filter(item => {
        const itemDate = item.saleDate?.toDate() || item.purchaseDate?.toDate();
        if (!itemDate) return false;
        if (from && itemDate < from) return false;
        if (to && itemDate >= to) return false;
        return true;
      });
    };

    switch (reportType) {
      case 'sales':
        return filterByDate(sales);
      case 'purchases':
        return filterByDate(purchases);
      case 'inventory':
        return products;
      case 'top-selling': {
        const productSales = new Map<string, { name: string, quantity: number }>();
        filterByDate(sales).forEach(sale => {
          const existing = productSales.get(sale.productId);
          if (existing) {
            existing.quantity += sale.quantity;
          } else {
            productSales.set(sale.productId, { name: sale.productName, quantity: sale.quantity });
          }
        });
        return Array.from(productSales.values()).sort((a, b) => b.quantity - a.quantity).slice(0, 10);
      }
      case 'profitability': {
        const filteredSales = filterByDate(sales);
        return products.map(product => {
          const productSales = filteredSales.filter(s => s.productId === product.id);
          const totalRevenue = productSales.reduce((sum, s) => sum + s.total, 0);
          const totalUnitsSold = productSales.reduce((sum, s) => sum + s.quantity, 0);
          const totalCost = totalUnitsSold * product.cost;
          const profit = totalRevenue - totalCost;
          return {
            name: product.name,
            unitsSold: totalUnitsSold,
            totalRevenue,
            totalCost,
            profit,
          };
        });
      }
      default:
        return [];
    }
  }, [reportType, date, products, sales, purchases, loading]);

  const handleExport = () => {
    if (filteredData.length > 0) {
      exportToCsv(`${reportType}_report_${format(new Date(), 'yyyy-MM-dd')}.csv`, filteredData);
    }
  };

  const renderTable = () => {
    if (filteredData.length === 0) {
      return <p className="text-muted-foreground text-center py-8">No hay datos para mostrar con los filtros seleccionados.</p>;
    }
    const headers = Object.keys(filteredData[0]);
    return (
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map(header => <TableHead key={header} className="capitalize">{header.replace(/([A-Z])/g, ' $1')}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((row, index) => (
            <TableRow key={index}>
              {headers.map(header => (
                <TableCell key={header}>
                  {typeof row[header] === 'number'
                    ? new Intl.NumberFormat('es-ES', { style: ['totalRevenue', 'totalCost', 'profit'].includes(header) ? 'currency' : 'decimal', currency: 'EUR' }).format(row[header])
                    : String(row[header])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };
  
  if (loading) {
    return <ReportsLoading />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reportes y Análisis</CardTitle>
        <CardDescription>
          Genera reportes detallados para entender el rendimiento de tu negocio.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={reportType} onValueChange={(v) => setReportType(v as ReportType)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Tipo de Reporte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">Ventas</SelectItem>
              <SelectItem value="purchases">Compras</SelectItem>
              <SelectItem value="inventory">Inventario</SelectItem>
              <SelectItem value="top-selling">Productos más vendidos</SelectItem>
              <SelectItem value="profitability">Rentabilidad por Producto</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-full sm:w-auto justify-start text-left font-normal"
              >
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y", { locale: es })} -{" "}
                      {format(date.to, "LLL dd, y", { locale: es })}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y", { locale: es })
                  )
                ) : (
                  <span>Selecciona un rango</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                locale={es}
              />
            </PopoverContent>
          </Popover>

          <Button onClick={handleExport} disabled={filteredData.length === 0} className="sm:ml-auto">
            <Download className="mr-2 h-4 w-4" />
            Exportar a CSV
          </Button>
        </div>

        <div className="rounded-md border">
          {renderTable()}
        </div>
      </CardContent>
    </Card>
  )
}
