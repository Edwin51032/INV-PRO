"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Sale } from "@/lib/types"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { SaleActions } from "@/components/sales/sale-actions"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export const columns: ColumnDef<Sale>[] = [
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
    accessorKey: "total",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total"))
      const formatted = new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR",
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "saleDate",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fecha de Venta" />
    ),
    cell: ({ row }) => {
        const date = row.getValue("saleDate") as any;
        if (!date?.toDate) return 'Fecha inválida';
        return <span>{format(date.toDate(), "dd/MM/yyyy HH:mm", { locale: es })}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <SaleActions sale={row.original} />,
  },
]
