import './scss/styles.scss';
import { Api } from './components/base/Api';
import { ShopApi } from './components/ShopApi/ShopApi';
import { ProductModel } from './components/base/Models/Product';
import { CartModel } from './components/base/Models/CartModel';
import { BuyerModel } from './components/base/Models/BuyerModel';
import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';

function testModels() {
    console.log('=== Тестирование моделей данных ===\n');

    console.log('1. Тестирование ProductModel:');
    
    const productModel = new ProductModel();
    
    productModel.saveProducts(apiProducts.items);
    const allProducts = productModel.getProducts();
    console.log('Все товары:', allProducts);
    console.log('Количество товаров:', allProducts.length);
    
    if (allProducts.length > 0) {
        const firstProductId = allProducts[0].id;
        const foundProduct = productModel.getProductById(firstProductId);
        console.log('Товар по ID', firstProductId, ':', foundProduct);
        
        const notFoundProduct = productModel.getProductById('non-existent-id');
        console.log('Несуществующий ID:', notFoundProduct);
    }
    
    if (allProducts.length > 1) {
        const selectedProduct = allProducts[1];
        productModel.saveSelectedProduct(selectedProduct);
        const retrievedProduct = productModel.getSelectedProduct();
        console.log('Выбранный товар:', retrievedProduct);
        console.log('ID выбранного товара:', retrievedProduct?.id);
    }
    
    console.log('\n2. Тестирование CartModel:');
    
    const cartModel = new CartModel();

    if (allProducts.length >= 3) {
        cartModel.addItem(allProducts[0]);
        cartModel.addItem(allProducts[1]);
        cartModel.addItem(allProducts[2]);
        
        const cartItems = cartModel.getItems();
        console.log('Товары в корзине:', cartItems);
        console.log('Количество товаров в корзине:', cartModel.getItemsCount());
        
        console.log('Общая стоимость корзины:', cartModel.getTotalAmount());
        
        const firstProductId = allProducts[0].id;
        console.log('Содержит товар', firstProductId, ':', cartModel.containsItem(firstProductId));
        
        cartModel.removeItem(firstProductId);
        console.log('После удаления товара', firstProductId, ':');
        console.log('Количество товаров:', cartModel.getItemsCount());
        console.log('Содержит удаленный товар:', cartModel.containsItem(firstProductId));
        
        cartModel.clear();
        console.log('После очистки корзины:');
        console.log('Количество товаров:', cartModel.getItemsCount());
        console.log('Общая стоимость:', cartModel.getTotalAmount());
    }
    
    console.log('\n3. Тестирование BuyerModel:');
    
    const buyerModel = new BuyerModel();
    
    buyerModel.saveData({
        email: 'test@example.com',
        phone: '+79991234567'
    });
    
    console.log('Данные после частичного сохранения:', buyerModel.getData());
    
    buyerModel.saveData({
        address: 'Москва, ул. Примерная, д. 1',
        payment: 'card'
    });
    
    console.log('Данные после полного сохранения:', buyerModel.getData());
    
    const validationResult = buyerModel.validate();
    console.log('Результат валидации:', validationResult);
    console.log('Валидны все поля?', Object.keys(validationResult).length === 0);
    
    buyerModel.clear();
    console.log('Данные после очистки:', buyerModel.getData());
    
    console.log('\n=== Тестирование завершено ===');
}

console.log('API_URL:', API_URL);

const api = new Api(API_URL);
const shopApi = new ShopApi(api);
const serverProductModel = new ProductModel();

shopApi.getProducts()
    .then(products => {
        console.log('\n=== Получение данных с сервера ===');
        console.log('Получено товаров с сервера:', products.length);
        
        serverProductModel.saveProducts(products);
        
        const savedProducts = serverProductModel.getProducts();
        console.log('Товаров сохранено в модель:', savedProducts.length);
        console.log('Каталог из модели:', savedProducts);
        
        if (savedProducts.length > 0) {
            console.log('\nПроверка работы классов:');
            const testProduct = savedProducts[0];
            console.log('Первый товар:', testProduct.title, '-', testProduct.price, 'руб.');
            
            const foundById = serverProductModel.getProductById(testProduct.id);
            console.log('Найден по ID:', foundById ? 'да' : 'нет');
        }
        
        console.log('=== Классы работают корректно ===');
    })
    .catch(error => {
        console.error('\n=== Ошибка при получении данных с сервера ===');
        console.error('Ошибка:', error);
        console.log('Используем тестовые данные...');
        
        serverProductModel.saveProducts(apiProducts.items);
        console.log('Использовано тестовых товаров:', serverProductModel.getProducts().length);
    });

testModels();
