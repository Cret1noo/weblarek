import { Form } from './Form';
import { ensureElement } from '../../../utils/utils';

interface IContactsFormActions {
    onSubmit: () => void;
    onEmailChange: (email: string) => void;
    onPhoneChange: (phone: string) => void;
}

export class ContactsForm extends Form<{ email: string; phone: string }> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;
    protected submitButton: HTMLButtonElement;
    protected errorContainer: HTMLElement;

    constructor(container: HTMLFormElement, actions?: IContactsFormActions) {
        super(container, actions);

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this.errorContainer = ensureElement('.form__errors', container);

        this.emailInput.addEventListener('input', () => {
            if (actions?.onEmailChange) {
                actions.onEmailChange(this.emailInput.value);
            }
        });

        this.phoneInput.addEventListener('input', () => {
            if (actions?.onPhoneChange) {
                actions.onPhoneChange(this.phoneInput.value);
            }
        });
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }

    setErrors(errors: { email?: string; phone?: string }) {
        this.errorContainer.innerHTML = '';
        const messages = [];
        if (errors.email) messages.push(errors.email);
        if (errors.phone) messages.push(errors.phone);
        this.errorContainer.textContent = messages.join(', ');
    }

    setButtonState(disabled: boolean) {
        this.submitButton.disabled = disabled;
    }
}