# Библиотека - Управление книгами

Веб-приложение для управления библиотекой книг с различными ролями пользователей.

## Функциональность

### Аутентификация и роли пользователей
- Страница входа в систему
- Две роли пользователей:
  - Admin: полный доступ к управлению книгами
  - User: просмотр книг и добавление комментариев

### Управление книгами
- Просмотр списка всех книг
- Поиск книг по названию, автору или жанру
- Детальная информация о книге
- Добавление новых книг (для администраторов)
- Редактирование и удаление книг (для администраторов)
- Добавление комментариев к книгам

## Технологии

### Backend
- Node.js
- Express.js
- MongoDB
- JWT для аутентификации

### Frontend
- React
- Material-UI
- React Router
- Axios

## Установка и запуск

### Backend
1. Установите зависимости:
```bash
npm install
```

2. Создайте файл .env в корневой директории с следующими переменными:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=3000
```

3. Запустите сервер:
```bash
npm start
```

### Frontend
1. Перейдите в директорию client:
```bash
cd client
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите клиентское приложение:
```bash
npm start
```

## API Endpoints

### Аутентификация
- POST /api/auth/login - вход в систему
- POST /api/auth/register - регистрация нового пользователя

### Книги
- GET /api/books - получение списка всех книг
- GET /api/books/:id - получение информации о конкретной книге
- POST /api/books - добавление новой книги (только для администраторов)
- PUT /api/books/:id - обновление информации о книге (только для администраторов)
- DELETE /api/books/:id - удаление книги (только для администраторов)

### Комментарии
- POST /api/books/:id/comments - добавление комментария к книге
- GET /api/books/:id/comments - получение комментариев к книге

## Структура проекта

```
.
├── client/                 # Frontend React приложение
│   ├── src/
│   │   ├── components/    # React компоненты
│   │   ├── App.js        # Главный компонент приложения
│   │   └── index.js      # Точка входа
│   └── package.json
├── controllers/           # Контроллеры для обработки запросов
├── models/               # Mongoose модели
├── routes/              # Маршруты API
├── middlewares/         # Промежуточное ПО
├── config/             # Конфигурационные файлы
└── package.json
```

---

## 📚 Praktika3 – Backend API для управления каталогом книг

Здесь начинается твоя история.
Мир книг уже выбрал тебя 📚
Добро пожаловать в библиотеку, где каждая страница — это новое приключение,
а каждый герой — отражение твоей души.


Проект реализует полноценный RESTful API с использованием **Node.js**, **Express** и **Sequelize ORM**. Он позволяет управлять книгами, авторами, категориями и поддерживает авторизацию с ролями (админ/пользователь).

---

## 🚀 Запуск проекта

```bash
npm install
npm run dev
```

Создание базы, миграции и сидеры:

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

---

## 📌 Скрипты (из package.json)

| Команда           | Описание                                   |
|-------------------|---------------------------------------------|
| `npm run dev`     | Запускает сервер с `nodemon`                |
| `npm run fix-seq` | Сбрасывает sequence для `Books` и `Authors` |

---

## 🔐 Авторизация

- Регистрация: `POST /auth/signup`
- Вход: `POST /auth/signin`

**👑 Админ по умолчанию (через сидер):**
```json
{
  "email": "admin@example.com",
  "password": "123456"
}
```

После входа вы получите JWT токен — добавьте его в Swagger (кнопка "Authorize") или в Thunder Client.

---

## 📘 Swagger документация

Swagger-документация
Документация API доступна по адресу:

🔗 http://localhost:3000/api-docs

🧰 Что можно делать через Swagger UI:
📂 Просматривать все доступные эндпоинты:

/auth/signup, /auth/signin

/books, /authors, /categories

📝 Отправлять запросы прямо из браузера

🔐 Авторизоваться с помощью JWT (кнопка Authorize)

📥 Отправлять тело запросов (например, создавать книгу или категорию)

📤 Смотреть примерные ответы сервера

📦 Видеть схемы объектов (Book, Author, Category, User)

---

## 📂 Структура проекта

```
├── app.js
├── server.js
├── controllers/
├── middlewares/
├── migrations/
├── models/
├── routes/
├── seeders/
├── scripts/
│   └── fix-sequence.js
├── swagger.js
├── .env
└── README.md
```

---

## 📄 Модели и связи

### 📚 Book
- `id`, `title`, `publication_year`, `category_id`
- `many-to-many` → `Author`
- `many-to-one` → `Category`

### ✍️ Author
- `id`, `first_name`, `last_name`
- `many-to-many` → `Book`

### 🗂 Category
- `id`, `name`
- `one-to-many` → `Book`

---

## 🔁 API Endpoints

### 📚 Books
- `GET /books` — Получить все книги
  - Параметры запроса:
    - `page` (опционально) - номер страницы (по умолчанию 1)
    - `limit` (опционально) - количество книг на странице (по умолчанию 10)
  - Ответ включает:
    - `books` - массив книг
    - `total` - общее количество книг
    - `currentPage` - текущая страница
    - `totalPages` - общее количество страниц
- `GET /books/:id` — Получить книгу по ID
- `POST /books` — Создать книгу (🔐 admin)
- `PUT /books/:id` — Обновить книгу (🔐 admin)
- `DELETE /books/:id` — Удалить книгу (🔐 admin)
- `GET /books/search?title=&author=&category=` — Поиск
  - Параметры запроса:
    - `title` (опционально) - поиск по названию
    - `author` (опционально) - поиск по автору
    - `category` (опционально) - поиск по категории
    - `page` (опционально) - номер страницы (по умолчанию 1)
    - `limit` (опционально) - количество книг на странице (по умолчанию 10)
  - Ответ включает:
    - `books` - массив найденных книг
    - `total` - общее количество найденных книг
    - `currentPage` - текущая страница
    - `totalPages` - общее количество страниц

### ✍️ Authors
- `GET /authors` — Все авторы
- `POST /authors` — Создать автора (🔐 admin)
- `PUT /authors/:id` — Обновить (🔐 admin)
- `DELETE /authors/:id` — Удалить (🔐 admin)

### 🗂 Categories
- `GET /categories` — Все категории
- `POST /categories` — Создать (🔐 admin)
- `DELETE /categories/:id` — Удалить (🔐 admin)

---

## 🔧 Скрипт `fix-sequence.js`

Исправляет `id` в таблицах `Books` и `Authors`, чтобы не было конфликтов при ручном добавлении данных.

📦 Запуск:

```bash
npm run fix-seq
```

---

## ✅ Проверка готовности

✔ CRUD для книг, авторов, категорий  
✔ Поиск по фильтрам  
✔ Пагинация и сортировка результатов  
✔ JWT авторизация и роли  
✔ Swagger UI  
✔ PostgreSQL через Sequelize  
✔ Миграции и сидеры  
✔ Скрипт для sequence  
✔ ThunderClient + Swagger протестированы  

---

