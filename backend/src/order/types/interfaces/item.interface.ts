export interface OrderItem {
  itemId: number;
  itemName: string;
  quantity: number;
  ingredients: string[];
  observation?: string;
}
