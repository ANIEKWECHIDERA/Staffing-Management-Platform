import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { employerBenefits } from "@/data/site";
import { Link } from "react-router-dom";

export function EmployersPage() {
  return (
    <div>
      <PageHero
        eyebrow="For Employers"
        title="A more confident hiring path for homes, businesses, and organizations."
        description="Employers should not need to manage domestic staffing through scattered chats and uncertain records. SkillBridge turns staffing needs into a clear request, shortlist, and placement flow."
        primaryCta={{ label: "Request Staff", href: "/request-staff" }}
      />

      <section className="px-4 pb-14 sm:px-6 lg:px-8 lg:pb-18">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
          {employerBenefits.map((benefit) => (
            <Card key={benefit}>
              <CardHeader>
                <CardTitle className="text-lg">Employer advantage</CardTitle>
                <CardDescription>{benefit}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-primary px-4 py-14 text-primary-foreground sm:px-6 lg:px-8 lg:py-18">
        <div className="mx-auto max-w-7xl">
          <Card className="border-white/10 bg-white/6 text-primary-foreground shadow-none">
            <CardContent className="grid gap-6 p-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#ffbea8]">What happens next</div>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Submit the request and let the internal team turn it into a real workflow.</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-primary-foreground/75 sm:text-base">
                  The backend and internal app are built to capture role type, location, arrangement, employment type, salary range, start date, and requirements in a structured way.
                </p>
              </div>
              <Button asChild size="lg" variant="secondary">
                <Link to="/request-staff">Start a staffing request</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
