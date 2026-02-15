import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface IModalData {
    content: HTMLElement | HTMLElement[];
}

export class Modal extends Component<IModalData> {
    protected closeButton: HTMLButtonElement;
    protected contentEl: HTMLElement;

    constructor(protected readonly container: HTMLElement) {
        super(container);

        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this.contentEl = ensureElement<HTMLElement>('.modal__content', this.container);

        this.closeButton.addEventListener('click', () => this.close());
        this.container.addEventListener('mousedown', (evt) => {
            if (evt.target === evt.currentTarget) {
                this.close();
            }
        });
    }

    set content(data: HTMLElement) {
        this.contentEl.replaceChildren(data);
    }

    open() {
        this.container.classList.add('modal_active');
        document.addEventListener('keydown', this.handleEscClose);
    }

    close() {
        this.container.classList.remove('modal_active');
        document.removeEventListener('keydown', this.handleEscClose);
    }

    private handleEscClose = (evt: KeyboardEvent)=> {
        if (evt.key === "Escape") {
            this.close();
        }
    };
}
