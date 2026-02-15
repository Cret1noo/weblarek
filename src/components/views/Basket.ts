import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface IBasketActions {
    onCheckout: () => void;
}

export class Basket extends Component<{ items: HTMLElement[]; total: number }> {
    protected listEl: HTMLElement;
    protected totalEl: HTMLElement;
    protected buttonEl: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: IBasketActions) {
        super(container);

        this.listEl = ensureElement<HTMLElement>('.basket__list', container);
        this.totalEl = ensureElement<HTMLElement>('.basket__price', container);
        this.buttonEl = ensureElement<HTMLButtonElement>('.basket__button', container);

        if (actions?.onCheckout) {
            this.buttonEl.addEventListener('click', actions.onCheckout);
        }
    }

    set items(items: HTMLElement[]) {
        this.listEl.replaceChildren(...items);
        
        
        if (items.length === 0) {
            const emptyEl = document.createElement('p');
            emptyEl.textContent = 'Корзина пуста';
            this.listEl.appendChild(emptyEl);
            this.buttonEl.disabled = true;
        } else {
            this.buttonEl.disabled = false;
        }
    }

    set total(value: number) {
        this.totalEl.textContent = `${value} синапсов`;
    }
}