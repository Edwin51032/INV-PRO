'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import ProductForm from '@/components/inventory/product-form';
import SaleForm from '@/components/sales/sale-form';
import PurchaseForm from '@/components/purchases/purchase-form';

type DialogType = 'product' | 'sale' | 'purchase' | null;

export default function QuickActions() {
  const [openDialog, setOpenDialog] = useState<DialogType>(null);

  const handleClose = () => setOpenDialog(null);

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => setOpenDialog('product')}>
        <Plus className="mr-2 h-4 w-4" />
        Añadir Producto
      </Button>
      <Button onClick={() => setOpenDialog('sale')}>
        <Plus className="mr-2 h-4 w-4" />
        Nueva Venta
      </Button>
      <Button onClick={() => setOpenDialog('purchase')}>
        <Plus className="mr-2 h-4 w-4" />
        Nueva Compra
      </Button>

      {/* Add Product Dialog */}
      <Dialog open={openDialog === 'product'} onOpenChange={(isOpen) => !isOpen && handleClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Añadir Nuevo Producto</DialogTitle>
            <DialogDescription>
              Completa la información para añadir un producto a tu inventario.
            </DialogDescription>
          </DialogHeader>
          <ProductForm onSuccess={handleClose} />
        </DialogContent>
      </Dialog>

      {/* New Sale Dialog */}
      <Dialog open={openDialog === 'sale'} onOpenChange={(isOpen) => !isOpen && handleClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Nueva Venta</DialogTitle>
            <DialogDescription>
              Selecciona un producto y la cantidad vendida.
            </DialogDescription>
          </DialogHeader>
          <SaleForm onSuccess={handleClose} />
        </DialogContent>
      </Dialog>

      {/* New Purchase Dialog */}
      <Dialog open={openDialog === 'purchase'} onOpenChange={(isOpen) => !isOpen && handleClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Nueva Compra</DialogTitle>
            <DialogDescription>
              Registra una nueva entrada de productos a tu inventario.
            </DialogDescription>
          </DialogHeader>
          <PurchaseForm onSuccess={handleClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
