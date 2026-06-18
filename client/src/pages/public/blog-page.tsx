import { Link } from "react-router-dom";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function BlogPage() {
  return (
    <div>
      <PageHero
        eyebrow="Blog"
        title="A future content and insight layer for the SkillBridge platform."
        description="This section is intentionally being added as a reminder for a later phase, where we can build a proper blog and connect it to a CMS without losing focus on the core PRD workflows first."
        primaryCta={{ label: "Back to Home", href: "/" }}
      />

      <section className="px-4 pb-14 sm:px-6 lg:px-8 lg:pb-18">
        <div className="mx-auto max-w-5xl">
          <Card>
            <CardHeader>
              <CardTitle>Planned later</CardTitle>
              <CardDescription>
                The PRD does not require a blog for Phase 1, but this route reserves space for future thought leadership, hiring insights, worker guidance, trust stories, and company updates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
              <p>Possible future content areas:</p>
              <p>- employer education on hiring trusted domestic staff</p>
              <p>- worker onboarding and professionalism guides</p>
              <p>- verification and trust process explainers</p>
              <p>- operational updates and company news</p>
              <p>- SEO-friendly service and market insight articles</p>
              <div className="pt-4">
                <Button asChild variant="outline">
                  <Link to="/contact">Talk to the team about future content</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
