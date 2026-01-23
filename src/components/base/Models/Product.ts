import { IProduct } from "../../../types";

export class ProductModel {
    private _products: IProduct[] = [];
    private _selectedProduct: IProduct | null = null;

    constructor(initialProducts: IProduct [] = []) {
        this._products = initialProducts;
    }

    saveProducts(products: IProduct[]): void {
        this._products = products;
    }

    getProducts(): IProduct[] {
        return this._products;
    }

    getProductById(id: string): IProduct | null {
        return this._products.find(product => product.id === id) || null;
    }

    saveSelectedProduct(product: IProduct): void {
        this._selectedProduct = product;
    }

    getSelectedProduct(): IProduct | null {
        return this._selectedProduct;
    }
}