# Klimenko & CO

Сайт юридичної компанії у Львові на `Next.js + PostgreSQL + Prisma + Auth.js` з компактною власною адмінкою, локальним SEO-шаром і контентною моделлю без повноцінного CMS.

## Що це за проєкт

Проєкт покриває:

- публічний сайт компанії
- окремі сторінки послуг
- блог на markdown
- FAQ, відгуки, контакти, вартість, статичні сторінки
- локальні SEO-сторінки `/lviv/[slug]`
- внутрішню адмінку для керування контентом

Дизайн і UX орієнтовані на спокійний, редакторський, credible legal style без шаблонного landing-page шуму.

## Технології

- `Next.js 16` App Router
- `React 19`
- `TypeScript`
- `Prisma 7`
- `PostgreSQL 15`
- `Auth.js / NextAuth`
- `Tailwind CSS 4`

## Що вже реалізовано

### Public site

- головна `/`
- про компанію `/pro-kompaniyu`
- послуги `/poslugy`
- сторінка послуги `/poslugy/[slug]`
- блог `/blog`
- сторінка статті `/blog/[slug]`
- FAQ `/faq`
- контакти `/kontakty`
- вартість `/vartist-poslug`
- відгуки `/vidguky`
- локальні SEO-сторінки `/lviv/[slug]`
- `metadata` на публічних сторінках
- `JSON-LD` там, де це доречно
- `sitemap.xml` і `robots.txt`

### Admin

- dashboard `/admin`
- settings
- services
- articles
- FAQ
- reviews
- leads
- CRM і операційні шаблони
- SEO pages
- створення нових `service` і `article`
- редагування через server actions

## Поточний стан адмінки

Backend для auth уже є:

- credentials provider у `Auth.js`
- seeded admin user
- API route `app/api/auth/[...nextauth]/route.ts`
- login form на `/admin/login`
- middleware-захист для `/admin`
- перевірка сесії в admin layout і server actions

Операційний блок адмінки теж уже працює:

- таблиця звернень з відповідальним, внутрішніми примітками і підсумком первинного опитування
- статуси звернень `Нове / У роботі / Закрите`
- шаблони первинного опитування клієнта
- шаблони відповідей у месенджерах
- правила передачі ліда від помічника адвокату
- журнал консультацій
- шаблон брифу по справі

## Швидкий старт локально

### 1. Встановити залежності

```bash
npm install
```

### 2. Налаштувати `.env`

Створи `.env` на основі `.env.example`.

Приклад:

```env
DATABASE_URL="postgresql://maxberry:1111@localhost:5432/law_lviv?schema=public"
NEXTAUTH_SECRET="replace-with-a-long-random-string"
NEXTAUTH_URL="http://localhost:3000"
CONTACT_EMAIL="office@example.com"
```

Якщо пароль у локального Postgres user відсутній, рядок може виглядати так:

```env
DATABASE_URL="postgresql://maxberry@localhost:5432/law_lviv?schema=public"
```

### 3. Підняти PostgreSQL

Якщо встановлено через Homebrew:

```bash
brew services start postgresql@15
```

### 4. Створити базу

```bash
createdb law_lviv
```

### 5. Згенерувати Prisma client, прогнати міграцію і seed

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 6. Запустити dev server

```bash
npm run dev
```

## Корисні команди

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:studio
```

## Seed і тестові дані

Після `npm run db:seed` база отримує:

- `GlobalSettings`
- default admin user
- стартові services
- стартові articles
- FAQ
- reviews
- SEO landing pages
- static pages
- admin templates для CRM-процесу
- consultation records

### Default admin credentials

За замовчуванням seed використовує:

- email: `admin@klimenko.law`
- password: `ChangeMe123!`

Їх можна перевизначити перед seed через env:

```env
ADMIN_SEED_EMAIL="..."
ADMIN_SEED_PASSWORD="..."
ADMIN_SEED_NAME="..."
```

## Як зайти в адмінку

### Поточний практичний стан

1. Відкрий `/admin/login`
2. Увійди seeded credentials
3. Після входу працюй з розділами:
   - `/admin`
   - `/admin/settings`
   - `/admin/services`
   - `/admin/articles`
   - `/admin/faq`
   - `/admin/reviews`
   - `/admin/leads`
   - `/admin/crm`
   - `/admin/seo-pages`

### Що треба знати

- без сесії `/admin` маршрути редіректять на `/admin/login`
- вихід з адмінки доступний через кнопку `Вийти` в admin header
- seeded admin credentials за замовчуванням: `admin@klimenko.law / ChangeMe123!`

## Основні публічні маршрути

- `/`
- `/pro-kompaniyu`
- `/poslugy`
- `/poslugy/[slug]`
- `/blog`
- `/blog/[slug]`
- `/faq`
- `/kontakty`
- `/vartist-poslug`
- `/vidguky`
- `/lviv/[slug]`

## Контентна модель

Проєкт зараз працює через PostgreSQL/Prisma, без зовнішнього CMS.

Основні сутності:

- `GlobalSettings`
- `Service`
- `Article`
- `FaqItem`
- `Review`
- `Lead`
- `Consultation`
- `AdminTemplate`
- `SeoLandingPage`
- `StaticPage`
- `AdminUser`

## Як працювати з CRM-блоком

Маршрут: `/admin/crm`

Що там є:

- `Опитування` — редагування шаблону первинного опитування клієнта
- `Повідомлення` — готові шаблони для Telegram / Viber / WhatsApp
- `Передача ліда` — правила handoff і шаблон брифу по справі
- `Консультації` — календарний журнал консультацій з прив'язкою до звернення

Рекомендований мінімальний процес:

1. Новий лід приходить через форму на сайті і з'являється в `/admin/leads`
2. Помічник оновлює статус, заповнює `Відповідальний`, `Підсумок опитування` і `Внутрішні примітки`
3. Якщо домовились про дзвінок або зустріч, консультація додається в `/admin/crm`
4. Для передачі адвокату використовуються шаблон handoff і шаблон брифу
5. Після завершення роботи по зверненню статус змінюється на `Закрите`

Репозиторії зібрані в [lib/content/repositories.ts](/Users/maxberry/Dev/law-lviv/lib/content/repositories.ts#L1).

## Де що лежить

- `app/` — маршрути сайту й адмінки
- `components/` — UI, layout, content, admin components
- `lib/` — prisma, auth, metadata, repositories, SEO helpers
- `prisma/` — schema, migrations, seed
- `AI/` — внутрішні product/architecture docs

## Що перевірити після запуску

Мінімальний smoke test:

- `/`
- `/blog`
- `/blog/yak-podaty-na-rozluchennya-u-lvovi`
- `/poslugy/simeynyy-advokat-lviv`
- `/lviv/simeynyy-advokat-lviv`
- `/admin`
- контактна форма на `/kontakty`

## Відомі обмеження

- production QA треба ще пройти окремо на `build`, forms, mobile і runtime flows

## Наступні логічні кроки

- добити production QA
- розширити контент до повнішого стартового набору
- пройти фінальний polish перед деплоєм
