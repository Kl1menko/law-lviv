# Content Model

Весь контент, окрім статей, зберігати у PostgreSQL як структуровані поля.
Статті — markdown/MDX або block editor, який зберігає markdown-подібну структуру.

## Основні сутності

### 1. AdminUser
- id
- name
- email
- passwordHash
- role
- isActive
- createdAt
- updatedAt

### 2. Service
- id
- title
- slug
- shortDescription
- heroTitle
- heroDescription
- intro
- audience
- problemsSolved
- processSteps
- benefits
- faqItems
- relatedArticleIds
- seoTitle
- seoDescription
- seoKeywords
- ogImage
- canonicalUrl
- status (`draft` | `published`)
- sortOrder
- createdAt
- updatedAt

### 3. Article
- id
- title
- slug
- excerpt
- coverImage
- category
- tags
- authorName
- publishedAt
- readingTime
- contentMarkdown
- seoTitle
- seoDescription
- seoKeywords
- ogImage
- canonicalUrl
- status (`draft` | `published`)
- createdAt
- updatedAt

### 4. FaqItem
- id
- question
- answer
- category
- relatedServiceId
- sortOrder
- isFeatured
- createdAt
- updatedAt

### 5. Review
- id
- clientName
- source
- text
- rating
- isFeatured
- sortOrder
- createdAt
- updatedAt

### 6. Lead
- id
- name
- phone
- email
- message
- sourcePage
- sourceType
- status (`new` | `in_progress` | `closed`)
- createdAt
- updatedAt

### 7. SeoLandingPage
- id
- title
- slug
- location (`lviv`)
- heroTitle
- heroDescription
- intro
- contentSections
- faqItems
- relatedServiceIds
- relatedArticleIds
- seoTitle
- seoDescription
- seoKeywords
- ogImage
- canonicalUrl
- status
- createdAt
- updatedAt

### 8. GlobalSettings
- id
- companyName
- legalName
- phonePrimary
- phoneSecondary
- emailPrimary
- address
- city
- region
- workHours
- googleMapsUrl
- telegramUrl
- viberUrl
- whatsappUrl
- youtubeUrl
- facebookUrl
- instagramUrl
- defaultSeoTitle
- defaultSeoDescription
- defaultOgImage
- createdAt
- updatedAt

### 9. StaticPage
- id
- key
- title
- intro
- bodySections
- seoTitle
- seoDescription
- seoKeywords
- status
- updatedAt

## Статті: формат контенту

### Варіант за замовчуванням
`contentMarkdown` + рендер у Next.js.

### Допустимо
- markdown
- MDX тільки якщо справді потрібні вбудовані React-компоненти в статті

### Недопустимо на старті
- складний custom page builder
- важкий rich text editor з десятками нестандартних блоків

## Принцип моделювання

Якщо блок контенту повторюється на різних сторінках, винеси його в окрему структуру або компонент, а не дублюй вручну.
