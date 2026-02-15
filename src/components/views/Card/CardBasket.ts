import { Card } from './Card';
import { ensureElement } from '../../../utils/utils';
import { IProduct } from "../../../types";

type TCardBasket = Pick<IProduct, 'title' | 'price'> & {index: number};

export class CardBasket extends Card<TCardBasket> {
    private deleteButtonEl: HTMLButtonElement;
    private indexEl: HTMLElement;

    constructor(container: HTMLElement, actions?: { onClick: () => void }) {
        super(container);

        this.indexEl = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButtonEl = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container)

        if (actions?.onClick) {
            this.deleteButtonEl.addEventListener('click', actions.onClick);
        }
    }

    set index(value: number) {
        this.indexEl.textContent = value.toString();
    }
}