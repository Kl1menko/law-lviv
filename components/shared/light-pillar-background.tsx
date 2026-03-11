type LightPillarBackgroundProps = {
  className?: string;
  variant?: "panel" | "page";
};

export function LightPillarBackground({
  className,
  variant = "panel",
}: LightPillarBackgroundProps) {
  const isPage = variant === "page";

  return (
    <div aria-hidden="true" className={className}>
      {isPage ? (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_54%_0%,rgba(17,17,17,0.014),transparent_40%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_14%,rgba(17,17,17,0.03),transparent_24%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,17,17,0.016),transparent_22%,transparent_100%)]" />
          <div className="absolute right-[8%] top-[-10%] h-[54rem] w-[3.25rem] rounded-full bg-[#111111]/[0.08] blur-[96px] motion-safe:animate-light-pillar-drift sm:h-[72rem] sm:w-[4rem]" />
          <div className="absolute right-[13%] top-[6%] h-[40rem] w-[2rem] rounded-full bg-[#111111]/[0.06] blur-[82px] motion-safe:animate-light-pillar-drift sm:h-[56rem] sm:w-[2.6rem]" />
          <div className="absolute right-[3%] top-[2%] h-[38rem] w-[5rem] rounded-full bg-[#111111]/[0.04] blur-[118px]" />
          <div className="absolute right-[0%] top-[10%] h-[42rem] w-[16rem] rounded-full bg-[#111111]/[0.02] blur-[180px]" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(17,17,17,0.048),transparent_34%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(17,17,17,0.02),transparent_56%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(17,17,17,0.14),transparent)]" />
          <div className="absolute right-[-2%] top-[-20%] h-[32rem] w-[6rem] rounded-full bg-[#111111]/[0.12] blur-[108px] motion-safe:animate-light-pillar-drift sm:h-[44rem] sm:w-[7rem]" />
        </>
      )}
    </div>
  );
}
