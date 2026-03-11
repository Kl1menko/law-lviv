# AGENTS.md

## Project identity

- Project: Klimenko & CO
- Domain focus: legal services
- Local SEO focus: Lviv
- Stack: Next.js + PostgreSQL + Prisma + Auth.js + custom admin

## Hard rules

1. Use App Router.
2. Prefer Server Components.
3. Use PostgreSQL + Prisma for content.
4. Articles use markdown/MDX or a lightweight block editor only.
5. Do not introduce a full CMS.
6. Keep design minimal, editorial, and credible.
7. Every public page must have metadata.
8. Add structured data where relevant.
9. Optimize for SEO, readability, and conversion.
10. Keep admin compact and task-focused.

## Design direction

Minimal black-and-white aesthetic.
No gaudy luxury-law clichés.
No generic AI-generated landing-page feel.

## Motion rules

Use Animate UI sparingly and only where interaction polish adds clarity.
Motion must feel calm, precise, and professional.
Avoid flashy, playful, startup-like, or decorative animation.
Do not animate H1 headings, long legal copy, article reading flow, or core trust content.

Preferred Animate UI patterns:
- accordion
- sheet
- dialog
- tabs
- highlight
- auto-height

## Before coding

Read all files in `/AI`.

## When unsure

Choose the simpler architecture that fits the existing docs.
