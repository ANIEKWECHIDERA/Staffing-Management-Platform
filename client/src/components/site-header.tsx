import { Menu, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { actionLinks, companyLinks, pathwayLinks } from "@/data/site";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";

function MenuList({
  title,
  items,
}: {
  title: string;
  items: ReadonlyArray<{ title: string; href: string }>;
}) {
  return (
    <div className="w-[360px] rounded-[1.5rem] bg-card p-3">
      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">{title}</div>
      <ul className="grid gap-1">
        {items.map((item) => (
          <li key={item.href}>
            <NavigationMenuLink asChild>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "block rounded-2xl px-3 py-3 text-sm leading-6 transition-colors hover:bg-muted",
                    isActive && "bg-muted text-secondary",
                  )
                }
              >
                <div className="font-medium">{item.title}</div>
              </NavLink>
            </NavigationMenuLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_18px_30px_-24px_rgba(22,23,21,0.45)]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-base font-semibold tracking-tight">SkillBridge OS</div>
            <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Trusted staffing entrance</div>
          </div>
        </Link>

        <div className="hidden lg:block">
          <NavigationMenu>
            <NavigationMenuList className="rounded-full border bg-card/80 px-2 py-1 backdrop-blur">
              <NavigationMenuItem>
                <NavigationMenuTrigger>Company</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <MenuList title="Company Pages" items={companyLinks} />
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Pathways</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <MenuList title="Who We Serve" items={pathwayLinks} />
                </NavigationMenuContent>
              </NavigationMenuItem>
              {actionLinks.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) => cn(isActive && "bg-muted text-secondary")}
                    >
                      {item.title}
                    </NavLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden md:flex">
          <Button asChild>
            <Link to="/request-staff">Request Staff</Link>
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          <Menu className="h-4 w-4" />
          Menu
        </Button>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t bg-background lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6">
            <div className="rounded-[1.5rem] border bg-card p-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Company</div>
              <div className="grid gap-1">
                {companyLinks.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      cn("rounded-2xl px-3 py-2 text-sm hover:bg-muted", isActive && "bg-muted text-secondary")
                    }
                  >
                    {item.title}
                  </NavLink>
                ))}
              </div>
            </div>
            <div className="rounded-[1.5rem] border bg-card p-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Pathways</div>
              <div className="grid gap-1">
                {[...pathwayLinks, ...actionLinks].map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      cn("rounded-2xl px-3 py-2 text-sm hover:bg-muted", isActive && "bg-muted text-secondary")
                    }
                  >
                    {item.title}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
