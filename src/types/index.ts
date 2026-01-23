export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'cash' | 'card' | '';

export interface IProduct {
  id: string;           
  description: string;  
  image: string;        
  title: string;        
  category: string;     
  price: number | null;
}

export interface IBuyer {
    payment: TPayment; 
    address: string; 
    email: string; 
    phone: string; 
}

export interface IBuyerValidatinErrors {
    payment?: string; 
    address?: string; 
    email?: string; 
    phone?: string; 
} 

export interface IProductsResponse {
  total: number;      
  items: IProduct[];  
}

export interface ICartItem extends IProduct {
    count: number;
}
