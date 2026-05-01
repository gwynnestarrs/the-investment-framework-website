# The Investment Framework — Course Website

A premium finance course landing page and course portal. Built as static HTML — no build step required.

---

## Files

```
index.html          ← Landing page (sales page)
course.html         ← Course portal (post-payment)
gwynne.png          ← Founder photo
serve.mjs           ← Local dev server
screenshot.mjs      ← Screenshot utility
```

---

## Run Locally

```bash
node serve.mjs
```

Then open **http://localhost:3000** in your browser.

---

## Deploy to GitHub Pages

### Step 1 — Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **+** icon → **New repository**
3. Name it (e.g. `investment-framework`) — keep it public
4. Click **Create repository**

### Step 2 — Upload Your Files

On the new repository page, click **uploading an existing file**, then drag and drop:

- `index.html`
- `course.html`
- `gwynne.png`

Click **Commit changes**.

### Step 3 — Enable GitHub Pages

1. In your repository, go to **Settings** → **Pages** (left sidebar)
2. Under **Source**, select **Deploy from a branch**
3. Set branch to **main**, folder to **/ (root)**
4. Click **Save**

Your site will be live at:
```
https://[your-github-username].github.io/[repository-name]/
```

It takes 1–2 minutes to go live the first time. Refresh the Settings → Pages screen to see the live URL.

---

## Set Up Stripe Payments

### Step 1 — Create a Payment Link

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to **Payment Links** → **+ New**
3. Add a product: **"The Investment Framework"**, price **$200**, one-time payment
4. Under **After payment**, set the confirmation page to:
   ```
   https://[your-github-username].github.io/[repository-name]/course.html
   ```
5. Click **Create link** — Stripe gives you a URL like `https://buy.stripe.com/xxxxxxxx`

### Step 2 — Add the Link to Your Landing Page

Open `index.html` and do a Find & Replace:

- Find: `REPLACE_WITH_YOUR_STRIPE_LINK`
- Replace with your actual Stripe link (the part after `https://buy.stripe.com/`)

Example — change this:
```html
href="https://buy.stripe.com/REPLACE_WITH_YOUR_STRIPE_LINK"
```
to this:
```html
href="https://buy.stripe.com/abc123xyz"
```

There are multiple buttons — replace all occurrences. Then re-upload `index.html` to GitHub.

---

## Custom Domain (Optional)

If you have your own domain (e.g. `theinvestmentframework.com`):

1. In GitHub Pages settings, enter your domain under **Custom domain**
2. At your domain registrar, add a CNAME DNS record pointing to `[your-github-username].github.io`
3. Update your Stripe Payment Link's success URL to use your custom domain

---

## Making Updates

After any edit to `index.html` or `course.html`, go to your GitHub repository and re-upload the file. Changes go live within ~30 seconds.
