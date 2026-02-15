import { Card } from './Card';
import { ensureElement } from '../../../utils/utils';
import { categoryMap, CDN_URL } from '../../../utils/constants';
import { IProduct } from "../../../types";

export class CardPreview extends Card<IProduct> {
    protected descriptionEl: HTMLElement;
    protected buttonEl: HTMLButtonElement;
    protected categoryEl: HTMLElement;
    protected imageEl: HTMLImageElement;

    constructor(container: HTMLElement, actions?: {onAdd: () => void}) {
        super(container);

        this.descriptionEl = ensureElement('card__text', container);
        this.buttonEl = ensureElement(`card__button`, container) as HTMLButtonElement;
        this.categoryEl = ensureElement('card__category', container);
        this.imageEl = ensureElement('card__image') as HTMLImageElement;

        if(actions?.onAdd) {
            this.buttonEl.addEventListener('click', actions.onAdd);
        }
    }

    set description(value: string) {
        this.descriptionEl.textContent = value;
    }

    set buttonText(value: string) {
        this.buttonEl.textContent = value;
    }

    set category(value: string) { 
    this.categoryEl.textContent = value;
    this.categoryEl.className = 'card__category';
    
    const categoryClass = categoryMap[value as keyof typeof categoryMap];
    if (categoryClass) {
        this.categoryEl.classList.add(categoryClass);
    }
}

    set buttonDisabled(state: boolean) {
    this.buttonEl.disabled = state;
}

    set image(value: string) {
        this.setImage(this.imageEl, CDN_URL + value, value);
    }
}