"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { purchaseSchema, type PurchaseFormValues } from "@/lib/schemas"
import { useToast } from "@/hooks/use-toast"
import { addPurchase } from "@/lib/firebase/actions"
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

interface PurchaseFormProps {
  onSuccess?: () => void
}

export default function PurchaseForm({ onSuccess }: PurchaseFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const { data: products, loading: productsLoading } = useCollection<Product>('products');

  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      productId: "",
      quantity: 1,
      cost: 0
    },
  })

  const onSubmit = async (data: PurchaseFormValues) => {
    setIsLoading(true)

    try {
      await addPurchase(data)
      toast({
        title: "Compra registrada",
        description: "La nueva compra ha sido registrada exitosamente.",
      })
      form.reset()
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Error al registrar la compra",
        description: `Ocurrió un error: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const selectedProductId = form.watch('productId')

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="productId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Producto</FormLabel>
              <Select onValueChange={(value) => {
                field.onChange(value)
                const product = products.find(p => p.id === value);
                if (product) {
                  form.setValue('cost', product.cost);
                }
              }} defaultValue={field.value} disabled={productsLoading}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un producto" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {products.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
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

        <FormField
          control={form.control}
          name="cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Costo por unidad</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0.00" {...field} disabled={!selectedProductId} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading || productsLoading} className="w-full">
          {isLoading ? 'Registrando...' : 'Registrar Compra'}
        </Button>
      </form>
    </Form>
  )
}
