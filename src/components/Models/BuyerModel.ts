import { IBuyer, IBuyerValidatinErrors } from "../../types";
import { EventEmitter } from "../base/Events";

export class BuyerModel {
    private _data: IBuyer = {
        payment: '',
        email: '',
        phone: '',
        address: ''
    };
    private events: EventEmitter;

    constructor(events?: EventEmitter) {
        this.events = events || new EventEmitter();
    }

    saveData(data: Partial<IBuyer>): void {
        this._data = { ...this._data, ...data };
        this.events.emit('buyer:changed', { data: this._data });
    }

    getData(): Partial<IBuyer> {
        return this._data;
    }

    clear(): void {
        this._data = {
            payment: '',
            email: '',
            phone: '',
            address: ''
        };
        this.events.emit('buyer:changed', { data: this._data });
    }

    validate(): IBuyerValidatinErrors {
        const errors: IBuyerValidatinErrors = {};
        
        if(!this._data.payment) {
            errors.payment = 'Не выбран вид оплаты';
        }

        if(!this._data.email) {
            errors.email = 'Укажите email';
        }

        if(!this._data.phone) {
            errors.phone = 'Укажите номер телефона';
        }

        if(!this._data.address) {
            errors.address = 'Укажите адрес';
        }
        return errors;
    }
}