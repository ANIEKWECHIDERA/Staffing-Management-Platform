import { useState } from "react";
import { toast } from "sonner";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { SiteHeader } from "@/components/site-header";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { sanitizeText } from "@/lib/sanitize";
import { collectErrors, hasMinLength, isRequired } from "@/lib/validation";

export function StaffResetPasswordPage() {
  const { isRecoveryMode, updateRecoveredPassword } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isRecoveryMode) {
    return <Navigate to="/staff/forgot-password" replace />;
  }

  const submit = async () => {
    const errors = collectErrors([
      !isRequired(form.password) ? "New password is required." : null,
      !hasMinLength(form.password, 8) ? "New password must be at least 8 characters." : null,
      form.password !== form.confirmPassword ? "Passwords do not match." : null,
    ]);

    if (errors.length > 0) {
      toast.error("Please fix the reset password form.", {
        description: errors[0],
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await updateRecoveredPassword(form.password);
      navigate("/app", { replace: true });
    } catch (error) {
      toast.error("Could not update password.", {
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
              <CardTitle>Reset password</CardTitle>
              <CardDescription>Set a new password to complete your recovery flow.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <label className="space-y-2">
                <span className="text-sm font-medium">New Password</span>
                <Input
                  value={form.password}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, password: sanitizeText(event.target.value, 128) }))
                  }
                  placeholder="Enter new password"
                  type="password"
                  autoComplete="new-password"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Confirm Password</span>
                <Input
                  value={form.confirmPassword}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, confirmPassword: sanitizeText(event.target.value, 128) }))
                  }
                  placeholder="Confirm new password"
                  type="password"
                  autoComplete="new-password"
                />
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="button" onClick={submit} disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update Password"}
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
