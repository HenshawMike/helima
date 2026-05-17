This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Role Management & Administrative Access Control

Helima uses a dedicated, highly secure Firestore `roles` collection to store and check user access roles (e.g. `'admin'`), completely bypassing Firebase custom claims.

- **Standard Users**: If a user is not in the `roles` collection, they automatically default to the `'customer'` role.
- **Admin Users**: Verified via `/roles/{uid}` where the document ID is their Firebase Authentication User ID (UID).
- **Security**: The client application has **zero write permissions** (`allow write: if false`) to `/roles`, preventing any client-side privilege escalation.

### How to Run the Admin CLI Utility

We provide a built-in CLI utility in the `scripts/` directory to create new administrators or promote existing users to `admin`.

Before running, make sure your environment variables in `.env` or `.env.local` are set up with your Firebase Admin credentials.

#### 1. Promote an Existing Registered User to Admin
If the user has already signed up (e.g., using Google Authentication or Email/Password), simply run:
```bash
node scripts/add-admin.js john@example.com
```

#### 2. Pre-create a New Admin Account from Scratch
If you want to create a brand-new Admin account with a password and set their display name:
```bash
node scripts/add-admin.js admin@helima.com mySecretPassword "Jane Doe"
```

#### What the Script Does:
1. Validates and creates the Firebase Auth user if they don't exist yet.
2. Creates the secure `roles/{uid}` Firestore document with `{ role: 'admin' }`.
3. Creates or merges the user profile document in `users/{uid}` with `{ role: 'admin' }` to ensure complete UI compatibility.
