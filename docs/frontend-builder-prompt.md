# Prompt for Frontend UI Builder

Design and build the frontend for `SkillBridge OS`, a modern internal operating system for a domestic staffing agency.

Use:

- React
- TypeScript
- shadcn/ui

The frontend should include both:

1. A public website / entry experience
2. An authenticated internal operations app

## Core Idea

SkillBridge is not a job board and not a generic admin dashboard.

It is the internal operating system for a staffing agency that places trusted domestic workers like nannies, drivers, caregivers, cooks, housekeepers, cleaners, and office support staff with households, businesses, and organizations.

Today, the business runs on WhatsApp, calls, notebooks, and founder memory. That creates chaos:

- worker records are scattered
- employer requests are easy to lose
- verification is inconsistent
- matching depends on memory
- leadership cannot see the business clearly

The app should feel like the system that turns that messy, founder-dependent workflow into a clean, trustworthy, high-speed operations machine.

This product is about:

- trust
- structure
- speed
- operational clarity
- placing the right worker quickly

The UI should communicate that this is a serious, high-trust, real-world operations tool.

## Product Personality

The experience should feel:

- professional
- warm
- efficient
- trustworthy
- structured
- fast to scan
- mobile-friendly for staff who may work from phones

Avoid:

- generic startup dashboard aesthetics
- crypto/SaaS vibes
- cold enterprise heaviness
- overly playful consumer UI

This should feel like a polished operations platform built for a people-driven service business in a high-trust market.

## Design Direction

Create a visual system that balances:

- operational density
- clean hierarchy
- emotional trust

Suggested visual tone:

- elegant neutral base
- grounded warm accent colors
- strong status colors for workflow states
- crisp cards, tables, and detail panels
- confident typography
- excellent spacing and sectioning

Do not make it look like a template.

The founder dashboard should feel like a command center.
The staff workflows should feel fast and low-friction.
The public website should feel trustworthy, premium, and conversion-focused.

## Primary User Types

### Internal

1. Agency Owner
- wants total visibility
- wants to delegate safely
- wants to see workers, requests, placements, and bottlenecks at a glance

2. Operations Staff
- wants to move fast
- wants to capture workers and employers quickly
- wants to verify workers clearly
- wants to search and match candidates in seconds

### External via Website

3. Workers
- want to apply for jobs and be onboarded
- may be phone-first users
- need a simple, confidence-building application flow

4. Employers
- want vetted, reliable staff
- want a smooth way to request workers
- need the brand and website to feel trustworthy

## Information Architecture

Build the frontend around two major surfaces.

### A. Public Website

Pages:

- Home
- About
- Services
- For Employers
- For Workers
- Contact
- Apply as Worker
- Request Staff
- Login

Website goals:

- explain what SkillBridge does
- build trust quickly
- convert employers into requests
- convert workers into applicants
- guide staff into login

Website messaging should make clear:

- SkillBridge provides vetted domestic and support staff
- the agency values verification and trust
- employers can request reliable workers
- workers can apply to be considered

The public website should not feel like a job marketplace. It should feel like a service business with operational excellence behind it.

### B. Internal App

Routes / screens:

- Dashboard
- Workers list
- New worker form
- Worker detail
- Edit worker
- Verification queue
- Employers list
- New employer form
- Employer detail
- Job requests list
- New job request form
- Job request detail
- Match results
- Placements list
- Placement detail
- User management

## Main Workflows to Design For

### 1. Capture Worker

Staff should be able to:

- create a worker quickly
- add role categories
- enter contact and location data
- include `NIN` and `BVN`
- upload profile photo and documents
- add guarantor and references

This flow should feel guided, not overwhelming.

### 2. Verify Worker

Staff should be able to:

- review submitted data
- see what is missing
- inspect documents
- approve or reject verification

This screen should feel like a checklist-driven review workflow.

### 3. Capture Employer

Staff should be able to:

