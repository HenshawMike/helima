# Helima — Spec-Driven AI Development Pack

This folder is the project context for building **Helima**, an ecommerce website for selling products imported from China.

The build must follow **spec-driven AI development using Markdown as the project context**.

## Meaning
Do not build from memory, guesses, or assumptions.
Build only from the Markdown specs in this folder.

## Stack
- Frontend: Next.js
- Backend/Database/Auth/Storage: Firebase
- Auth: Google Auth only
- Admin: Admin dashboard for managing products and orders
- Payment: In-app payment flow
- After payment: Show WhatsApp link/button so customer can contact Helima with order details

## How Antigravity should work
1. Read all Markdown files first.
2. Activate the project skills in `.agent/skills/`.
3. Build feature by feature from the specs.
4. When unclear, stop and ask instead of inventing.
5. Update implementation notes after each completed task.

## Folder Guide
- `00-context/` — Product background and source of truth
- `01-specs/` — Product and MVP requirements
- `02-architecture/` — App architecture and tech decisions
- `03-data/` — Firebase data model and security rules
- `04-flows/` — User, admin, payment, and WhatsApp flows
- `05-ui/` — Pages, components, and UI behavior
- `06-agent-tasks/` — Step-by-step Antigravity build tasks
- `07-rules/` — No-hallucination, security, and quality rules
- `.agent/skills/` — Antigravity skills to activate
