import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  aside?: ReactNode;
  className?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  aside,
  className,
}: PageHeroProps) {
  return (
    <section className={cn("px-4 py-14 sm:px-6 lg:px-8 lg:py-20", className)}>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-6">
          <div className="text-xs font-semibold uppercase tracking-[0.26em] text-secondary">{eyebrow}</div>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">{title}</h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
          </div>
          {(primaryCta || secondaryCta) && (
            <div className="flex flex-col gap-3 sm:flex-row">
              {primaryCta ? (
                <Button asChild size="lg">
                  <Link to={primaryCta.href}>{primaryCta.label}</Link>
                </Button>
              ) : null}
              {secondaryCta ? (
                <Button asChild variant="outline" size="lg">
                  <Link to={secondaryCta.href}>{secondaryCta.label}</Link>
                </Button>
              ) : null}
            </div>
          )}
        </div>
        {aside ? <div>{aside}</div> : null}
      </div>
    </section>
  );
}
