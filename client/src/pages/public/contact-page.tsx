import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactDetails } from "@/data/site";

export function ContactPage() {
  return (
    <div>
      <PageHero
        eyebrow="Contact"
        title="Reach the team behind the staffing operation."
        description="Use this route for employer questions, worker questions, partnership conversations, or support needs around the service."
      />

      <section className="px-4 pb-14 sm:px-6 lg:px-8 lg:pb-18">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle>Contact details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contactDetails.map((detail) => (
                <div key={detail.label} className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold">{detail.label}</div>
                  <div className="mt-1 text-sm text-primary-foreground/75">{detail.value}</div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Send a message</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium">Your Name</span>
                <Input placeholder="Full name" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Email Address</span>
                <Input placeholder="you@example.com" type="email" />
              </label>
              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-medium">Subject</span>
                <Input placeholder="How can we help?" />
              </label>
              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-medium">Message</span>
                <Textarea placeholder="Tell us what you need." />
              </label>
              <div className="sm:col-span-2">
                <Button size="lg" type="button">
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
