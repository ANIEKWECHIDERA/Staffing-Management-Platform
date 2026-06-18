import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function StaffSignupPage() {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
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
              <Input placeholder="Your full name" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium">Work Email</span>
              <Input placeholder="name@skillbridgeos.com" type="email" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium">Role Needed</span>
              <Input placeholder="Owner or Staff" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium">Phone Number</span>
              <Input placeholder="0800 000 0000" />
            </label>
            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-medium">Why do you need access?</span>
              <Textarea placeholder="Briefly explain your function in the staffing operation." />
            </label>
            <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
              <Button size="lg" type="button">Request Access</Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/staff/login">Back to staff login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
