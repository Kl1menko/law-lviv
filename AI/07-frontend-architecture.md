# Frontend Architecture

## Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui для базових примітивів, якщо доречно
- PostgreSQL
- Prisma
- Auth.js

## App structure

```txt
app/
  (site)/
    page.tsx
    pro-kompaniyu/page.tsx
    poslugy/page.tsx
    poslugy/[slug]/page.tsx
    blog/page.tsx
    blog/[slug]/page.tsx
    faq/page.tsx
    kontakty/page.tsx
    vartist-poslug/page.tsx
    vidguky/page.tsx
    lviv/[slug]/page.tsx
    privacy-policy/page.tsx
    terms/page.tsx
  admin/
    login/page.tsx
    page.tsx
    articles/page.tsx
    articles/new/page.tsx
    articles/[id]/page.tsx
    services/page.tsx
    services/new/page.tsx
    services/[id]/page.tsx
    faq/page.tsx
    reviews/page.tsx
    leads/page.tsx
    seo-pages/page.tsx
    settings/page.tsx
  api/
    revalidate/route.ts
    upload/route.ts
    contact/route.ts
components/
lib/
prisma/
content/
AI/
```

## Архітектурні правила

1. За замовчуванням використовуй **Server Components**.
2. `use client` тільки там, де справді потрібна інтерактивність.
3. Дані з БД отримуй ближче до серверного шару.
4. Не тягни зайві клієнтські бібліотеки.
5. Повторювані секції винось у reusable components.
6. Не дублюй логіку SEO по всіх сторінках вручну.
7. Усі сторінки мають мати генерацію metadata.

## Data fetching

* публічні сторінки: server-side fetching
* статті та послуги: готувати до pre-render / cache / revalidate
* адмінка: server actions або route handlers залежно від сценарію

## Metadata

На кожній сторінці:

* `generateMetadata` або спільний metadata builder
* title
* description
* canonical
* open graph
* twitter card при потребі

## JSON-LD

Реалізувати helper-утиліти:

* `buildOrganizationJsonLd()`
* `buildServiceJsonLd()`
* `buildArticleJsonLd()`
* `buildFaqJsonLd()`
* `buildBreadcrumbJsonLd()`

## Caching and revalidation

* для контентних сторінок використовувати контрольоване revalidation
* після змін у адмінці — точковий revalidate по slug/route
* не робити повний rebuild через кожну дрібницю

## Forms

* форми короткі
* серверна валідація обов’язкова
* anti-spam захист обов’язковий
* показувати стани loading / success / error

## Accessibility

* семантична HTML-структура
* keyboard navigation
* focus-visible
* aria-атрибути там, де потрібно
* контрастність не нижче адекватного мінімуму

## Article rendering

* markdown/MDX renderer
* стилі для prose-контенту окремо продумані
* підтримати: h2, h3, lists, blockquote, links, tables, note blocks

## Не робити

* монолітні page.tsx по 500–1000 рядків
* хаотичний client-side fetching для SEO-сторінок
* інлайнові стилі без потреби
* дублікати компонентів з мікрозмінами
