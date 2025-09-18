# Web

## Run (local)
```bash
npm ci
NEXT_PUBLIC_API_URL=http://localhost:4000 npm run dev
```

## Build & Start (prod)
```bash
npm ci && npm run build
npm run start
```

## Required env
- NEXT_PUBLIC_API_URL
- NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (if Google Maps)
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
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

## Deploy to Netlify

Use Netlify to deploy the frontend.

1. Create a Netlify site from Git with this repo.
2. Build command: 
pm run build
3. Publish directory: .next
4. Environment variables (at minimum):
   - NEXT_PUBLIC_API_URL -> your Render backend URL
   - NEXT_PUBLIC_MAPS_PROVIDER -> leaflet or google
   - NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (if using Google Maps)
   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (optional)
   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (optional)

