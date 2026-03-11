import Link from "next/link";

import { Container } from "@/components/layout/container";

export default function NotFound() {
  return (
    <Container className="flex min-h-screen flex-col items-start justify-center gap-6 py-20">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">404</p>
      <h1 className="font-serif text-5xl tracking-tight">Сторінку не знайдено</h1>
      <p className="max-w-xl text-[var(--muted-foreground)]">
        Посилання може бути застарілим або сторінка ще не реалізована в поточній фазі.
      </p>
      <Link href="/" className="rounded-full bg-[var(--foreground)] px-5 py-3 text-sm text-white">
        На головну
      </Link>
    </Container>
  );
}
