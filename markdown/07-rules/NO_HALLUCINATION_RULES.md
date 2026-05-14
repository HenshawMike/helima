# No-Hallucination Rules

## Core Rule
The Markdown files are the project context and source of truth.

## The Agent Must Not
- Add features not requested.
- Invent brand colors.
- Invent payment provider.
- Invent pricing.
- Invent WhatsApp number.
- Invent admin emails.
- Invent product categories.
- Invent shipping policy.
- Invent refund policy.

## The Agent Must
- Use `TODO_OWNER_INPUT` where information is missing.
- Ask for missing information only when it blocks progress.
- Keep implementation simple and MVP-focused.
- Explain any technical assumption in `IMPLEMENTATION_NOTES.md`.

## Safe Assumptions
The agent may assume:
- Products need images, price, name, stock, category, and description.
- Cart can be local storage for MVP.
- Firestore can store products and orders.
- Firebase Storage can store product images.
