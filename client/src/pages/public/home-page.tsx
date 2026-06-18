import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { homeHighlights, services, trustPillars, websiteStats } from "@/data/site";

export function HomePage() {
  return (
    <div>
      <PageHero
        eyebrow="Public Entrance"
        title="Trusted domestic staffing for households, businesses, and organizations."
        description="SkillBridge OS is the front door into a high-trust staffing operation. Employers can submit structured requests, workers can apply into the system, and the internal team can run everything with speed and clarity."
        primaryCta={{ label: "Request Staff", href: "/request-staff" }}
        secondaryCta={{ label: "Apply as Worker", href: "/apply" }}
        aside={
          <Card className="overflow-hidden bg-[linear-gradient(160deg,#ffffff_0%,#f4ece4_100%)]">
            <CardHeader>
              <div className="inline-flex w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-accent-foreground">
                Verification-first operation
              </div>
              <CardTitle className="text-2xl">The public site is the calm front layer of a serious internal engine.</CardTitle>
              <CardDescription>
                It should feel trustworthy, premium, warm, and operationally credible from the first screen.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {websiteStats.map((stat) => (
                <div key={stat.label} className="rounded-[1.3rem] border bg-card/80 p-4">
                  <div className="text-2xl font-semibold">{stat.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        }
      />

      <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {homeHighlights.map((item) => (
            <Card key={item.title} className="bg-card/90">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                  <item.icon className="h-5 w-5" />
                </div>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">Service categories</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Specialized staffing categories built around real operational demand.</h2>
            </div>
            <Button asChild variant="outline">
              <Link to="/services">
                Explore all services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <Card key={service.title} className="bg-card/90">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-secondary">
                    <service.icon className="h-5 w-5" />
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary px-4 py-14 text-primary-foreground sm:px-6 lg:px-8 lg:py-18">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.95fr]">
          <div className="space-y-5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#ffbea8]">Trust and verification</div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              The public promise is backed by operational rigor.
            </h2>
            <p className="max-w-2xl text-base leading-7 text-primary-foreground/75">
              SkillBridge does not present random listings. It builds confidence through structured worker intake, verification, references, and placement readiness.
            </p>
          </div>
          <Card className="border-white/10 bg-white/6 text-primary-foreground shadow-none">
            <CardContent className="space-y-4 p-6">
              {trustPillars.map((pillar) => (
                <div key={pillar} className="flex gap-3 rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#ffbea8]" />
                  <p className="text-sm leading-6 text-primary-foreground/80">{pillar}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="mx-auto max-w-7xl">
          <Card className="overflow-hidden bg-[linear-gradient(140deg,#f6ddd3_0%,#fff7f3_55%,#f0ece3_100%)]">
            <CardContent className="flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl space-y-3">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">Next step</div>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Choose your path into the platform.
                </h2>
                <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                  Employers can submit a structured request. Workers can begin a clean, trust-building application.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link to="/request-staff">Request Staff</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/apply">Apply as Worker</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
