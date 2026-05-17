import type {
  PostgrestError,
  PostgrestMaybeSingleResponse,
  PostgrestResponse,
} from "@supabase/supabase-js";
import { supabase } from "./client";
import type {
  Appointment,
  Doctor,
  Notification,
  Patient,
  Prescription,
  Review,
  Schedule,
  User,
  UserRole,
  AppointmentStatus,
} from "@/types";

export interface PatientOverview {
  appointments: Appointment[];
  prescriptions: Prescription[];
  recommendedDoctors: Doctor[];
  counts: {
    upcoming: number;
    completed: number;
    prescriptions: number;
  };
}

export interface DoctorOverview {
  appointments: Appointment[];
  today: number;
  upcoming: number;
  completed: number;
}

export interface AdminStats {
  users: number;
  doctors: number;
  patients: number;
  appointments: number;
  pendingDoctors: number;
}

export async function getUserById(id: string): Promise<PostgrestMaybeSingleResponse<User>> {
  return supabase.from("users").select("*").eq("id", id).maybeSingle();
}

export async function getUserByEmail(email: string): Promise<PostgrestMaybeSingleResponse<User>> {
  return supabase.from("users").select("*").eq("email", email).maybeSingle();
}

export async function createUser(
  user: Omit<User, "created_at" | "updated_at">,
): Promise<PostgrestResponse<User>> {
  return supabase.from("users").insert(user);
}

export async function createUserProfile(
  userId: string,
  profile: Omit<User, "id" | "created_at" | "updated_at">,
): Promise<PostgrestResponse<User>> {
  return supabase.from("users").insert([{ id: userId, ...profile }]);
}

export async function updateUser(
  id: string,
  updates: Partial<Omit<User, "id" | "created_at">>,
): Promise<PostgrestMaybeSingleResponse<User>> {
  return supabase.from("users").update(updates).eq("id", id).single();
}

export async function getDoctorByUserId(
  userId: string,
): Promise<PostgrestMaybeSingleResponse<Doctor>> {
  return supabase.from("doctors").select("*").eq("user_id", userId).maybeSingle();
}

export async function getDoctorById(id: string): Promise<PostgrestMaybeSingleResponse<Doctor>> {
  return supabase.from("doctors").select("*").eq("id", id).maybeSingle();
}

export async function createDoctor(
  doctor: Omit<Doctor, "id" | "verified" | "rating" | "total_reviews" | "created_at">,
): Promise<PostgrestResponse<Doctor>> {
  return supabase.from("doctors").insert(doctor);
}

export async function updateDoctor(
  id: string,
  updates: Partial<Omit<Doctor, "id" | "user_id" | "created_at">>,
): Promise<PostgrestMaybeSingleResponse<Doctor>> {
  return supabase.from("doctors").update(updates).eq("id", id).single();
}

export async function getPatientByUserId(
  userId: string,
): Promise<PostgrestMaybeSingleResponse<Patient>> {
  return supabase.from("patients").select("*").eq("user_id", userId).maybeSingle();
}

export async function createPatient(
  patient: Pick<Patient, "user_id">,
): Promise<PostgrestResponse<Patient>> {
  return supabase.from("patients").insert([{ user_id: patient.user_id }]);
}

export async function updatePatient(
  id: string,
  updates: Partial<Omit<Patient, "id" | "user_id" | "created_at">>,
): Promise<PostgrestMaybeSingleResponse<Patient>> {
  return supabase.from("patients").update(updates).eq("id", id).single();
}

export async function getSchedulesByDoctorId(
  doctorId: string,
): Promise<PostgrestResponse<Schedule>> {
  return supabase.from("schedules").select("*").eq("doctor_id", doctorId);
}

export async function createSchedule(
  schedule: Omit<Schedule, "id" | "created_at">,
): Promise<PostgrestResponse<Schedule>> {
  return supabase.from("schedules").insert(schedule);
}

export async function getAppointmentsByPatientId(
  patientId: string,
): Promise<PostgrestResponse<Appointment>> {
  return supabase
    .from("appointments")
    .select("*")
    .eq("patient_id", patientId)
    .order("appointment_date", { ascending: false });
}

export async function getPatientAppointments(
  patientId: string,
): Promise<PostgrestResponse<Appointment>> {
  return getAppointmentsByPatientId(patientId);
}

export async function getAppointmentsByDoctorId(
  doctorId: string,
): Promise<PostgrestResponse<Appointment>> {
  return supabase
    .from("appointments")
    .select("*")
    .eq("doctor_id", doctorId)
    .order("appointment_date", { ascending: false });
}

export async function getAppointmentById(
  id: string,
): Promise<PostgrestMaybeSingleResponse<Appointment>> {
  return supabase.from("appointments").select("*").eq("id", id).maybeSingle();
}

export async function createAppointment(
  appointment: Omit<Appointment, "id" | "created_at" | "updated_at">,
): Promise<PostgrestResponse<Appointment>> {
  return supabase.from("appointments").insert(appointment);
}

export async function updateAppointment(
  id: string,
  updates: Partial<Omit<Appointment, "id" | "created_at">>,
): Promise<PostgrestMaybeSingleResponse<Appointment>> {
  return supabase.from("appointments").update(updates).eq("id", id).single();
}

