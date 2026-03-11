import { Container } from "@/components/layout/container";

type HomeHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function HomeHero({ eyebrow, title, description }: HomeHeroProps) {
  return (
    <section className="relative isolate overflow-hidden border-b border-[var(--border)] bg-[var(--background)] pb-12 pt-10 sm:pb-14 sm:pt-12">
      <Container>
        <div className="grid min-h-[auto] gap-8 sm:gap-10 lg:min-h-[34rem] lg:grid-cols-[1.7fr_0.5fr] lg:items-start">
          <div className="space-y-4 sm:space-y-5">
            {eyebrow ? (
              <p className="text-xs uppercase tracking-[0.24em] text-black/62">{eyebrow}</p>
            ) : null}
            <h1 className="max-w-[11ch] font-serif text-[2.7rem] leading-[0.9] tracking-tight text-[#111111] sm:max-w-[15ch] sm:text-6xl lg:max-w-[18ch] lg:text-[6rem]">
              {title}
            </h1>
          </div>
          <p className="max-w-[24rem] text-base leading-8 text-black/72 sm:max-w-[28rem] sm:text-lg lg:self-end lg:pb-12">
            {description}
          </p>
        </div>
      </Container>
    </section>
  );
}
