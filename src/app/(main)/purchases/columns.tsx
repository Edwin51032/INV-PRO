"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Purchase } from "@/lib/types"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { PurchaseActions } from "@/components/purchases/purchase-actions"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export const columns: ColumnDef<Purchase>[] = [
  {
    accessorKey: "productName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Producto" />
    ),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cantidad" />
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("quantity")}</div>,
  },
  {
    accessorKey: "cost",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Costo Unitario" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("cost"))
      const formatted = new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR",
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "totalCost",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Costo Total" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalCost"))
      const formatted = new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR",
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "purchaseDate",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fecha de Compra" />
    ),
    cell: ({ row }) => {
        const date = row.getValue("purchaseDate") as any;
        if (!date?.toDate) return 'Fecha inválida';
        return <span>{format(date.toDate(), "dd/MM/yyyy HH:mm", { locale: es })}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <PurchaseActions purchase={row.original} />,
  },
]
