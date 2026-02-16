import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface IHeaderActions {
    onBasketClick: () => void;
}

export class Header extends Component<{ counter: number }> {
    protected basketButton: HTMLButtonElement;
    protected counterEl: HTMLElement;

    constructor(container: HTMLElement, actions?: IHeaderActions) {
        super(container);

        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket-counter', container);
        this.counterEl = ensureElement<HTMLElement>('.header__counter', container);

        if (actions?.onBasketClick) {
            this.basketButton.addEventListener('click', actions.onBasketClick);
        }
    }

    set counter(value: number) {
        this.counterEl.textContent = String(value);
    }
}