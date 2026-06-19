import { useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/site-header";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { sanitizeEmail } from "@/lib/sanitize";
import { collectErrors, isRequired, isValidEmail } from "@/lib/validation";

export function StaffForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    const errors = collectErrors([
      !isRequired(email) ? "Email address is required." : null,
      email && !isValidEmail(email) ? "Enter a valid email address." : null,
    ]);

    if (errors.length > 0) {
      toast.error("Please fix the password reset form.", {
        description: errors[0],
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await requestPasswordReset(email);
      toast.success("Password reset email requested.", {
        description: "If that account exists, a reset link will be sent.",
      });
    } catch (error) {
      toast.error("Could not request password reset.", {
        description: error instanceof Error ? error.message : "Something went wrong.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <Card>
            <CardHeader>
              <CardTitle>Forgot password</CardTitle>
              <CardDescription>Enter your staff email and we will trigger the recovery flow.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <label className="space-y-2">
                <span className="text-sm font-medium">Email Address</span>
                <Input
                  value={email}
                  onChange={(event) => setEmail(sanitizeEmail(event.target.value))}
                  placeholder="staff@skillbridgeos.com"
                  type="email"
                  autoComplete="email"
                />
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="button" onClick={submit} disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
                <Button asChild variant="outline" type="button">
                  <Link to="/staff/login">Back to login</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
