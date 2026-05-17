# Supabase Setup Guide for MediCare Connect

This guide configures Supabase for the current React/TanStack project.

## 1. Create the Supabase project

1. Go to https://supabase.com and sign in.
2. Create a new project.
3. In the dashboard, open **Settings → API** and copy:
   - **Project URL**
   - **Anon key**

## 2. Configure project environment

Create a local `.env.local` file in the repo root with:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

The repo already ignores `*.local`, so this file will stay private.

## 3. Enable authentication

In Supabase:

- Open **Authentication → Settings**
- Enable **Email** sign-up/sign-in
- Optionally enable **Google** or other providers
- Add the app URL to **Site URL**:
  - `http://localhost:8080`
- Add redirect URLs:
  - `http://localhost:8080/*`

## 4. Create the database schema

Open the SQL editor in Supabase and run the file at:

- `supabase/migrations/001_initial_schema.sql`

This creates:

- `users`
- `patients`
- `doctors`
- `schedules`
- `appointments`
- `prescriptions`
- `reviews`
- `notifications`

It also enables row-level security and applies the app-specific policies required by the project.

### Manual SQL execution steps

1. Open your Supabase project dashboard.
2. Click **SQL Editor** in the left sidebar.
3. Choose **New query**.
4. Copy the contents of `supabase/migrations/001_initial_schema.sql` and paste it into the query editor.
5. Click **Run**.
6. Confirm the query completed successfully and the tables appear under **Database → Tables**.

If there are any execution errors, Supabase will show the failing statement and line number in the SQL editor output.

### How the schema maps to the app

- `public.users` stores profile data for every authenticated user.
- `public.doctors` links a doctor profile to `users.id`.
- `public.patients` links a patient profile to `users.id`.
- `public.appointments` connects patients, doctors, and schedules.
- `public.prescriptions` is created by doctors for patients.
- `public.reviews` lets patients rate doctors.
- `public.notifications` delivers user-specific system messages.

## 5. Create storage buckets

The app uses file uploads for profile images, reports, prescriptions, and verification documents.

Create these private buckets:

```bash
supabase storage bucket create profile-images --public false
supabase storage bucket create medical-reports --public false
supabase storage bucket create prescriptions --public false
supabase storage bucket create verification-docs --public false
```

The project also includes `src/supabase/storage.ts` helpers to upload files and generate signed URLs.

## 6. Run the app locally

1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Open `http://localhost:8080`

## 7. Important integration notes

- Signup uses `src/supabase/auth.ts` and stores auth metadata:
  - `role`
  - `full_name`
- The app then creates a `public.users` row using the auth user ID.
- The `AuthProvider` uses `src/context/AuthContext.tsx` to load the matching `public.users` record.

## 8. Optional seeds

If you want sample data, populate the app after schema creation using SQL or the Supabase table editor.

## 9. Troubleshooting

- If auth fails, confirm `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct.
- If database queries fail, confirm the SQL migration was applied and RLS is enabled.
- If sign-up fails, confirm redirect URLs include `http://localhost:8080/*`.

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

The app will now use Supabase for all database and authentication operations!
