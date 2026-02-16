import { IProduct } from "../../types";

export class CartModel {
    private _items: IProduct[] = [];

    constructor() {
        this._items = [];
    }
    
    getItems(): IProduct[] {
        return this._items
    }

    addItem(item: IProduct): void {
        this._items.push(item)
    }

    removeItem(itemId: string): void {
        this._items = this._items.filter(item => item.id !== itemId);
    }

    clear(): void {
        this._items = [];
    }

    getTotalAmount(): number {
        return this._items.reduce((total, item) => {
            return total + (item.price || 0);
        }, 0);
    }

    getItemsCount(): number {
        return this._items.length;
    }

    containsItem(itemId: string): boolean {
        return this._items.some(item => item.id === itemId);
    }
}