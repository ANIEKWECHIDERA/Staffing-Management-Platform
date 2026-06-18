import { PageHero } from "@/components/page-hero";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { workerBenefits } from "@/data/site";

export function WorkersPage() {
  return (
    <div>
      <PageHero
        eyebrow="For Workers"
        title="A professional application path into a trusted staffing system."
        description="Workers can enter the platform through a cleaner flow that respects the seriousness of domestic staffing and the importance of complete records."
        primaryCta={{ label: "Apply as Worker", href: "/apply" }}
      />

      <section className="px-4 pb-14 sm:px-6 lg:px-8 lg:pb-18">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
          {workerBenefits.map((benefit) => (
            <Card key={benefit}>
              <CardHeader>
                <CardTitle className="text-lg">Worker pathway</CardTitle>
                <CardDescription>{benefit}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
