import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function StaffLoginPage() {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
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
              <Input placeholder="staff@skillbridgeos.com" type="email" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium">Password</span>
              <Input placeholder="Enter password" type="password" />
            </label>
            <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
              <Link className="text-secondary hover:underline" to="/staff/login?mode=forgot-password">
                Forgot password?
              </Link>
              <Link className="text-muted-foreground hover:text-secondary" to="/staff/signup">
                Need internal access?
              </Link>
            </div>
            <Button className="w-full" size="lg" type="button">
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
