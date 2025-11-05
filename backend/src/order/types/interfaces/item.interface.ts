import { ItemCategory } from "../enums/item-category.enum";

export interface OrderItem {
  itemId: string;
  itemName: string;
  category: ItemCategory;
  quantity: number;
  ingredients: string[];
  unitPrice: number;
  observation?: string[];
}
