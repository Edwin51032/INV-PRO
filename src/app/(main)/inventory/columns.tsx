"use client"

import type { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import type { Product } from "@/lib/types"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { ProductActions } from "@/components/inventory/product-actions"
import { Badge } from "@/components/ui/badge"

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "imageUrl",
    header: "Imagen",
    cell: ({ row }) => {
      const imageUrl = row.getValue("imageUrl") as string
      const imageHint = row.original.imageHint
      return (
        <div className="w-10 h-10 relative rounded-md overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={row.getValue("name")}
              fill
              className="object-cover"
              data-ai-hint={imageHint}
              sizes="40px"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
              N/A
            </div>
          )}
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Categoría" />
    ),
  },
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Precio" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR",
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "cost",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Costo" />
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
    accessorKey: "stockQuantity",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Stock" />
    ),
    cell: ({ row }) => {
      const stock = row.original.stockQuantity;
      const reorderPoint = row.original.reorderPoint;
      return (
        <div className="text-center">
           <Badge variant={stock <= reorderPoint ? "destructive" : "secondary"}>
             {stock}
            </Badge>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ProductActions product={row.original} />,
  },
]
