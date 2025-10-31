'use client'

import { useState } from "react"
import { useCollection } from "@/hooks/use-firestore"
import type { Sale } from "@/lib/types"
import { columns } from "./columns"
import { DataTable } from "@/components/data-table/data-table"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import SaleForm from "@/components/sales/sale-form"
import SalesLoading from "./loading"

export default function SalesPage() {
  const { data: sales, loading } = useCollection<Sale>('sales', { sortField: 'saleDate', sortDirection: 'desc' });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  if (loading) {
    return <SalesLoading />;
  }

  return (
    <>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Nueva Venta</DialogTitle>
            <DialogDescription>
              Selecciona un producto y la cantidad vendida. El stock se actualizará automáticamente.
            </DialogDescription>
          </DialogHeader>
          <SaleForm onSuccess={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Registro de Ventas</CardTitle>
                <CardDescription>
                  Visualiza y gestiona tu historial de ventas.
                </CardDescription>
              </div>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nueva Venta
              </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={sales} 
            toolbar={{
              filterColumnId: 'productName',
              filterPlaceholder: 'Filtrar por producto...'
            }}
          />
        </CardContent>
      </Card>
    </>
  )
}
