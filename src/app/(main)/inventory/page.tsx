'use client'

import { useState } from "react"
import { useCollection } from "@/hooks/use-firestore"
import type { Product } from "@/lib/types"
import { columns } from "./columns"
import { DataTable } from "@/components/data-table/data-table"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import ProductForm from "@/components/inventory/product-form"
import InventoryLoading from "./loading"

export default function InventoryPage() {
  const { data: products, loading } = useCollection<Product>('products', { sortField: 'createdAt', sortDirection: 'desc' });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  if (loading) {
    return <InventoryLoading />;
  }
  
  return (
    <>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Añadir Nuevo Producto</DialogTitle>
            <DialogDescription>
              Completa la información para añadir un producto a tu inventario.
            </DialogDescription>
          </DialogHeader>
          <ProductForm onSuccess={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Gestión de Inventario</CardTitle>
                <CardDescription>
                  Aquí podrás ver, añadir, editar y eliminar tus productos.
                </CardDescription>
              </div>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Producto
              </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={products} 
            toolbar={{
              filterColumnId: 'name',
              filterPlaceholder: 'Filtrar por nombre...'
            }}
          />
        </CardContent>
      </Card>
    </>
  )
}
