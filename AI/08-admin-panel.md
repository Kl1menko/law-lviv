# Admin Panel

## Принцип

Це **не універсальна CMS**, а компактна внутрішня панель для керування контентом конкретного сайту.

## Доступ

- тільки для адміністраторів
- через Auth.js
- credentials login на старті достатньо
- захищені роуты `/admin/*`

## Розділи адмінки

### 1. Dashboard
- коротка статистика
- останні заявки
- чернетки статей
- швидкі переходи

### 2. Articles
- список статей
- пошук
- фільтр по статусу
- створення
- редагування
- preview
- publish/unpublish

### 3. Services
- список послуг
- сортування
- редагування SEO
- FAQ всередині послуги
- пов’язані статті

### 4. FAQ
- список питань
- категорії
- прив’язка до послуг

### 5. Reviews
- список відгуків
- featured toggle
- сортування

### 6. Leads
- список заявок
- статуси
- фільтри
- перегляд деталей

### 7. SEO pages
- створення локальних посадкових сторінок
- SEO поля
- зв’язки з послугами і статтями

### 8. Settings
- контакти
- соцмережі
- адреса
- default SEO
- глобальні тексти

## Правила UX адмінки

- форми не повинні бути перевантажені
- поля групувати логічно
- мати sticky actions panel або зручну верхню панель
- важливі статуси видно одразу
- slug можна генерувати, але редагувати вручну теж можна
- mobile sidebar реалізувати через Sheet
- confirm дії publish/delete реалізувати через стриманий Dialog
- SEO preview panels зручно згортати через Collapsible
- великі edit screens розкладати на Tabs: `Основне`, `SEO`, `FAQ`, `Пов’язані статті`

## Поля статті

### Основні
- title
- slug
- excerpt
- cover image
- category
- tags
- content
- publishedAt
- status

### SEO
- seoTitle
- seoDescription
- seoKeywords
- ogImage
- canonicalUrl

## Поля послуги

### Основні
- title
- slug
- hero title
- hero description
- short description
- intro
- audience
- problems solved
- process steps
- benefits
- related articles
- FAQ
- status

### SEO
- seoTitle
- seoDescription
- seoKeywords
- ogImage
- canonicalUrl

## Editor strategy

### Для статей
- markdown textarea або легкий block editor
- preview mode обов’язково

### Для решти контенту
- структуровані input/textarea/repeater поля

## Медіа

### MVP
- просте завантаження image file
- збереження URL/path
- alt text поле

### Не робити одразу
- складну бібліотеку медіа з тегами, папками, трансформаціями

## Audit trail

На старті достатньо:
- `updatedAt`
- `updatedBy` за можливості
