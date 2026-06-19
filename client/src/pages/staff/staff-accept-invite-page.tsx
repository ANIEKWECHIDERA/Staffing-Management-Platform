import { useState } from "react";
import { toast } from "sonner";
import { Navigate, useNavigate } from "react-router-dom";
import { SiteHeader } from "@/components/site-header";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { sanitizeText } from "@/lib/sanitize";
import { collectErrors, hasMinLength, isRequired } from "@/lib/validation";

export function StaffAcceptInvitePage() {
  const { session, completeInvitePasswordSetup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!session) {
    return <Navigate to="/staff/login" replace />;
  }

  const submit = async () => {
    const errors = collectErrors([
      !isRequired(form.password) ? "Password is required." : null,
      !hasMinLength(form.password, 8) ? "Password must be at least 8 characters." : null,
      form.password !== form.confirmPassword ? "Passwords do not match." : null,
    ]);

    if (errors.length > 0) {
      toast.error("Please fix the invite setup form.", {
        description: errors[0],
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await completeInvitePasswordSetup(form.password);
      toast.success("Invite accepted successfully.", {
        description: "Your account is ready to use.",
      });
      navigate("/app", { replace: true });
    } catch (error) {
      toast.error("Could not complete invite setup.", {
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
              <CardTitle>Accept invite</CardTitle>
              <CardDescription>Set your password to finish joining the internal SkillBridge OS workspace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <label className="space-y-2">
                <span className="text-sm font-medium">New Password</span>
                <Input
                  value={form.password}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, password: sanitizeText(event.target.value, 128) }))
                  }
                  placeholder="Create a password"
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
                  placeholder="Confirm your password"
                  type="password"
                  autoComplete="new-password"
                />
              </label>
              <Button type="button" onClick={submit} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Complete Invite Setup"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
