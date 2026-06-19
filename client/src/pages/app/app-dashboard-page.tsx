import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";

export function AppDashboardPage() {
  const { appUser, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 rounded-[1.8rem] border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">Internal App</div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">SkillBridge OS Dashboard</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Auth is now wired. This protected shell can be extended into the PRD dashboard and internal workflows next.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              void signOut();
            }}
          >
            Sign Out
          </Button>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Current user</CardTitle>
              <CardDescription>This data is coming from the backend `auth/me` contract after Supabase session bootstrap.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p><span className="font-semibold">Name:</span> {appUser?.fullName}</p>
              <p><span className="font-semibold">Email:</span> {appUser?.email}</p>
              <p><span className="font-semibold">Role:</span> {appUser?.role}</p>
              <p><span className="font-semibold">Active:</span> {appUser?.isActive ? "Yes" : "No"}</p>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle>Next Internal Build</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-primary-foreground/80">
              <p>Dashboard KPIs</p>
              <p>Workers list and detail</p>
              <p>Verification queue</p>
              <p>Employers and requests</p>
              <p>Matching and placements</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
