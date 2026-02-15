import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import { IProduct } from '../../../types';

type TCard = Pick<IProduct, 'title' | 'price'>;

export abstract class Card<T> extends Component<T & TCard> {
    protected titleEl: HTMLElement;
    protected priceEl: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.titleEl = ensureElement('.card__title', container);
        this.priceEl = ensureElement('.card__price', container);
    }

    set title(value: string) {
        this.titleEl.textContent = value;
    }

    set price(value: number | null) {
    if (value === null) {
        this.priceEl.textContent = 'Бесценно';
    } else {
        this.priceEl.textContent = `${value} синапсов`;
    }
}
}