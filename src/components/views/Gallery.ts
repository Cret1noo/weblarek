import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export class Gallery extends Component<{ catalog: HTMLElement[] }> {
    protected galleryEl: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.galleryEl = ensureElement<HTMLElement>('.gallery', container);
    }

    set catalog(items: HTMLElement[]) {
    this.galleryEl.replaceChildren(...items);
    }
}