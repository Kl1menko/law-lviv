type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">{eyebrow}</p> : null}
      <h2 className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-7 text-[var(--muted-foreground)]">{description}</p> : null}
    </div>
  );
}
