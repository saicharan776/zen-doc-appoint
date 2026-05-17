import type { PostgrestError, SupabaseStorageUploadResponse } from "@supabase/supabase-js";
import { supabase } from "./client";

const PROFILE_BUCKET = "profile-images";
const REPORT_BUCKET = "medical-reports";
const PRESCRIPTION_BUCKET = "prescriptions";
const VERIFICATION_BUCKET = "verification-docs";

/**
 * Upload a user profile image to the profile-images bucket.
 */
export async function uploadProfileImage(
  file: File,
  userId: string,
): Promise<SupabaseStorageUploadResponse> {
  return supabase.storage.from(PROFILE_BUCKET).upload(`profiles/${userId}/${file.name}`, file, {
    cacheControl: "3600",
    upsert: true,
  });
}

/**
 * Upload a medical report file for a patient.
 */
export async function uploadMedicalReport(
  file: File,
  patientId: string,
): Promise<SupabaseStorageUploadResponse> {
  return supabase.storage.from(REPORT_BUCKET).upload(`patients/${patientId}/${file.name}`, file, {
    cacheControl: "3600",
    upsert: true,
  });
}

/**
 * Upload a prescription file for an appointment.
 */
export async function uploadPrescription(
  file: File,
  appointmentId: string,
): Promise<SupabaseStorageUploadResponse> {
  return supabase.storage
    .from(PRESCRIPTION_BUCKET)
    .upload(`appointments/${appointmentId}/${file.name}`, file, {
      cacheControl: "3600",
      upsert: true,
    });
}

/**
 * Upload a verification document for a doctor.
 */
export async function uploadVerificationDoc(
  file: File,
  doctorId: string,
): Promise<SupabaseStorageUploadResponse> {
  return supabase.storage
    .from(VERIFICATION_BUCKET)
    .upload(`doctors/${doctorId}/${file.name}`, file, {
      cacheControl: "3600",
      upsert: true,
    });
}

/**
 * Generate a signed URL for private storage files.
 */
export async function createSignedUrl(
  bucket: string,
  path: string,
  expiresIn = 60,
): Promise<{ data: { signedUrl: string | null } | null; error: PostgrestError | null }> {
  return supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
}
