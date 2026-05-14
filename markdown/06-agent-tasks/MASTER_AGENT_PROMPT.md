# Master Antigravity Prompt

You are building **Helima**, an ecommerce website.

You must use **spec-driven AI development using Markdown as the project context**.

## Required Behavior
Before coding:
1. Read every Markdown file in this folder.
2. Treat these files as the source of truth.
3. Activate relevant skills in `.agent/skills/`.
4. Create an implementation checklist from the specs.
5. Build only what the specs require.

## Skill Activation Instruction
Activate these project skills before implementation:
- `spec-brainstorming`
- `nextjs-firebase-implementation`
- `payment-whatsapp-flow`
- `security-review`
- `qa-testing`

## Strict Rule
Do not hallucinate product requirements.
Do not invent business rules.
Do not silently choose unresolved decisions.

When blocked by missing owner input, use `TODO_OWNER_INPUT` and continue only where safe.

## Build Order
1. Project setup
2. Firebase setup
3. Auth setup
4. Product data model
5. Storefront pages
6. Cart
7. Checkout
8. Payment abstraction
9. WhatsApp success flow
10. Admin dashboard
11. Security rules
12. Testing and QA
