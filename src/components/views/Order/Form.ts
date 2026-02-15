import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';

interface IFormActions {
    onSubmit: () => void;
}

export class Form<T> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorsEl: HTMLElement;

    constructor(container: HTMLFormElement, actions?: IFormActions) {
        super(container);

        this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', container);
        this.errorsEl = ensureElement<HTMLElement>('.form__errors', container);

        container.addEventListener('submit', (evt) => {
            evt.preventDefault();
            if (actions?.onSubmit) {
                actions.onSubmit();
            }
        });
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string) {
        this.errorsEl.textContent = value;
    }
}