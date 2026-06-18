import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ApplyPage() {
  return (
    <div>
      <PageHero
        eyebrow="Apply as Worker"
        title="Start your worker application with the trust-building details the system needs."
        description="This route is the public intake point. The internal app will later carry the profile through verification, review, and eventual matching."
      />

      <section className="px-4 pb-14 sm:px-6 lg:px-8 lg:pb-18">
        <div className="mx-auto max-w-5xl">
          <Card>
            <CardHeader>
              <CardTitle>Worker application form</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium">Full Name</span>
                <Input placeholder="Enter full name" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Phone Number</span>
                <Input placeholder="0800 000 0000" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Email Address</span>
                <Input placeholder="you@example.com" type="email" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Primary Location</span>
                <Input placeholder="Lagos, Abuja, Port Harcourt..." />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Role Category</span>
                <Input placeholder="Nanny, Driver, Caregiver..." />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Work Arrangement</span>
                <Input placeholder="Live-in, Live-out, or both" />
              </label>
              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-medium">Experience Summary</span>
                <Textarea placeholder="Tell us about your work history, strengths, and the kind of opportunities you want." />
              </label>
              <div className="rounded-[1.4rem] border border-dashed bg-muted/45 p-4 text-sm leading-6 text-muted-foreground sm:col-span-2">
                Later steps can collect NIN, BVN, references, guarantor details, and documents through the main application workflow.
              </div>
              <div className="sm:col-span-2">
                <Button size="lg" type="button">
                  Submit Worker Interest
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
