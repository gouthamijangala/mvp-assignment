# Vercel Deployment Guide

## Step 1: Connect Project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (or create an account)
2. Click **"Add New Project"** or **"Import Project"**
3. Select **"Import Git Repository"**
4. Find and select your repository: `gouthamijangala/mvp-assignment`
5. Click **"Import"**

## Step 2: Configure Project Settings

Vercel should auto-detect Next.js. Verify these settings:
- **Framework Preset:** Next.js
- **Root Directory:** `./` (default)
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

## Step 3: Add Environment Variables

Before deploying, add these environment variables in Vercel:

1. In the project settings, go to **"Environment Variables"**
2. Add each variable below:

### Required Variables:

```
DATABASE_URL=your_production_database_url
NEXTAUTH_SECRET=your_random_secret_string
OPERATOR_EMAIL=operator@example.com
OPERATOR_PASSWORD=your_secure_password
```

### Optional (for Stripe payments):

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Optional (for email notifications):

```
RESEND_API_KEY=re_...
```

**Important Notes:**
- For Supabase, make sure your `DATABASE_URL` includes `?sslmode=require`
- Generate a new `NEXTAUTH_SECRET` for production (use: `openssl rand -base64 32`)
- Use production Stripe keys if you have them, otherwise test keys work fine

## Step 4: Deploy

1. Click **"Deploy"** button
2. Wait for the build to complete (usually 2-3 minutes)
3. Once deployed, you'll get a public URL like: `https://mvp-assignment-xxx.vercel.app`

## Step 5: Run Prisma Migrations

After the first deployment, you need to run migrations on your production database:

### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Link project: `vercel link` (select your project)
4. Run migrations: `vercel env pull .env.production` (to get DATABASE_URL)
5. Then run: `npx prisma migrate deploy`

### Option B: Using Prisma Studio or Direct Connection

1. Get your production `DATABASE_URL` from Vercel environment variables
2. Set it temporarily: `export DATABASE_URL="your_production_url"`
3. Run: `npx prisma migrate deploy`

### Option C: Using Vercel Post-Deploy Hook (Advanced)

You can add a postinstall script, but migrations should run manually for safety.

## Step 6: Verify Deployment

1. Visit your Vercel URL
2. Test the home page
3. Try operator login at `/admin/signin`
4. Check that database connections work

## Step 7: Configure Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify `DATABASE_URL` is correct

### Database Connection Issues
- Verify `DATABASE_URL` includes `?sslmode=require` for Supabase
- Check that your database allows connections from Vercel IPs
- Ensure database is not paused (Supabase)

### Prisma Client Errors
- The `postinstall` script should auto-generate Prisma Client
- If issues persist, check build logs for Prisma errors

## Your Public URL

Once deployed, your public URL will be:
- **Preview:** `https://mvp-assignment-xxx.vercel.app` (changes with each push)
- **Production:** `https://mvp-assignment.vercel.app` (if you set a production branch)

You can find your exact URL in the Vercel dashboard after deployment.
