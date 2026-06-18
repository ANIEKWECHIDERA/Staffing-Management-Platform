import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  CarFront,
  CookingPot,
  HeartHandshake,
  House,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

export const companyLinks = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Services", href: "/services" },
] as const;

export const pathwayLinks = [
  { title: "For Employers", href: "/for-employers" },
  { title: "For Workers", href: "/for-workers" },
] as const;

export const actionLinks = [
  { title: "Apply as Worker", href: "/apply" },
  { title: "Request Staff", href: "/request-staff" },
  { title: "Contact", href: "/contact" },
] as const;

export const services: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "Nannies",
    description: "Childcare professionals screened for trust, consistency, and home-readiness.",
    icon: HeartHandshake,
  },
  {
    title: "Drivers",
    description: "Reliable domestic and executive drivers with identity and record checks.",
    icon: CarFront,
  },
  {
    title: "Caregivers",
    description: "Compassionate support staff for daily care, presence, and routine assistance.",
    icon: ShieldCheck,
  },
  {
    title: "Housekeepers",
    description: "Order-focused household staff who help maintain structured environments.",
    icon: House,
  },
  {
    title: "Private Cooks",
    description: "Kitchen professionals matched for home standards, hygiene, and dietary needs.",
    icon: CookingPot,
  },
  {
    title: "Office Support",
    description: "Operational support staff for organizations that need trusted hands behind the scenes.",
    icon: BriefcaseBusiness,
  },
] as const;

export const trustPillars = [
  "NIN and BVN capture for worker verification records",
  "Reference, guarantor, and document review before confident placement",
  "Operational clarity for owners and staff without WhatsApp chaos",
] as const;

export const employerBenefits = [
  "Structured staffing requests instead of loose chat instructions",
  "Verification-first matching with clearer confidence in every shortlist",
  "Faster movement from request to placement with internal workflow support",
] as const;

export const workerBenefits = [
  "A cleaner, more professional application path into the system",
  "Profile completeness that improves visibility for future matching",
  "Trust-building fields and documents captured in one place",
] as const;

export const websiteStats = [
  { value: "2,500+", label: "Structured worker records" },
  { value: "98%", label: "Confidence-driven shortlist matching" },
  { value: "24/7", label: "Operational visibility for the team" },
] as const;

export const contactDetails = [
  { label: "Email", value: "hello@skillbridgeos.com" },
  { label: "Phone", value: "+234 800 000 0000" },
  { label: "Coverage", value: "Lagos, Abuja, Port Harcourt, and growing markets" },
] as const;

export const homeHighlights = [
  {
    title: "Built for serious staffing",
    description: "Not a generic marketplace, but a premium service entrance backed by an operations engine.",
    icon: Sparkles,
  },
  {
    title: "Trust-centered workflow",
    description: "Verification is foundational, from worker intake through matching and placement.",
    icon: ShieldCheck,
  },
  {
    title: "People + process",
    description: "A human service business supported by structure, speed, and visible workflows.",
    icon: Users,
  },
] as const;
