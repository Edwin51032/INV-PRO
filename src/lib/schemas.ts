import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  category: z.string().min(1, 'La categoría es requerida'),
  sku: z.string().optional(),
  price: z.coerce.number().min(0, 'El precio debe ser un número positivo'),
  cost: z.coerce.number().min(0, 'El costo debe ser un número positivo'),
  stockQuantity: z.coerce.number().int('La cantidad debe ser un número entero').min(0, 'El stock no puede ser negativo'),
  reorderPoint: z.coerce.number().int('El punto de reorden debe ser un número entero').min(0, 'El punto de reorden no puede ser negativo'),
  imageUrl: z.string().url('URL de imagen no válida').optional().or(z.literal('')),
  imageHint: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;


export const saleSchema = z.object({
  productId: z.string().min(1, 'Debes seleccionar un producto'),
  quantity: z.coerce.number().int('La cantidad debe ser un entero').min(1, 'La cantidad debe ser al menos 1'),
});
export type SaleFormValues = z.infer<typeof saleSchema>;


export const purchaseSchema = z.object({
  productId: z.string().min(1, 'Debes seleccionar un producto'),
  quantity: z.coerce.number().int('La cantidad debe ser un entero').min(1, 'La cantidad debe ser al menos 1'),
  cost: z.coerce.number().min(0, 'El costo debe ser un número positivo'),
});
export type PurchaseFormValues = z.infer<typeof purchaseSchema>;
