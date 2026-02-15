import { Card } from './Card';
import { ensureElement } from '../../../utils/utils';
import { categoryMap, CDN_URL } from '../../../utils/constants';
import { IProduct } from "../../../types";

type TCardCatalog = Pick<IProduct, 'category'> & {image: string};

export class CardCatalog extends Card<TCardCatalog> {
    protected categoryEl: HTMLElement;
    protected imageEl: HTMLImageElement;

    constructor (container: HTMLElement, actions?: {onClick: () => void}) {
        super(container);
            this.categoryEl = ensureElement(`.card__category`, container);
            this.imageEl = ensureElement('.card__image', container) as HTMLImageElement;
        if(actions?.onClick) {
            container.addEventListener('click', actions.onClick)
        }
    }
    set category(value: string) {
    this.categoryEl.textContent = value;
    this.categoryEl.className = 'card__category';
    
    const categoryClass = categoryMap[value as keyof typeof categoryMap];
    if (categoryClass) {
        this.categoryEl.classList.add(categoryClass);
    }
}

    set image(value: string) {
        this.setImage(this.imageEl, CDN_URL + value, value);
    }
}
