import { useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sanitizeEmail, sanitizePhone, sanitizeText } from "@/lib/sanitize";
import { collectErrors, hasMinLength, isRequired, isValidEmail, isValidPhone } from "@/lib/validation";

export function StaffSignupPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    roleNeeded: "",
    phone: "",
    reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    const errors = collectErrors([
      !hasMinLength(form.fullName, 2) ? "Full name must be at least 2 characters." : null,
      !isRequired(form.email) ? "Work email is required." : null,
      form.email && !isValidEmail(form.email) ? "Enter a valid work email address." : null,
      !isRequired(form.roleNeeded) ? "Role needed is required." : null,
      !isRequired(form.phone) ? "Phone number is required." : null,
      form.phone && !isValidPhone(form.phone) ? "Enter a valid phone number." : null,
      !hasMinLength(form.reason, 10) ? "Please explain why access is needed in at least 10 characters." : null,
    ]);

    if (errors.length > 0) {
      toast.error("Please fix the access request form.", {
        description: errors[0],
      });
      return;
    }

    try {
      setIsSubmitting(true);
      toast.success("Access request form looks valid.", {
        description: "Connect this action to the real backend workflow next.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">Internal signup</div>
              <CardTitle className="text-3xl">Request staff access or continue an invite-based onboarding flow.</CardTitle>
              <CardDescription>
                Internal accounts are not part of the public website experience. This route exists for team onboarding and access requests.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium">Full Name</span>
                <Input
                  value={form.fullName}
                  onChange={(event) => setForm((current) => ({ ...current, fullName: sanitizeText(event.target.value, 120) }))}
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Work Email</span>
                <Input
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: sanitizeEmail(event.target.value) }))}
                  placeholder="name@skillbridgeos.com"
                  type="email"
                  autoComplete="email"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Role Needed</span>
                <Input
                  value={form.roleNeeded}
                  onChange={(event) => setForm((current) => ({ ...current, roleNeeded: sanitizeText(event.target.value, 80) }))}
                  placeholder="Owner or Staff"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Phone Number</span>
                <Input
                  value={form.phone}
                  onChange={(event) => setForm((current) => ({ ...current, phone: sanitizePhone(event.target.value) }))}
                  placeholder="0800 000 0000"
                  autoComplete="tel"
                />
              </label>
              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-medium">Why do you need access?</span>
                <Textarea
                  value={form.reason}
                  onChange={(event) => setForm((current) => ({ ...current, reason: sanitizeText(event.target.value, 1200) }))}
                  placeholder="Briefly explain your function in the staffing operation."
                />
              </label>
              <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
                <Button size="lg" type="button" onClick={() => void submit()} disabled={isSubmitting}>Request Access</Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/staff/login">Back to staff login</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