- create employer records
- store contact and location details
- add notes
- review employer history

### 4. Capture Job Request

Staff should be able to log:

- needed role
- location
- work arrangement
- employment type
- salary range
- start date
- notes and requirements

This should turn a messy WhatsApp-style request into a crisp structured record.

### 5. Match Candidates

Staff should be able to:

- run matching on a request
- see ranked candidates
- understand why each candidate matched
- see verification and availability clearly
- move quickly to placement

This screen should feel decisive and explainable.

### 6. Create Placement

Staff should be able to confirm that:

- a worker has been placed
- the linked employer and request are visible
- placement date and guarantee period are tracked

### 7. Founder Visibility

Dashboard should clearly surface:

- total workers
- verified workers
- available workers
- open job requests
- active placements
- recent activity
- quick operational actions

The dashboard should feel like a real business cockpit, not decorative analytics.

## Key Data Concepts to Reflect in UI

Workers have:

- name
- phone
- email
- location
- address
- profile photo
- role categories
- experience
- availability status
- verification status
- NIN
- BVN
- documents
- guarantor
- references
- placement history

Employers have:

- name
- type
- contact information
- location
- notes
- job requests
- placements

Job requests have:

- role type
- location
- work arrangement
- employment type
- salary range
- start date
- status
- requirements

Placements have:

- worker
- employer
- source job request
- placement date
- guarantee end date
- status

## Status Design

Statuses should be extremely clear in the UI.

Worker availability:

- available
- placed
- unavailable

Worker verification:

- draft
- pending verification
- verified
- rejected
- incomplete

Job request status:

- new
- matching
- interviewing
- placed
- closed
- cancelled

Placement status:

- active
- ended
- under replacement

Use strong badge systems and status-aware layouts.

## UX Expectations

- mobile responsive, but optimized for desktop operations
- fast scanning and filtering
- clear hierarchy between list views and detail views
- polished empty states
- strong search UX
- inline actions where appropriate
- smart form grouping
- no cluttered or bloated enterprise forms

Use shadcn/ui components thoughtfully:

- cards
- tables
- badges
- sheets
- dialogs
- tabs
- forms
- command/search patterns
- sidebars
- toasts

## Screen-Specific Guidance

### Dashboard

Build a strong command-center layout with:

- KPI cards
- open request overview
- verification queue summary
- recent workers
- recent placements
- quick action buttons

### Workers List

Should be one of the strongest screens in the product.

Include:

- prominent search
- rich filters
- verification and availability badges
- clean row design
- ability to quickly open worker profile

### Worker Detail

Should feel like a complete operational dossier.

Use sections/tabs like:

- Overview
- Verification
- Documents
- References
- Placements

### Verification Queue

Should feel like an inbox for trust decisions.

Make it easy to:

- identify missing items
- review documents
- approve
- reject

### Job Request Detail and Match Results

These screens represent the heart of the business.

Make them excellent.

The UI should help staff answer:

- what does the employer need?
- who are the best candidates?
- why are they good fits?
- who can be placed now?

### Public Website

The site should feel:

- premium
- trustworthy
- human
- conversion-driven

Include strong sections such as:

- hero with clear call to action
- trust/value proposition
- service categories
- how it works
- verification/process credibility
- employer CTA
- worker CTA
- testimonials or trust signals
- contact/footer

Avoid stock-looking generic layouts.

## Output Expectations

Create:

- a consistent design system direction
- page layouts for all major screens
- reusable UI patterns
- responsive behavior
- realistic sample data states
- loading, empty, and populated states

Prioritize coherence between:

- public brand website
- login/auth flow
- internal operations app

The whole experience should feel like one thoughtful product.

## Final Quality Bar

The result should make a founder feel:

"This captures the seriousness of my business, the trust required in domestic staffing, and the speed my team needs to operate well."

It should make an operations staff member feel:

"I can find, verify, match, and place people from here without going back to WhatsApp chaos."
