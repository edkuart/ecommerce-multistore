export type MovementType =
  | "CREATION"
  | "RESTOCK"
  | "SALE"
  | "ADJUSTMENT"
  | "RETURN"
  | "DAMAGE";

export type InventoryMovement = {
  id: string;
  storeId: string;
  productId: string;
  variantId?: string | null;
  product?: { id: string; name: string; sku?: string | null; stock?: number } | null;
  store?: { id: string; name: string } | null;
  variant?: { id: string; size: string; color: string } | null;
  type: MovementType;
  quantity: number;
  stockAfter: number;
  note?: string | null;
  referenceId?: string | null;
  createdBy?: string | null;
  createdAt: string;
};

export type CreateMovementInput = {
  productId: string;
  storeId: string;
  variantId?: string | null;
  type: MovementType;
  quantity: number;
  note?: string;
};

export type InventoryMetrics = {
  totalMovements: number;
  totalSales: number;
  totalRestock: number;
  totalUnitsIn: number;
  totalUnitsOut: number;
  currentUnits: number;
  lowStockCount: number;
  outOfStockCount: number;
};

export type SalesByDayMetric = {
  date: string;
  units: number;
};

export type TopProductMetric = {
  productId: string;
  name: string;
  unitsSold: number;
};
