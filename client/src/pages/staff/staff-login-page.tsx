import { useState } from "react";
import { toast } from "sonner";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { SiteHeader } from "@/components/site-header";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { sanitizeEmail, sanitizeText } from "@/lib/sanitize";
import { collectErrors, isRequired, isValidEmail } from "@/lib/validation";

export function StaffLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithPassword, appUser, session } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (session && appUser) {
    return <Navigate to="/app" replace />;
  }

  const submit = () => {
    const errors = collectErrors([
      !isRequired(form.email) ? "Email is required." : null,
      form.email && !isValidEmail(form.email) ? "Enter a valid email address." : null,
      !isRequired(form.password) ? "Password is required." : null,
      form.password && form.password.length < 8 ? "Password must be at least 8 characters." : null,
    ]);

    if (errors.length > 0) {
      toast.error("Please fix the staff login form.", {
        description: errors[0],
      });
      return;
    }

    toast.success("Login form looks valid.", {
      description: "Connect this action to Supabase auth on the next pass.",
    });
  };

  const handleSubmit = async () => {
    submit();
    const errors = collectErrors([
      !isRequired(form.email) ? "Email is required." : null,
      form.email && !isValidEmail(form.email) ? "Enter a valid email address." : null,
      !isRequired(form.password) ? "Password is required." : null,
      form.password && form.password.length < 8 ? "Password must be at least 8 characters." : null,
    ]);

    if (errors.length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      await signInWithPassword(form.email, form.password);
      toast.success("Signed in successfully.", {
        description: "Your session has been synced with SkillBridge OS.",
      });
      const target = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/app";
      navigate(target, { replace: true });
    } catch (error) {
      toast.error("Could not sign in.", {
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
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#ffbea8]">Internal Staff Access</div>
              <CardTitle className="text-3xl">Login to the operational side of SkillBridge OS.</CardTitle>
              <CardDescription className="text-primary-foreground/75">
                This route is separate from the public website because it is intended for owners and operations staff, not public visitors.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-6 text-primary-foreground/75">
              <p>Use your internal staff credentials to enter the dashboard, worker records, verification queue, requests, matches, placements, and user management.</p>
              <p>If you do not already have access, request it or use the invite flow issued by the internal team.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Staff login</CardTitle>
              <CardDescription>Connect this screen to Supabase email/password auth on the next pass.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <label className="space-y-2">
                <span className="text-sm font-medium">Email Address</span>
                <Input
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: sanitizeEmail(event.target.value) }))}
                  placeholder="staff@skillbridgeos.com"
                  type="email"
                  autoComplete="email"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Password</span>
                <Input
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: sanitizeText(event.target.value, 128) }))}
                  placeholder="Enter password"
                  type="password"
                  autoComplete="current-password"
                />
              </label>
              <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
                <Link className="text-secondary hover:underline" to="/staff/login?mode=forgot-password">
                  Forgot password?
                </Link>
                <Link className="text-muted-foreground hover:text-secondary" to="/staff/signup">
                  Need internal access?
              </Link>
            </div>
              <Button className="w-full" size="lg" type="button" onClick={() => void handleSubmit()} disabled={isSubmitting}>
                {isSubmitting ? "Signing In..." : "Log In"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
