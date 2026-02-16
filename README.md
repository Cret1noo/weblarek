# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

## Данные 

В приложение используются следующие типы данных для работы с каталогом товаров, корзиной и оформлением заказа.

### Интерфейсы данных

#### IProduct (Товар)
Интерфейс описывает структуру товара в каталоге.

```typescript
/**
 * Тип для способа оплаты
 */
type TPayment = 'cash' | 'card' | '';

/**
 * Интерфейс товара
 * Описывает структуру товара в каталоге
 */
interface IProduct {
  id: string;           // Уникальный идентификатор товара
  description: string;  // Подробное описание товара
  image: string;        // URL изображения товара
  title: string;        // Название товара
  category: string;     // Категория товара
  price: number | null; // Цена товара (может быть null)
}

/**
 * Интерфейс покупателя
 * Описывает данные покупателя для оформления заказа
*/
interface IBuyer {
    payment: TPayment; //Способ оплаты
    address: string; //Адрес доставки
    email: string; // Электронная почта
    phone: string; //Телфон
}

/**
 * Интерфейс для ошибок валидации покупателя
 * Используется для возврата информации о валидности полей
*/
interface IBuyerValidatinErrors {
    payment?: string; // Ошибка для поля payment
    address?: string; // Ошибка для поля address
    email?: string; // Ошибка для поля email
    phone?: string; //Ошибка для поля phone
} 
```

----

## Модели данных

### Класс ProductModel

Класс отвечает за хранение и управление данными о товарах в каталоге. Хранит список всех доступных товаров и информацию о выбранном для детального просмотра товаре.

**Конструктор:**
```typescript
constructor(initialProducts: IProduct[] = [])
```

- `initialProducts: IProduct[] = []` - начальный массив товаров (по умолчанию пустой массив)

**Поля класса:**
- `_products: IProduct[]` - приватное поле, хранящее массив всех товаров каталога
- `_selectedProduct: IProduct | null` - приватное поле, хранящее товар, выбранный для подробного отображения

**Методы класса:**

1. `saveProducts(products: IProduct[]): void`
- Сохраняет массив товаров в модель
- Параметры: `pructs: IProduct[]` - массив товаров для сохранения 

2. `getProducts(): IProduct[]`
- Возвращает массив всех товаров из модели
- Возвращаемое значение: `IProduct[]` - массив товаров

3. `getProductById(id: string): IProduct | null`
- Находит товар по его идентификатору
- Параметры: `id: string` - идентификатор товара
- Возвращаемое значение: `IProduct | null` - найденный товар или null

4. `saveSelectedProduct(product: IProduct): void`
- Сохраняет товар для подробного отображения
- Параметры: `product: IProduct` - товар для сохранения

5. `getSelectedProduct(): IProduct | null`
- Возвращает товар, сохраненный для подробного отображения
- Возвращаемое значение: `IProduct | null` - выбранный товар или null

---

### Класс CartModel

Класс отвечает за хранение и управление товарами в корзине покупателя. Предоставляет методы для добавления, удаления и анализа товаров в корзине.

**Конструктор:**
```typescript
constructor(initialItems: IProduct[] = [])
```
- `initialItems: IProduct[] = []` - начальный массив товаров в корзине (по умолчанию пустой массив)

**Поля класса:**
- `_items: IProduct[]` - приватное поле, хранящее массив товаров в корзине

**Методы класса:**

1. `getItems(): IProduct[]`
- Возвращает массив товаров, которые находятся в корзине
- Возвращаемое значение: `IProduct[]` - массив товаров в корзине

2. `addItem(item: IProduct): void`
- Добавляет товар в корзину
- Параметры: `item: IProduct` - товар для добавления

3. `removeItem(itemId: string): void`
- Удаляет товар из корзины по его идентификатору
- Параметры: `itemId: string` - идентификатор удаляемого товара

4. `clear(): void`
- Полностью очищает корзину, удаляя все товары

5. `getTotalAmount(): number`
- Вычисляет общую стоимость всех товаров в корзине
- Возвращаемое значение: `number` - суммарная стоимость товаров

6. `getItemsCount(): number`
- Возвращает количество товаров в корзине
- Возвращаемое значение: `number` - количество товаров

7. `containsItem(itemId: string): boolean`
- Проверяет наличие товара в корзине по его идентификатору
- Параметры: `itemId: string` - идентификатор товара для проверки
- Возвращаемое значение: `boolean` - true если товар есть в корзине, false в противном случае

---

### Класс BuyerModel

Класс отвечает за хранение и валидацию данных покупателя. Позволяет частично или полностью обновлять данные покупателя и проверять их корректность.

