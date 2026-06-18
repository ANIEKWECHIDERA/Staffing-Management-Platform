import { Link } from "react-router-dom";
import { actionLinks, companyLinks, pathwayLinks } from "@/data/site";
import { Separator } from "./ui/separator";

export function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
          <div className="space-y-4">
            <div className="text-lg font-semibold">SkillBridge OS</div>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              The trusted entry point into a staffing platform built around verification, structure, and faster placement decisions.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div className="space-y-2">
              <div className="font-semibold">Explore</div>
              {companyLinks.map((item) => (
                <Link key={item.href} className="block text-muted-foreground hover:text-secondary" to={item.href}>
                  {item.title}
                </Link>
              ))}
            </div>
            <div className="space-y-2">
              <div className="font-semibold">Pathways</div>
              {[...pathwayLinks, ...actionLinks].map((item) => (
                <Link key={item.href} className="block text-muted-foreground hover:text-secondary" to={item.href}>
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground lg:text-right">
            <div className="font-semibold text-foreground">Internal Staff Access</div>
            <p>Staff authentication lives on dedicated non-public routes and is intended for internal users only.</p>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>Copyright 2026 SkillBridge OS</div>
          <div>Public website built as the entrance to the operational platform.</div>
        </div>
      </div>
    </footer>
  );
}
