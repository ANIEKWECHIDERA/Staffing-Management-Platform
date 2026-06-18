import { useState } from "react";
import { toast } from "sonner";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sanitizeDigits, sanitizeEmail, sanitizePhone, sanitizeText } from "@/lib/sanitize";
import {
  collectErrors,
  hasMinLength,
  isElevenDigits,
  isRequired,
  isValidEmail,
  isValidPhone,
} from "@/lib/validation";

export function ApplyPage() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    location: "",
    roleCategory: "",
    workArrangement: "",
    nin: "",
    bvn: "",
    experienceSummary: "",
  });

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = () => {
    const errors = collectErrors([
      !hasMinLength(form.fullName, 2) ? "Full name must be at least 2 characters." : null,
      !isRequired(form.phone) ? "Phone number is required." : null,
      form.phone && !isValidPhone(form.phone) ? "Enter a valid phone number." : null,
      form.email && !isValidEmail(form.email) ? "Enter a valid email address." : null,
      !hasMinLength(form.location, 2) ? "Primary location is required." : null,
      !isRequired(form.roleCategory) ? "Role category is required." : null,
      !isRequired(form.workArrangement) ? "Work arrangement is required." : null,
      form.nin && !isElevenDigits(form.nin) ? "NIN must be exactly 11 digits." : null,
      form.bvn && !isElevenDigits(form.bvn) ? "BVN must be exactly 11 digits." : null,
      !hasMinLength(form.experienceSummary, 10) ? "Experience summary must be at least 10 characters." : null,
    ]);

    if (errors.length > 0) {
      toast.error("Please fix the worker application form.", {
        description: errors[0],
      });
      return;
    }

    toast.success("Worker application looks valid.", {
      description: "This can be wired to the backend worker intake flow next.",
    });
  };

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
                <Input
                  value={form.fullName}
                  onChange={(event) => updateField("fullName", sanitizeText(event.target.value, 120))}
                  placeholder="Enter full name"
                  autoComplete="name"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Phone Number</span>
                <Input
                  value={form.phone}
                  onChange={(event) => updateField("phone", sanitizePhone(event.target.value))}
                  placeholder="0800 000 0000"
                  autoComplete="tel"
                  inputMode="tel"
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
                  inputMode="email"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Primary Location</span>
                <Input
                  value={form.location}
                  onChange={(event) => updateField("location", sanitizeText(event.target.value, 120))}
                  placeholder="Lagos, Abuja, Port Harcourt..."
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Role Category</span>
                <Input
                  value={form.roleCategory}
                  onChange={(event) => updateField("roleCategory", sanitizeText(event.target.value, 120))}
                  placeholder="Nanny, Driver, Caregiver..."
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Work Arrangement</span>
                <Input
                  value={form.workArrangement}
                  onChange={(event) => updateField("workArrangement", sanitizeText(event.target.value, 80))}
                  placeholder="Live-in, Live-out, or both"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">NIN</span>
                <Input
                  value={form.nin}
                  onChange={(event) => updateField("nin", sanitizeDigits(event.target.value, 11))}
                  placeholder="11-digit NIN"
                  inputMode="numeric"
                  maxLength={11}
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">BVN</span>
                <Input
                  value={form.bvn}
                  onChange={(event) => updateField("bvn", sanitizeDigits(event.target.value, 11))}
                  placeholder="11-digit BVN"
                  inputMode="numeric"
                  maxLength={11}
                />
              </label>
              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-medium">Experience Summary</span>
                <Textarea
                  value={form.experienceSummary}
                  onChange={(event) => updateField("experienceSummary", sanitizeText(event.target.value, 1200))}
                  placeholder="Tell us about your work history, strengths, and the kind of opportunities you want."
                />
              </label>
              <div className="rounded-[1.4rem] border border-dashed bg-muted/45 p-4 text-sm leading-6 text-muted-foreground sm:col-span-2">
                References, guarantor details, and supporting documents can be collected in the next step of the application workflow. `NIN` and `BVN` are included here because they are part of the trust model for worker intake.
              </div>
              <div className="sm:col-span-2">
                <Button size="lg" type="button" onClick={submit}>
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
