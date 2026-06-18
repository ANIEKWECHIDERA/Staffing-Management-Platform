import { useState } from "react";
import { toast } from "sonner";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactDetails } from "@/data/site";
import { sanitizeEmail, sanitizeText } from "@/lib/sanitize";
import { collectErrors, hasMinLength, isValidEmail } from "@/lib/validation";

export function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = () => {
    const errors = collectErrors([
      !hasMinLength(form.name, 2) ? "Your name must be at least 2 characters." : null,
      !form.email ? "Email address is required." : null,
      form.email && !isValidEmail(form.email) ? "Enter a valid email address." : null,
      !hasMinLength(form.subject, 3) ? "Subject must be at least 3 characters." : null,
      !hasMinLength(form.message, 10) ? "Message must be at least 10 characters." : null,
    ]);

    if (errors.length > 0) {
      toast.error("Please fix the contact form.", {
        description: errors[0],
      });
      return;
    }

    toast.success("Message form looks valid.", {
      description: "This can be connected to a backend contact endpoint next.",
    });
  };

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
                <Input
                  value={form.name}
                  onChange={(event) => updateField("name", sanitizeText(event.target.value, 120))}
                  placeholder="Full name"
                  autoComplete="name"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Email Address</span>
                <Input
                  value={form.email}
                  onChange={(event) => updateField("email", sanitizeEmail(event.target.value))}
                  placeholder="you@example.com"
                  type="email"
                  autoComplete="email"
                />
              </label>
              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-medium">Subject</span>
                <Input
                  value={form.subject}
                  onChange={(event) => updateField("subject", sanitizeText(event.target.value, 150))}
                  placeholder="How can we help?"
                />
              </label>
              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-medium">Message</span>
                <Textarea
                  value={form.message}
                  onChange={(event) => updateField("message", sanitizeText(event.target.value, 1200))}
                  placeholder="Tell us what you need."
                />
              </label>
              <div className="sm:col-span-2">
                <Button size="lg" type="button" onClick={submit}>
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
