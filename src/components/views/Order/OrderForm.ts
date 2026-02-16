import { Form } from './Form';
import { ensureElement } from '../../../utils/utils';

interface IOrderFormActions {
    onSubmit: () => void;
    onPaymentChange: (payment: string) => void;
    onAddressChange: (address: string) => void;
}

export class OrderForm extends Form<{ payment: string; address: string }> {
    protected paymentButtons: HTMLButtonElement[];
    protected addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, actions?: IOrderFormActions) {
        super(container, actions);

        this.paymentButtons = Array.from(container.querySelectorAll('.button_alt'));
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);

        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                const paymentMethod = button.getAttribute('name') || 'card';
                if (actions?.onPaymentChange) {
                    actions.onPaymentChange(paymentMethod);
                }
            });
        });

        this.addressInput.addEventListener('input', () => {
            if (actions?.onAddressChange) {
                actions.onAddressChange(this.addressInput.value);
            }
        });
    }

    togglePayment(payment: string) {
        this.paymentButtons.forEach(btn => {
            const method = btn.getAttribute('name');
            if (method === payment) {
                btn.classList.add('button_alt-active');
            } else {
                btn.classList.remove('button_alt-active');
            }
        });
    }

    set payment(value: string) {
        this.togglePayment(value);
    }

    set address(value: string) {
        this.addressInput.value = value;
    }
}