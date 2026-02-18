import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class CartModel {
    private _items: IProduct[] = [];
    private events: EventEmitter;

    constructor(events?: EventEmitter) {
        this.events = events || new EventEmitter();
        this._items = [];
    }
    
    getItems(): IProduct[] {
        return this._items;
    }

    addItem(item: IProduct): void {
        this._items.push(item);
        this.events.emit('basket:changed', { items: this._items });
    }

    removeItem(itemId: string): void {
        this._items = this._items.filter(item => item.id !== itemId);
        this.events.emit('basket:changed', { items: this._items });
    }

    clear(): void {
        this._items = [];
        this.events.emit('basket:changed', { items: this._items });
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