# Supabase Storage Buckets for MediCare Connect

This project uses four private Supabase storage buckets for user media and verification documents.

## Buckets

- `profile-images`
  - Use: user avatars and profile photos.
  - Access: private. Generate signed URLs for authenticated access.

- `medical-reports`
  - Use: patient medical report files and uploads.
  - Access: private. Only the owning patient and authorized doctors should access this data.

- `prescriptions`
  - Use: prescription documents created by doctors.
  - Access: private. Patient and doctor access through signed URLs.

- `verification-docs`
  - Use: identity and license verification documents for doctor onboarding.
  - Access: private. Admins should have access for review.

## Recommended creation commands

```bash
supabase storage bucket create profile-images --public false
supabase storage bucket create medical-reports --public false
supabase storage bucket create prescriptions --public false
supabase storage bucket create verification-docs --public false
```

## Access guidance

- Store each file path with a user-specific prefix to isolate resources.
- Use `createSignedUrl` from `src/supabase/storage.ts` for authenticated downloads.
- Avoid exposing raw bucket paths in client code.

## Example file paths

- `profiles/{userId}/{fileName}`
- `patients/{patientId}/{fileName}`
- `appointments/{appointmentId}/{fileName}`
- `doctors/{doctorId}/{fileName}`

## Storage policy notes

Because Supabase storage policy rules are separate from database RLS, enforce access using:

- `request.auth.uid()` on upload and download requests
- bucket metadata or file path conventions
- a server-side function or edge function if you need complex role-based access
