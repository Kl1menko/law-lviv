import { Accordion } from "@/components/ui/accordion";

type FaqItem = {
  id?: string;
  question: string;
  answer: string;
  category?: string;
};

type FaqListProps = {
  items: FaqItem[];
};

export function FaqList({ items }: FaqListProps) {
  return <Accordion items={items.map((item, index) => ({ id: item.id ?? String(index), title: item.question, content: item.answer }))} />;
}
