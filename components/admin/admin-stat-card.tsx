import { Card } from "@/components/ui/card";

type AdminStatCardProps = {
  label: string;
  value: string | number;
  note?: string;
};

export function AdminStatCard({ label, value, note }: AdminStatCardProps) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">{label}</p>
      <p className="mt-3 font-serif text-4xl tracking-tight">{value}</p>
      {note ? <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">{note}</p> : null}
    </Card>
  );
}
