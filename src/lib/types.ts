import type { User as FirebaseUser } from 'firebase/auth';
import type { Timestamp } from 'firebase/firestore';

export interface User extends FirebaseUser {}

export type Product = {
  id: string;
  userId?: string;
  name: string;
  category: string;
  sku: string;
  price: number;
  cost: number;
  stockQuantity: number;
  reorderPoint: number;
  imageUrl: string;
  imageHint: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type Sale = {
  id: string;
  userId?: string;
  productId: string;
  productName: string;
  quantity: number;
  total: number;
  saleDate: Timestamp;
};

export type Purchase = {
  id: string;
  userId?: string;
  productId: string;
  productName:string;
  quantity: number;
  cost: number;
  totalCost: number;
  purchaseDate: Timestamp;
};
