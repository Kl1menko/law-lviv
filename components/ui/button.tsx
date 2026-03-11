import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type BaseButtonProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

type ButtonAsButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type ButtonAsLinkProps = BaseButtonProps & { href: ComponentProps<typeof Link>["href"] };

function isLinkButton(props: ButtonAsButtonProps | ButtonAsLinkProps): props is ButtonAsLinkProps {
  return "href" in props;
}

function getButtonClasses(variant: ButtonVariant, size: ButtonSize) {
  return cn(
    "inline-flex items-center justify-center rounded-full border text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-60",
    variant === "primary" && "border-[var(--foreground)] bg-[var(--foreground)] !text-white hover:bg-[var(--accent)] hover:!text-white",
    variant === "secondary" && "border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-[var(--muted)]",
    variant === "ghost" && "border-transparent bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)]",
    size === "sm" && "min-h-10 px-4",
    size === "md" && "min-h-11 px-5",
    size === "lg" && "min-h-12 px-6",
  );
}

export function Button(props: ButtonAsButtonProps | ButtonAsLinkProps) {
  const { children, className, variant = "primary", size = "md" } = props;

  const classes = cn(getButtonClasses(variant, size), className);

  if (isLinkButton(props)) {
    const { href } = props;

    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const buttonProps = { ...(props as ButtonAsButtonProps) };

  delete buttonProps.children;
  delete buttonProps.className;
  delete buttonProps.variant;
  delete buttonProps.size;

  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
