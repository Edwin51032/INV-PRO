"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { productSchema, type ProductFormValues } from "@/lib/schemas"
import { useToast } from "@/hooks/use-toast"
import { addProduct, updateProduct } from "@/lib/firebase/actions"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { Product } from "@/lib/types"
import { useState } from "react"
import placeholderImages from "@/lib/placeholder-images.json"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/command"
import { cn } from "@/lib/utils"

interface ProductFormProps {
  product?: Product
  onSuccess?: () => void
}

export default function ProductForm({ product, onSuccess }: ProductFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      name: product.name,
      category: product.category,
      sku: product.sku || "",
      price: product.price,
      cost: product.cost,
      stockQuantity: product.stockQuantity,
      reorderPoint: product.reorderPoint,
      imageUrl: product.imageUrl,
      imageHint: product.imageHint
    } : {
      name: "",
      category: "",
      sku: "",
      price: 0,
      cost: 0,
      stockQuantity: 0,
      reorderPoint: 0,
      imageUrl: "",
      imageHint: ""
    },
  })

  const onSubmit = async (data: ProductFormValues) => {
    setIsLoading(true)

    try {
      if (product) {
        await updateProduct(product.id, data)
        toast({
          title: "Producto actualizado",
          description: "El producto ha sido actualizado exitosamente.",
        })
      } else {
        await addProduct(data)
        toast({
          title: "Producto añadido",
          description: "El nuevo producto ha sido añadido a tu inventario.",
        })
        form.reset()
      }
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Error",
        description: `Ocurrió un error: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Producto</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Camiseta de algodón" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Ropa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Imagen del Producto</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? placeholderImages.placeholderImages.find(
                              (image) => image.imageUrl === field.value
                            )?.description
                          : "Seleccionar imagen"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Buscar imagen..." />
                      <CommandEmpty>No se encontró ninguna imagen.</CommandEmpty>
                      <CommandGroup>
                        {placeholderImages.placeholderImages.map((image) => (
                          <CommandItem
                            value={image.description}
                            key={image.id}
                            onSelect={() => {
                              form.setValue("imageUrl", image.imageUrl)
                              form.setValue("imageHint", image.imageHint)
                              setOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                image.imageUrl === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {image.description}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio de Venta</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Costo de Compra</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="stockQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad en Stock</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reorderPoint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Punto de Reorden</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SKU (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Ej: CAM-ALG-01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Guardando...' : product ? 'Guardar Cambios' : 'Añadir Producto'}
        </Button>
      </form>
    </Form>
  )
}
