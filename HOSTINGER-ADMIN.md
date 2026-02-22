# Admin Panel – Connect & Hostinger

## Quick connect checklist (local or hosted)

1. **Env file**  
   In the project root, ensure `.env` exists and contains:
   ```env
   VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
   ```
   Get both from [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Settings → API** (Project URL + anon public key).

2. **Run locally**
   ```bash
   npm install
   npm run dev
   ```
   Open **http://localhost:8080/admin/login** and sign in with a user that has `admin` in the `user_roles` table.

3. **Supabase Auth (for production/hosted)**  
   In Supabase: **Authentication → URL Configuration** add your site URL, e.g. `https://your-domain.com`, and add `https://your-domain.com` (and `http://localhost:8080` for dev) under **Redirect URLs** if you use email redirects.

4. **Build for Hostinger**
   ```bash
   npm run build
   ```
   Upload the **contents** of the `dist/` folder to Hostinger’s `public_html`. Then open `https://your-domain.com/admin/login`.

If the browser console shows `[Supabase] Missing env...`, the app was built or run without the env vars; fix `.env` and restart `npm run dev` or run `npm run build` again.

---

## Why the Admin Panel doesn’t work on Hostinger

### What goes wrong

1. **404 on `/admin` and `/admin/login`**  
   The site is a single-page app (SPA). When you open `https://yoursite.com/admin` or `https://yoursite.com/admin/login`, the server looks for a real file at that path. There is no such file; React Router is supposed to handle these URLs after loading `index.html`. On static hosting (e.g. Hostinger) the server often returns **404** instead of serving `index.html`, so the Admin Panel never loads.

2. **Supabase not connecting**  
   The Admin Panel uses Supabase for login and data. The app needs these at **build time**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`  
   If they are missing when you run `npm run build`, the built JS will have `undefined` for the Supabase client and the Admin Panel will fail (login, products, media, etc.).

---

## Fixes

### 1. Fix 404 for Admin routes (SPA fallback)

This repo includes a **`public/.htaccess`** file. Vite copies it into `dist/` when you build.

- **If you upload the contents of `dist/` to Hostinger’s `public_html`**, the `.htaccess` will be there and Apache will serve `index.html` for `/admin`, `/admin/login`, and all other routes. The Admin Panel should then load when you go to `/admin` or `/admin/login`.

- **If your Hostinger plan doesn’t use Apache** (e.g. some static-only setups), you need the same behavior in their control panel: “redirect all requests to `index.html`” or “SPA / single page app” option. Check Hostinger’s docs for static site / SPA configuration.

### 2. Make sure Supabase is in the build

Build the site **with** your Supabase env vars set, so they get baked into the JS:

```bash
# In the project root, with .env containing:
# VITE_SUPABASE_URL=https://xxxx.supabase.co
# VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key

npm run build
```

Then upload the **contents** of the `dist/` folder to Hostinger (e.g. into `public_html`). Do not upload the `dist` folder itself; the `.htaccess` and `index.html` must be at the root of what the server serves.

### 3. After deploying

- Open: `https://your-domain.com/admin/login`  
- Log in with your Supabase admin user.  
- If login succeeds, you should be redirected to `/admin` and the Admin Panel should work.

If you still get 404 on `/admin` or `/admin/login`, the server is not applying the SPA fallback (step 1). If login or data never load, the build was likely done without the Supabase env vars (step 2).
