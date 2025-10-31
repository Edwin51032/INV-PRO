'use client'

import { useState } from "react"
import { useCollection } from "@/hooks/use-firestore"
import type { Purchase } from "@/lib/types"
import { columns } from "./columns"
import { DataTable } from "@/components/data-table/data-table"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import PurchaseForm from "@/components/purchases/purchase-form"
import PurchasesLoading from "./loading"

export default function PurchasesPage() {
  const { data: purchases, loading } = useCollection<Purchase>('purchases', { sortField: 'purchaseDate', sortDirection: 'desc' });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  if (loading) {
    return <PurchasesLoading />;
  }

  return (
    <>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Nueva Compra</DialogTitle>
            <DialogDescription>
              Registra una compra a proveedor. El stock se actualizará automáticamente.
            </DialogDescription>
          </DialogHeader>
          <PurchaseForm onSuccess={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Registro de Compras</CardTitle>
                <CardDescription>
                  Visualiza y gestiona tu historial de compras a proveedores.
                </CardDescription>
              </div>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nueva Compra
              </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={purchases} 
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
