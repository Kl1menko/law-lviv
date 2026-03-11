# Design System

## Загальний напрям

Дизайн має бути:
- стриманий
- сучасний
- чистий
- читацький
- дорогий через пропорції і типографіку, а не через декоративність

## Візуальна ідея

**Чорно-біла або майже монохромна система** з дуже обмеженим акцентним кольором.

## Що має відчувати користувач

- впевненість
- порядок
- професійність
- спокій
- зручність читання

## Що треба уникати

- «AI-looking» секцій з випадковими градієнтами
- занадто трендових ефектів
- складних 3D ілюстрацій
- зайвої анімації
- надміру округлених форм, якщо вони руйнують серйозність бренду

## Кольори

### Base
- background: `#FFFFFF`
- foreground: `#111111`
- muted background: `#F5F5F5`
- border: `#E7E7E7`
- muted text: `#5F5F5F`

### Accent
- один стриманий акцент, наприклад глибокий сірий або темний графіт
- акцент не повинен виглядати як fintech / crypto / AI startup

## Типографіка

### Принцип
Сильна типографіка — головний інструмент стилю.

### Рекомендації
- один display-шрифт або більш виразний serif/sans для заголовків
- один дуже читабельний sans для тексту
- великий акцент на міжрядкові інтервали, ширину рядка, вертикальний ритм

## Сітка

- контентна ширина ~1200–1280px
- вузька текстова колонка для читання статей
- чітка вертикальна ритміка
- великі відступи між секціями

## UI принципи

- максимум ясності
- видимі hover/focus states
- кнопки без перевантаження стилями
- картки прості й акуратні
- форми короткі, зрозумілі, без зайвих полів

## Компоненти

### Базові
- Button
- Container
- Section
- Heading
- RichText
- Badge
- Input
- Textarea
- Select
- Checkbox
- Dialog
- Drawer
- Accordion
- Card
- Breadcrumbs
- Pagination
- ArticleCard
- ServiceCard
- ReviewCard
- FaqAccordion
- LeadForm

## Анімація

- мінімальна
- швидка
- функціональна
- не робити анімацію заради анімації
- Animate UI використовувати sparingly і лише там, де вона додає відчуття акуратної преміальної взаємодії
- рух має бути спокійний, точний, професійний
- уникати playful, startup-like, flashy або чисто декоративних анімацій

### Дозволено
- fade/slide on enter
- subtle hover states
- accordion transitions
- mobile menu transitions
- sheet / dialog / tabs / highlight / auto-height патерни, якщо вони не перевантажують інтерфейс

### Недозволено
- heavy parallax
- великі scroll-driven ефекти на кожній секції
- шумні stagger-анімації по всьому сайту
- анімація H1, довгих абзаців, юридичних пояснень і reading flow статей
- циркові button-анімації, bouncing, overshoot і «product demo» стиль

## Motion usage map

### На публічному сайті
- Header: subtle highlight у меню
- MobileMenu: Animate UI Sheet
- FAQSection: Animate UI Accordion
- LeadDialog: Animate UI Dialog
- ServiceDetails: Collapsible / AutoHeight
- BlogCategoryTabs: Tabs
- CTA buttons: тільки легкий hover/focus, без зайвих ефектів

### В адмінці
- Sidebar mobile: Sheet
- Delete / publish confirm: Dialog
- SEO preview panels: Collapsible
- Tabbed edit form: Tabs
  - Основне
  - SEO
  - FAQ
  - Пов’язані статті

## Фотостиль

- реальні, стримані фото
- без типових «усміхнених кол-центрів»
- без абстрактних AI-портретів
- якщо немає сильних фото, краще мінімалістичний текстовий дизайн, ніж слабкі стоки

## Правило чистоти

Кожна сторінка має виглядати так, ніби її робив сильний дизайнер продукту, а не генератор шаблонів.
