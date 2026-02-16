import { IApi, IOrderData, IOrderResponse, IProductsResponse } from "../../types";

import { IProduct } from "../../types";

export class ShopApi {
    constructor(private api: IApi) {
    }

    async getProducts(): Promise<IProduct[]> {
        const response = await this.api.get<IProductsResponse>('/product/');
        return response.items
    }

    async createOrder(orderData: IOrderData): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order/', orderData);
    }
}

