export interface ShoppingListItem {
  productId: string;
  productName: string;
  quantity: number;
  checked: boolean;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingListItem[];
  createdAt: Date;
  updatedAt: Date;
}
