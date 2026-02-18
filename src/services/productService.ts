import { getDb, saveDb, nextId } from "../db/mockDb";
import { Product, EtaUnit } from "../types";

export interface CreateProductData {
  sellerId: string;
  name: string;
  category: string;
  priceBase?: number;
  etaValue?: number;
  etaUnit?: EtaUnit;
  notes?: string;
  conditions?: string;
  images: string[];
}

export async function createProduct(data: CreateProductData): Promise<Product> {
  const db = getDb();
  const product: Product = {
    id: nextId("products"),
    sellerId: data.sellerId,
    name: data.name,
    category: data.category,
    priceBase: data.priceBase,
    etaValue: data.etaValue,
    etaUnit: data.etaUnit,
    notes: data.notes,
    conditions: data.conditions,
    images: data.images,
    createdAt: new Date().toISOString(),
  };
  db.products.push(product);
  await saveDb();
  return product;
}

export function getProductsBySeller(sellerId: string): Product[] {
  return getDb()
    .products.filter((p) => p.sellerId === sellerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getProductById(id: string): Product | undefined {
  return getDb().products.find((p) => p.id === id);
}

export async function deleteProduct(id: string): Promise<void> {
  const db = getDb();
  const idx = db.products.findIndex((p) => p.id === id);
  if (idx >= 0) {
    db.products.splice(idx, 1);
    await saveDb();
  }
}

export async function updateProduct(
  id: string,
  data: Partial<CreateProductData>
): Promise<void> {
  const db = getDb();
  const product = db.products.find((p) => p.id === id);
  if (!product) throw new Error("Producto no encontrado");
  Object.assign(product, data);
  await saveDb();
}