export async function createPrescription(
  prescription: Omit<Prescription, "id" | "created_at">,
): Promise<PostgrestResponse<Prescription>> {
  return supabase.from("prescriptions").insert(prescription);
}

export async function getPrescriptionsByPatientId(
  patientId: string,
): Promise<PostgrestResponse<Prescription>> {
  return supabase.from("prescriptions").select("*").eq("patient_id", patientId);
}

export async function getPrescriptionsByDoctorId(
  doctorId: string,
): Promise<PostgrestResponse<Prescription>> {
  return supabase.from("prescriptions").select("*").eq("doctor_id", doctorId);
}

export async function createReview(
  review: Omit<Review, "id" | "created_at">,
): Promise<PostgrestResponse<Review>> {
  return supabase.from("reviews").insert(review);
}

export async function getReviewsByDoctorId(doctorId: string): Promise<PostgrestResponse<Review>> {
  return supabase.from("reviews").select("*").eq("doctor_id", doctorId);
}

export async function updateReview(
  id: string,
  updates: Partial<Omit<Review, "id" | "patient_id" | "doctor_id" | "created_at">>,
): Promise<PostgrestMaybeSingleResponse<Review>> {
  return supabase.from("reviews").update(updates).eq("id", id).single();
}

export async function deleteReview(id: string): Promise<PostgrestMaybeSingleResponse<Review>> {
  return supabase.from("reviews").delete().eq("id", id).single();
}

export async function getVerifiedDoctors(): Promise<PostgrestResponse<Doctor>> {
  return supabase.from("doctors").select("*").eq("verified", true);
}

export async function getDoctors(): Promise<PostgrestResponse<Doctor>> {
  return supabase.from("doctors").select("*");
}

export async function getSpecializations(): Promise<PostgrestResponse<{ specialization: string }>> {
  return supabase
    .from("doctors")
    .select("specialization", { count: "exact" })
    .neq("specialization", "")
    .order("specialization", { ascending: true });
}

export async function getFeaturedDoctors(): Promise<PostgrestResponse<Doctor>> {
  return supabase.from("doctors").select("*").order("rating", { ascending: false }).limit(6);
}

export async function getPatientOverview(
  patientId: string,
): Promise<PatientOverview & { error?: PostgrestError | null }> {
  const [
    { data: appointments },
    { data: prescriptions },
    { data: recommendedDoctors },
    { data: user },
  ] = await Promise.all([
    getAppointmentsByPatientId(patientId),
    getPrescriptionsByPatientId(patientId),
    getFeaturedDoctors(),
    getUserById(patientId),
  ]);

  const counts = {
    upcoming:
      appointments?.filter((item) => item.status === "confirmed" || item.status === "pending")
        .length ?? 0,
    completed: appointments?.filter((item) => item.status === "completed").length ?? 0,
    prescriptions: prescriptions?.length ?? 0,
  };

  return {
    appointments: appointments ?? [],
    prescriptions: prescriptions ?? [],
    recommendedDoctors: recommendedDoctors ?? [],
    counts,
  };
}

export async function getDoctorOverview(
  doctorId: string,
): Promise<DoctorOverview & { error?: PostgrestError | null }> {
  const response = await getAppointmentsByDoctorId(doctorId);
  const appointments = response.data ?? [];
  const today = appointments.filter(
    (appointment) =>
      new Date(appointment.appointment_date).toDateString() === new Date().toDateString(),
  ).length;
  const upcoming = appointments.filter((appointment) => appointment.status === "confirmed").length;
  const completed = appointments.filter((appointment) => appointment.status === "completed").length;

  return {
    appointments,
    today,
    upcoming,
    completed,
  };
}

export async function getPendingDoctors(): Promise<PostgrestResponse<Doctor>> {
  return supabase.from("doctors").select("*").eq("verified", false);
}

export async function getPlatformUsers(): Promise<PostgrestResponse<User>> {
  return supabase.from("users").select("*");
}

export async function getAdminStats(): Promise<AdminStats & { error?: PostgrestError | null }> {
  const [
    { count: userCount },
    { count: doctorCount },
    { count: patientCount },
    { count: appointmentCount },
  ] = await Promise.all([
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase.from("doctors").select("id", { count: "exact", head: true }),
    supabase.from("patients").select("id", { count: "exact", head: true }),
    supabase.from("appointments").select("id", { count: "exact", head: true }),
  ]);

  return {
    users: userCount ?? 0,
    doctors: doctorCount ?? 0,
    patients: patientCount ?? 0,
    appointments: appointmentCount ?? 0,
    pendingDoctors: (await getPendingDoctors()).data?.length ?? 0,
  };
}

export async function getPatientPrescriptions(
  patientId: string,
): Promise<PostgrestResponse<Prescription>> {
  return getPrescriptionsByPatientId(patientId);
}

export async function getDoctorAppointments(
  doctorId: string,
): Promise<PostgrestResponse<Appointment>> {
  return getAppointmentsByDoctorId(doctorId);
}

export async function getPatientByAuthId(
  authId: string,
): Promise<PostgrestMaybeSingleResponse<Patient>> {
  return supabase.from("patients").select("*").eq("user_id", authId).maybeSingle();
}

export async function getDoctorByAuthId(
  authId: string,
): Promise<PostgrestMaybeSingleResponse<Doctor>> {
  return supabase.from("doctors").select("*").eq("user_id", authId).maybeSingle();
}
