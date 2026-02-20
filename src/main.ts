import './scss/styles.scss';
import { Api } from './components/base/Api';
import { ShopApi } from './components/ShopApi/ShopApi';
import { ProductModel } from './components/Models/Product';
import { CartModel } from './components/Models/CartModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IOrderData } from './types';

import { CardCatalog } from './components/views/Card/CardCatalog';
import { CardPreview } from './components/views/Card/CardPreview';
import { CardBasket } from './components/views/Card/CardBasket';
import { Modal } from './components/views/Modal';
import { Basket } from './components/views/Basket';
import { Gallery } from './components/views/Gallery';
import { Header } from './components/views/Header';
import { OrderForm } from './components/views/Order/OrderForm';
import { ContactsForm } from './components/views/Order/ContactsForm';
import { Success } from './components/views/Success';

// Создаем брокер событий
const events = new EventEmitter();

// Создаем API
const api = new Api(API_URL);
const shopApi = new ShopApi(api);

// Создаем модели
const productModel = new ProductModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

// Создаем View компоненты
const gallery = new Gallery(ensureElement('.gallery'));
const modal = new Modal(ensureElement('.modal'));
const header = new Header(ensureElement('.header'), {
    onBasketClick: () => events.emit('basket:open')
});

// Создаем формы
const orderForm = new OrderForm(cloneTemplate<HTMLFormElement>('#order'), {
    onSubmit: () => events.emit('order:next'),
    onPaymentChange: (payment: string) => events.emit('order:payment-change', { payment }),
    onAddressChange: (address: string) => events.emit('order:address-change', { address })
});

const contactsForm = new ContactsForm(cloneTemplate('#contacts'), {
    onSubmit: () => events.emit('contacts:submit'),
    onEmailChange: (email: string) => events.emit('contacts:email-change', { email }),
    onPhoneChange: (phone: string) => events.emit('contacts:phone-change', { phone })
});

// Корзина
const basket = new Basket(cloneTemplate('#basket'), {
    onCheckout: () => events.emit('basket:checkout')
});

// Загрузка товаров
shopApi.getProducts()
    .then(data => productModel.saveProducts(data))
    .catch(err => console.error('Ошибка загрузки товаров:', err));


// Изменение каталога
events.on('catalog:changed', () => {
    const products = productModel.getProducts();
    const cards = products.map(product => {
        const card = new CardCatalog(
            cloneTemplate('#card-catalog'),
            { onClick: () => events.emit('card:select', product) }
        );
        card.title = product.title;
        card.price = product.price;
        card.category = product.category;
        card.image = product.image;
        return card.render();
    });
    gallery.catalog = cards;
});

// Изменение корзины – только обновляем данные в компоненте корзины и счётчик
events.on('basket:changed', () => {
    header.counter = cartModel.getItemsCount();
    const items = cartModel.getItems();
    if (items.length === 0) {
        const emptyEl = document.createElement('p');
        emptyEl.textContent = 'Корзина пуста';
        basket.items = [emptyEl];
        basket.total = 0;
    } else {
        const cards = items.map((item, index) => {
            const card = new CardBasket(
                cloneTemplate('#card-basket'),
                { onClick: () => events.emit('basket:remove', item) }
            );
            card.title = item.title;
            card.price = item.price;
            card.index = index + 1;
            return card.render();
        });
        basket.items = cards;
        basket.total = cartModel.getTotalAmount();
    }
});

// Открытие корзины – показываем уже актуальный basket
events.on('basket:open', () => {
    modal.content = basket.render();
    modal.open();
});

// Выбор карточки товара
events.on('card:select', (product: any) => {
    productModel.saveSelectedProduct(product);
});

// Изменение выбранного товара – показываем превью
events.on('product:changed', () => {
    const product = productModel.getSelectedProduct();
    if (!product) return;

    const preview = new CardPreview(
        cloneTemplate('#card-preview'),
        { onAdd: () => events.emit('basket:add', product) }
    );
    preview.title = product.title;
    preview.price = product.price;
    preview.category = product.category;
    preview.image = product.image;
    preview.description = product.description;
    
    const inBasket = cartModel.containsItem(product.id);
    preview.buttonText = inBasket ? 'Удалить из корзины' : 'Купить';
    preview.buttonDisabled = product.price === null;

    modal.content = preview.render();
    modal.open();
});

// Добавление/удаление товара через кнопку в превью
events.on('basket:add', (product: any) => {
    if (cartModel.containsItem(product.id)) {
        cartModel.removeItem(product.id);
    } else {
        cartModel.addItem(product);
    }
    modal.close(); 
});

// Удаление из корзины (кнопка в корзине)
events.on('basket:remove', (product: any) => {
    cartModel.removeItem(product.id);
});

// Переход к оформлению заказа (из корзины)
events.on('basket:checkout', () => {
    modal.content = orderForm.render();
    modal.open();
});

// Переход ко второй форме
events.on('order:next', () => {
    modal.content = contactsForm.render();
    modal.open();
});

// Отправка заказа
events.on('contacts:submit', () => {
    const buyerData = buyerModel.getData();
    const orderData = {
        payment: buyerData.payment || '',
        address: buyerData.address || '',
        email: buyerData.email || '',
        phone: buyerData.phone || '',
        items: cartModel.getItems().map(item => item.id),
        total: cartModel.getTotalAmount()
    } as IOrderData;

    shopApi.createOrder(orderData)
        .then(response => {
            cartModel.clear();
            buyerModel.clear();
            const success = new Success(cloneTemplate('#success'), {
                onClick: () => modal.close()
            });
            success.total = response.total;
            modal.content = success.render();
        })
        .catch(err => console.error('Ошибка оформления заказа:', err));
});

events.on('buyer:changed', () => {
    const errors = buyerModel.validate();

    const orderErrors = {
        payment: errors.payment,
        address: errors.address
    };
    const orderHasErrors = !!(orderErrors.payment || orderErrors.address);
    orderForm.setErrors(orderErrors);
    orderForm.setButtonState(orderHasErrors);

    const contactsErrors = {
        email: errors.email,
        phone: errors.phone
    };
    const contactsHasErrors = !!(contactsErrors.email || contactsErrors.phone);
    contactsForm.setErrors(contactsErrors);
    contactsForm.setButtonState(contactsHasErrors);
});

events.on('order:payment-change', (data: { payment: string }) => {
    buyerModel.saveData({ payment: data.payment as 'card' | 'cash' });
    orderForm.payment = data.payment;
});

events.on('order:address-change', (data: { address: string }) => {
    buyerModel.saveData({ address: data.address });
    orderForm.address = data.address;
});

events.on('contacts:email-change', (data: { email: string }) => {
    buyerModel.saveData({ email: data.email });
    contactsForm.email = data.email;
});

events.on('contacts:phone-change', (data: { phone: string }) => {
    buyerModel.saveData({ phone: data.phone });
    contactsForm.phone = data.phone;
});