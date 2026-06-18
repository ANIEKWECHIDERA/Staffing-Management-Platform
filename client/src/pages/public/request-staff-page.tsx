import { useState } from "react";
import { toast } from "sonner";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sanitizeEmail, sanitizeMoney, sanitizePhone, sanitizeText } from "@/lib/sanitize";
import { collectErrors, hasMinLength, isRequired, isValidEmail, isValidPhone } from "@/lib/validation";

export function RequestStaffPage() {
  const [form, setForm] = useState({
    employerName: "",
    phone: "",
    email: "",
    neededRole: "",
    location: "",
    workArrangement: "",
    employmentType: "",
    salaryRange: "",
    requirements: "",
  });

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = () => {
    const errors = collectErrors([
      !hasMinLength(form.employerName, 2) ? "Employer name must be at least 2 characters." : null,
      !isRequired(form.phone) ? "Phone number is required." : null,
      form.phone && !isValidPhone(form.phone) ? "Enter a valid phone number." : null,
      form.email && !isValidEmail(form.email) ? "Enter a valid email address." : null,
      !isRequired(form.neededRole) ? "Needed role is required." : null,
      !hasMinLength(form.location, 2) ? "Location is required." : null,
      !isRequired(form.workArrangement) ? "Work arrangement is required." : null,
      !isRequired(form.employmentType) ? "Employment type is required." : null,
      !isRequired(form.salaryRange) ? "Salary range is required." : null,
      !hasMinLength(form.requirements, 10) ? "Requirements and notes must be at least 10 characters." : null,
    ]);

    if (errors.length > 0) {
      toast.error("Please fix the staffing request form.", {
        description: errors[0],
      });
      return;
    }

    toast.success("Staffing request looks valid.", {
      description: "This can be wired to the employer and job request backend flow next.",
    });
  };

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
                <Input
                  value={form.employerName}
                  onChange={(event) => updateField("employerName", sanitizeText(event.target.value, 120))}
                  placeholder="Household or business name"
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
                  placeholder="contact@example.com"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Needed Role</span>
                <Input
                  value={form.neededRole}
                  onChange={(event) => updateField("neededRole", sanitizeText(event.target.value, 120))}
                  placeholder="Nanny, Driver, Caregiver..."
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Location</span>
                <Input
                  value={form.location}
                  onChange={(event) => updateField("location", sanitizeText(event.target.value, 120))}
                  placeholder="Work location"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Work Arrangement</span>
                <Input
                  value={form.workArrangement}
                  onChange={(event) => updateField("workArrangement", sanitizeText(event.target.value, 80))}
                  placeholder="Live-in or Live-out"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Employment Type</span>
                <Input
                  value={form.employmentType}
                  onChange={(event) => updateField("employmentType", sanitizeText(event.target.value, 80))}
                  placeholder="Full-time or Part-time"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Salary Range</span>
                <Input
                  value={form.salaryRange}
                  onChange={(event) => updateField("salaryRange", sanitizeMoney(event.target.value))}
                  placeholder="e.g. NGN 150,000 - 250,000"
                />
              </label>
              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-medium">Requirements and Notes</span>
                <Textarea
                  value={form.requirements}
                  onChange={(event) => updateField("requirements", sanitizeText(event.target.value, 1200))}
                  placeholder="Describe role expectations, special conditions, timing, and any non-negotiables."
                />
              </label>
              <div className="sm:col-span-2">
                <Button size="lg" type="button" onClick={submit}>
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
