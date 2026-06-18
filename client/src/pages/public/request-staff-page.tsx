import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function RequestStaffPage() {
  return (
    <div>
      <PageHero
        eyebrow="Request Staff"
        title="Turn a staffing need into a clear structured request."
        description="This public route mirrors the key data the PRD expects the internal system to capture for employers and job requests."
      />

      <section className="px-4 pb-14 sm:px-6 lg:px-8 lg:pb-18">
        <div className="mx-auto max-w-5xl">
          <Card>
            <CardHeader>
              <CardTitle>Employer staffing request</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium">Employer Name</span>
                <Input placeholder="Household or business name" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Phone Number</span>
                <Input placeholder="0800 000 0000" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Email Address</span>
                <Input placeholder="contact@example.com" type="email" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Needed Role</span>
                <Input placeholder="Nanny, Driver, Caregiver..." />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Location</span>
                <Input placeholder="Work location" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Work Arrangement</span>
                <Input placeholder="Live-in or Live-out" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Employment Type</span>
                <Input placeholder="Full-time or Part-time" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Salary Range</span>
                <Input placeholder="e.g. NGN 150,000 - 250,000" />
              </label>
              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-medium">Requirements and Notes</span>
                <Textarea placeholder="Describe role expectations, special conditions, timing, and any non-negotiables." />
              </label>
              <div className="sm:col-span-2">
                <Button size="lg" type="button">
                  Send Staffing Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
