type PlaceholderItem = {
  title: string;
  body: string;
};

type PlaceholderGridProps = {
  items: PlaceholderItem[];
};

export function PlaceholderGrid({ items }: PlaceholderGridProps) {
  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <article key={item.title} className="rounded-[28px] border border-[var(--border)] p-6">
          <h2 className="font-serif text-2xl tracking-tight">{item.title}</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">{item.body}</p>
        </article>
      ))}
    </section>
  );
}
