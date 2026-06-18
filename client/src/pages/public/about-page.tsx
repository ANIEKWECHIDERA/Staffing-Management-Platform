import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHero } from "@/components/page-hero";

const principles = [
  {
    title: "Trust",
    description: "Domestic staffing is a high-trust category. The product must communicate seriousness, verification, and dependability.",
  },
  {
    title: "Structure",
    description: "The system replaces scattered memory and chat threads with records, workflows, statuses, and clearer operational steps.",
  },
  {
    title: "Speed",
    description: "The goal is not bureaucracy. It is faster capture, faster verification, faster matching, and faster placement with less friction.",
  },
];

export function AboutPage() {
  return (
    <div>
      <PageHero
        eyebrow="About"
        title="SkillBridge OS exists to turn a people-driven staffing business into a trustworthy operating system."
        description="The platform is designed around the real-world needs of domestic staffing: worker trust, employer confidence, operational clarity, and faster placement decisions."
      />

      <section className="px-4 pb-14 sm:px-6 lg:px-8 lg:pb-18">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {principles.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-card px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <Card className="bg-[linear-gradient(145deg,#ffffff_0%,#f3ede4_100%)]">
            <CardHeader>
              <CardTitle>What the public site should communicate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
              <p>SkillBridge provides vetted domestic and support staff.</p>
              <p>The business values verification and operational discipline.</p>
              <p>Employers can request trusted workers through a clear process.</p>
              <p>Workers can enter the system through a professional application experience.</p>
            </CardContent>
          </Card>
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle>What the internal app represents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-primary-foreground/75">
              <p>The founder gets visibility across requests, workers, verification, and placements.</p>
              <p>Operations staff get faster workflows for intake, review, matching, and follow-through.</p>
              <p>The business becomes less dependent on memory and more driven by structured execution.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
