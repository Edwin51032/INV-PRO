import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from './client';
import type { Product, Sale, Purchase } from '../types';
import type { ProductFormValues, PurchaseFormValues, SaleFormValues } from '../schemas';

const getUserId = (): string => {
  if (typeof window === 'undefined') {
    // This should ideally not happen on client-side actions
    return '';
  }
  let userId = localStorage.getItem('anonymousUserId');
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('anonymousUserId', userId);
  }
  return userId;
}

// Product Actions
export const addProduct = async (data: ProductFormValues) => {
  const userId = getUserId();
  if (!userId) throw new Error("User ID not found");
  const path = `users/${userId}/products`;
  await addDoc(collection(db, path), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const updateProduct = async (productId: string, data: ProductFormValues) => {
  const userId = getUserId();
  if (!userId) throw new Error("User ID not found");
  const path = `users/${userId}/products`;
  const productRef = doc(db, path, productId);
  await updateDoc(productRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteProduct = async (productId: string) => {
  const userId = getUserId();
  if (!userId) throw new Error("User ID not found");
  const path = `users/${userId}/products`;
  await deleteDoc(doc(db, path, productId));
};

// Sale Actions
export const addSale = async (data: SaleFormValues) => {
  const userId = getUserId();
  if (!userId) throw new Error("User ID not found");
  
  const productPath = `users/${userId}/products`;
  const productRef = doc(db, productPath, data.productId);

  await runTransaction(db, async (transaction) => {
    const productDoc = await transaction.get(productRef);
    if (!productDoc.exists()) {
      throw new Error("El producto no existe.");
    }

    const product = productDoc.data() as Product;
    const newStock = product.stockQuantity - data.quantity;

    if (newStock < 0) {
      throw new Error("Stock insuficiente para realizar la venta.");
    }
    
    transaction.update(productRef, { stockQuantity: newStock, updatedAt: serverTimestamp() });

    const salesPath = `users/${userId}/sales`;
    const saleRef = doc(collection(db, salesPath));
    transaction.set(saleRef, {
      productId: data.productId,
      productName: product.name,
      quantity: data.quantity,
      total: product.price * data.quantity,
      saleDate: serverTimestamp(),
    });
  });
};

export const deleteSale = async (sale: Sale) => {
    const userId = getUserId();
    if (!userId) throw new Error("User ID not found");
    
    const salesPath = `users/${userId}/sales`;
    const productPath = `users/${userId}/products`;
    const saleRef = doc(db, salesPath, sale.id);
    const productRef = doc(db, productPath, sale.productId);

    await runTransaction(db, async (transaction) => {
        const productDoc = await transaction.get(productRef);
        if (productDoc.exists()) {
            const product = productDoc.data() as Product;
            const newStock = product.stockQuantity + sale.quantity;
            transaction.update(productRef, { stockQuantity: newStock, updatedAt: serverTimestamp() });
        }
        transaction.delete(saleRef);
    });
};

// Purchase Actions
export const addPurchase = async (data: PurchaseFormValues) => {
    const userId = getUserId();
    if (!userId) throw new Error("User ID not found");
    const productPath = `users/${userId}/products`;
    const productRef = doc(db, productPath, data.productId);

    await runTransaction(db, async (transaction) => {
        const productDoc = await transaction.get(productRef);
        if (!productDoc.exists()) {
            throw new Error("El producto no existe.");
        }
        const product = productDoc.data() as Product;
        const newStock = product.stockQuantity + data.quantity;

        transaction.update(productRef, { stockQuantity: newStock, updatedAt: serverTimestamp() });
        
        const purchasesPath = `users/${userId}/purchases`;
        const purchaseRef = doc(collection(db, purchasesPath));
        transaction.set(purchaseRef, {
            productId: data.productId,
            productName: product.name,
            quantity: data.quantity,
            cost: data.cost,
            totalCost: data.cost * data.quantity,
            purchaseDate: serverTimestamp(),
        });
    });
};

export const deletePurchase = async (purchase: {id: string; productId: string; quantity: number}) => {
    const userId = getUserId();
    if (!userId) throw new Error("User ID not found");

    const purchasesPath = `users/${userId}/purchases`;
    const productPath = `users/${userId}/products`;

    const purchaseRef = doc(db, purchasesPath, purchase.id);
    const productRef = doc(db, productPath, purchase.productId);

    await runTransaction(db, async (transaction) => {
        const productDoc = await transaction.get(productRef);
        if (productDoc.exists()) {
            const product = productDoc.data() as Product;
            const newStock = product.stockQuantity - purchase.quantity;
            transaction.update(productRef, { stockQuantity: newStock, updatedAt: serverTimestamp() });
        }
        transaction.delete(purchaseRef);
    });
};
