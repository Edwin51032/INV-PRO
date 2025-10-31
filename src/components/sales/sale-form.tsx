"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { saleSchema, type SaleFormValues } from "@/lib/schemas"
import { useToast } from "@/hooks/use-toast"
import { addSale } from "@/lib/firebase/actions"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Product } from "@/lib/types"
import { useState } from "react"
import { useCollection } from "@/hooks/use-firestore"

interface SaleFormProps {
  onSuccess?: () => void
}

export default function SaleForm({ onSuccess }: SaleFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const { data: products, loading: productsLoading } = useCollection<Product>('products');

  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      productId: "",
      quantity: 1,
    },
  })

  const onSubmit = async (data: SaleFormValues) => {
    setIsLoading(true)

    try {
      await addSale(data)
      toast({
        title: "Venta registrada",
        description: "La nueva venta ha sido registrada exitosamente.",
      })
      form.reset()
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Error al registrar la venta",
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
        <FormField
          control={form.control}
          name="productId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Producto</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={productsLoading}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un producto" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {products.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} (Stock: {product.stockQuantity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cantidad</FormLabel>
              <FormControl>
                <Input type="number" placeholder="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading || productsLoading} className="w-full">
          {isLoading ? 'Registrando...' : 'Registrar Venta'}
        </Button>
      </form>
    </Form>
  )
}
