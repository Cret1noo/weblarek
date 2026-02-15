import './scss/styles.scss';
import { Api } from './components/base/Api';
import { ShopApi } from './components/ShopApi/ShopApi';
import { ProductModel } from './components/Models/Product';
import { CartModel } from './components/Models/CartModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { ensureElement } from './utils/utils';

import { CardCatalog } from './components/views/Card/CardCatalog';
import { CardPreview } from './components/views/Card/CardPreview';
import { CardBasket } from './components/views/Card/CardBasket';
import { Modal } from './components/views/Modal';
import { Basket } from './components/views/Basket';
import { Gallery } from './components/views/Gallery';
import { Header } from './components/views/Header';
import { OrderForm } from './components/views/Order/OrderForm';
import { ContactsForm } from './components/views/Order/ContactsForm';

// Создаем брокер событий
const events = new EventEmitter();

// Создаем API
const api = new Api(API_URL);
const shopApi = new ShopApi(api);

// Создаем модели
const productModel = new ProductModel([]);
const cartModel = new CartModel([]);
const buyerModel = new BuyerModel();

// Создаем View компоненты
const gallery = new Gallery(ensureElement('.gallery'));
const modal = new Modal(ensureElement('.modal'));
const header = new Header(ensureElement('.header'), {
    onBasketClick: () => events.emit('basket:open')
});

// Создаем формы
const orderForm = new OrderForm(ensureElement<HTMLFormElement>('.order-form'), {
    onSubmit: () => events.emit('order:next'),
    onPaymentChange: (payment: string) => events.emit('order:payment-change', { payment }),
    onAddressChange: (address: string) => events.emit('order:address-change', { address })
});

const contactsForm = new ContactsForm(ensureElement<HTMLFormElement>('.contacts-form'), {
    onSubmit: () => events.emit('contacts:submit'),
    onEmailChange: (email: string) => events.emit('contacts:email-change', { email }),
    onPhoneChange: (phone: string) => events.emit('contacts:phone-change', { phone })
});

// Корзина
const basket = new Basket(ensureElement('.basket'), {
    onCheckout: () => events.emit('basket:checkout')
});

// ==================== ЗАГРУЗКА ДАННЫХ ====================

shopApi.getProducts()
    .then(data => {
        productModel.saveProducts(data);
    })
    .catch(err => console.error('Ошибка загрузки товаров:', err));

// ==================== СОБЫТИЯ МОДЕЛЕЙ ====================

// Изменение каталога
events.on('catalog:changed', () => {
    const products = productModel.getProducts();
    const cards = products.map(product => {
        const card = new CardCatalog(
            document.createElement('div'),
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

// Изменение корзины
events.on('basket:changed', () => {
    header.counter = cartModel.getItemsCount();
});

// Изменение выбранного товара
events.on('product:changed', () => {
    const product = productModel.getSelectedProduct();
    if (!product) return;

    const preview = new CardPreview(
        document.createElement('div'),
        {
            onAdd: () => events.emit('basket:add', product)
        }
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

// ==================== СОБЫТИЯ VIEW ====================

// Выбор карточки
events.on('card:select', (product: any) => {
    productModel.saveSelectedProduct(product);
});

// Добавление/удаление из корзины
events.on('basket:add', (product: any) => {
    if (cartModel.containsItem(product.id)) {
        cartModel.removeItem(product.id);
    } else {
        cartModel.addItem(product);
    }
    modal.close();
});

// Открытие корзины
events.on('basket:open', () => {
    const items = cartModel.getItems();
    const cards = items.map((item, index) => {
        const card = new CardBasket(
            document.createElement('div'),
            { onClick: () => events.emit('basket:remove', item) }
        );
        card.title = item.title;
        card.price = item.price;
        card.index = index + 1;
        return card.render();
    });
    basket.items = cards;
    basket.total = cartModel.getTotalAmount();
    modal.content = basket.render();
    modal.open();
});

// Удаление из корзины
events.on('basket:remove', (product: any) => {
    cartModel.removeItem(product.id);
    events.emit('basket:open');
});

// Оформление заказа
events.on('basket:checkout', () => {
    modal.content = orderForm.render();
    modal.open();
});

// Переход к контактам
events.on('order:next', () => {
    modal.content = contactsForm.render();
    modal.open();
});

// Отправка заказа
events.on('contacts:submit', () => {
    const orderData = {
        payment: buyerModel.getData().payment || '',
        address: buyerModel.getData().address || '',
        email: buyerModel.getData().email || '',
        phone: buyerModel.getData().phone || '',
        items: cartModel.getItems().map(item => item.id),
        total: cartModel.getTotalAmount()
    };

    shopApi.createOrder(orderData)
        .then(() => {
            cartModel.clear();
            buyerModel.clear();
            modal.close();
            const success = document.createElement('p');
            success.textContent = 'Заказ успешно оформлен!';
            success.style.textAlign = 'center';
            success.style.fontSize = '18px';
            success.style.padding = '20px';
            modal.content = success;
            modal.open();
        })
        .catch(err => console.error('Ошибка оформления заказа:', err));
});

// Изменение данных в формах
events.on('order:payment-change', (data: { payment: string }) => {
    buyerModel.saveData({ 
        payment: data.payment as 'card' | 'cash' });
});

events.on('order:address-change', (data: { address: string }) => {
    buyerModel.saveData({ address: data.address });
});

events.on('contacts:email-change', (data: { email: string }) => {
    buyerModel.saveData({ email: data.email });
});

events.on('contacts:phone-change', (data: { phone: string }) => {
    buyerModel.saveData({ phone: data.phone });
});