**Конструктор:**
```typescript
constructor(initialData: Partial<IBuyer> = {})
```
- `initialData: Partial<IBuyer> = {}` - начальные данные покупателя (по умолчанию пустой объект)

**Поля класса:**
- `_data: Partial<IBuyer>` - приватное поле, хранящее данные покупателя

**Методы класса:**

1. `saveData(data: Partial<IBuyer>): void`
- Сохраняет данные покупателя в модель
- Параметры: `data: Partial<IBuyer>` - данные для сохранения (могут быть частичными)

2. `getData(): Partial<IBuyer>`
- Возвращает все сохраненные данные покупателя
- Возвращаемое значение: `Partial<IBuyer>` - данные покупателя

3. `clear(): void`
- Очищает все данные покупателя

4. `validate(): IBuyerValidationErrors`
- Проверяет валидность всех полей покупателя
- Возвращает объект с ошибками валидации для каждого невалидного поля
- Возвращаемое значение: `IBuyerValidationErrors` - объект с ошибками валидации
- Пример возвращаемого значения: `{payment: 'Не выбран вид оплаты', email: 'Укажите email'}`
   
---

## Слой коммуникации

### Класс ShopApi

Класс отвечает за взаимодействие с API сервера магазина. Использует композицию, делегируя выполнение HTTP-запросов объекту, реализующему интерфейс `IApi`.

**Конструктор:**
```typescript
constructor(api: IApi)
```
- `api: IApi` - объект для выполнения HTTP-запросов

**Поля класса:**
- `api: IApi` - приватное поле, хранящее объект для выполнения HTTP-запросов

**Методы класса:**

1. `getProducts(): Promise<IProduct[]>`
- Выполняет GET запрос на эндпоинт `/product/` для получения каталога товаров
- Возвращаемое значение: `Promise<IProduct[]>` - промис с массивом товаров

2. `createOrder(orderData: object): Promise<object>`
- Выполняет POST запрос на эндпоинт `/order/` для создания заказа
- Параметры: `orderData: object` - данные заказа в формате, соответствующем API сервера
- Возвращаемое значение: `Promise<object>` - промис с ответом сервера

### Типы данных для API

В файле `types/index.ts` добавлены следующие типы:

```typescript
/**
 * Интерфейс ответа сервера с товарами
 * Соответствует формату ответа API магазина 
 */
export interface IProductsResponse {
  total: number;      // Общее количество товаров
  items: IProduct[];  // Массив товаров
}

/**
 * Данные для создания заказа
 */
export interface IOrderData {
  payment: 'card' | 'cash'; // Способ оплаты
  email: string;            // Электронная почта
  phone: string;            // Телефон
  address: string;          // Адрес доставки
  items: string[];          // Общая сумма заказа
  total: number;            // Массив индефикатора товара
}

/**
 * Ответ сервера на создание заказа
 */
export interface IOrderResponse {
  id: string;           // Идентификатор заказа
  total: number;        // Общая сумма заказа
}

```

# Web-ларёк. Документация слоя View

## Базовый компонент

### Component<T>
Абстрактный базовый класс для всех компонентов представления.

**Поля:**
- `container: HTMLElement` — корневой элемент компонента

**Методы:**
- `render(data?: Partial<T>): HTMLElement` — возвращает корневой элемент, опционально обновляет данные
- `setImage(element: HTMLImageElement, src: string, alt?: string): void` — устанавливает изображение с CDN_URL

---

## Модальное окно

### IModalData
- `content: HTMLElement | HTMLElement[]` — контент внутри модалки

### Modal
Наследуется от `Component<IModalData>`

**Поля:**
- `closeButton: HTMLButtonElement` — кнопка закрытия
- `contentEl: HTMLElement` — контейнер для контента

**Методы:**
- `set content(data: HTMLElement)` — устанавливает контент
- `open()` — открывает модалку (добавляет класс `modal_active`)
- `close()` — закрывает модалку (удаляет класс `modal_active`)

**Конструктор:**
```ts
constructor(container: HTMLElement)
```
---

## Шапка

### IHeaderActions
- `counter: number` — количество товаров в корзине

### Header
Наследуется от `Component<{ counter: number }>`

**Поля:**
- `basketButton: HTMLButtonElement` — кнопка открытия корзины
- `countElement: HTMLElement` — элемент счётчика

**Методы:**
- `set counter(value: number)` — обновляет счётчик

**Конструктор:**
```ts
constructor(container: HTMLElement, actions?: IHeaderActions)
```
---

## Корзина

### Basket
Наследуется от `Component<{ items: HTMLElement[]; total: number }>`

**Поля:**
- `listEl: HTMLElement` — контейнер списка товаров
- `totalEl: HTMLElement` — элемент общей суммы
- `buttonEl: HTMLButtonElement` — кнопка оформления

