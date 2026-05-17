export type UserRole = "patient" | "doctor" | "admin";

export interface User {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  id: string;
  user_id: string;
  specialization: string;
  experience: number;
  consultation_fee: string;
  bio?: string;
  clinic_name?: string;
  clinic_address?: string;
  verified: boolean;
  rating: string;
  total_reviews: number;
  created_at: string;
}

export interface Patient {
  id: string;
  user_id: string;
  date_of_birth?: string;
  gender?: "male" | "female" | "other";
  address?: string;
  blood_group?: string;
  medical_history?: string;
  emergency_contact?: string;
  created_at: string;
}

export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed" | "rejected";

export interface Schedule {
  id: string;
  doctor_id: string;
  available_date: string;
  start_time: string;
  end_time: string;
  slot_duration: number;
  is_blocked: boolean;
  created_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  schedule_id?: string;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Prescription {
  id: string;
  appointment_id: string;
  doctor_id: string;
  patient_id: string;
  prescription_file_url?: string;
  notes?: string;
  follow_up_date?: string;
  created_at: string;
}

export interface Review {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id?: string;
  rating: number;
  review?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type?: "booking" | "reminder" | "cancellation" | "system";
  is_read: boolean;
  created_at: string;
}