**Методы:**
- `set total(value: number)` — обновляет сумму
- `set items(items: HTMLElement[])` — отрисовывает список товаров

```
```

**Конструктор:**
```ts
constructor(container: HTMLElement, actions?: IBasketActions)
```
---

## Каталог

### GalleryData
- `catalog: HTMLElement[]` — массив карточек товаров

### Gallery / Catalog
Наследуется от `Component<{ catalog: HTMLElement[] }>`

**Поля:**
- `galleryEl: HTMLElement` — контейнер для карточек

**Методы:**
- `set catalog(items: HTMLElement[])` — отрисовывает каталог

**Конструктор:**
```ts
constructor(container: HTMLElement)
```

---

## Формы

### Form<T>
Базовый класс для всех форм. Наследуется от `Component<T>`.

**Поля:**
- `submitButton: HTMLButtonElement` - кнопка отправки
- `errorsEl: HTMLElement` -  элемент для отображения ошибок

**Методы:**
- `set errors(value: string)` — отображает ошибку
- `set valid(state: boolean)` — активирует/деактивирует кнопку

**Конструктор:**
```ts
constructor(container: HTMLFormElement, actions?: IFormActions)
```
---

### OrderForm (форма заказа)
Наследуется от `Form<{ payment: string; address: string }>`

**Поля:**
- `paymentButtons: HTMLButtonElement[]` — кнопки «онлайн» и «при получении»
- `addressInput: HTMLInputElement` — поле ввода адреса

**Методы:**
- `set payment(value: string)` — выделяет активную кнопку (модификатор `button_alt-active`)
- `get address(): string` — устанавливает значение поля адреса
- 'togglePayment(payment: string)' — переключает активную кнопку оплаты

**Конструктор:**
```ts
constructor(container: HTMLFormElement, actions?: IOrderFormActions)
```
---

### ContactsForm (форма контактов)
Наследуется от `Form<{ email: string; phone: string }>`

**Поля:**
- `emailInput: HTMLInputElement` — поле ввода email
- `phoneInput: HTMLInputElement` — поле ввода телефона

**Методы:**
- `set email(): string` — устанавливает значение email
- `set phone(): string` — устанавливает значение телефона

**Конструктор:**
```ts
constructor(container: HTMLFormElement, actions?: IContactsFormActions)
```
---

## Карточки товаров

### Card (базовый)
Абстрактный базовый класс для всех карточек товаров. Наследуется от `Component<T & { title: string; price: number | null }>`.

**Поля:**
- `titleEl: HTMLElement` — элемент названия товара
- `priceEl: HTMLElement` — элемент цены

**Методы:**
- `set title(value: string)`  — устанавливает название товара
- `set price(value: number | null)` — устанавливает цену

**Конструктор:**
```ts
constructor(container: HTMLElement)
```
---

### CardCatalog (карточка в каталоге)
Наследуется от `Card<TCardCatalog>`

**Поля:**
- `categoryEl: HTMLElement` — элемент категории
- `imageEl: HTMLImageElement` — элемент изображения

**Методы:**
- `set category(value: string)` — устанавливает категорию и её цвет через categoryMap
- `set image(value: string)` — устанавливает изображение

**Конструктор:**
```ts
constructor(container: HTMLElement, actions?: { onClick: () => void })
```
---

### CardPreview (карточка в модалке)
Наследуется от `Card<IProduct>`

**Поля:**
- `categoryEl: HTMLElement` — элемент категории
- `imageEl: HTMLImageElement` — элемент изображения
- `buttonEl: HTMLButtonElement` — кнопка действия
- `descriptionEl: HTMLElement` — элемент описания

**Методы:**
- `set category(value: string)` — устанавливает категорию и её цвет через categoryMap
- `set image(value: {src: string, alt: string})` — устанавливает изображение
- `set buttonText(value: string)` — «Купить» / «Удалить из корзины»
- `set buttonDisabled(state: boolean)` — для товаров без цены
- `set description(value: string)`  — устанавливает текст описания

**Конструктор:**
```ts
constructor(container: HTMLElement, actions?: { onAdd: () => void })
```

---

### CardBasket (карточка в корзине)
Наследуется от `Card<TCardBasket>`, где `TCardBasket = Pick<IProduct, 'title' | 'price'> & { index: number }`

**Поля:**
- `indexEl: HTMLElement` — номер товара в списке
- `deleteButton: HTMLButtonElement`  — кнопка удаления 

**Методы:**
- `set index(value: number)` — устанавливает порядковый номер

**Конструктор:**
```ts
constructor(container: HTMLElement, actions?: { onClick: () => void })
```
---