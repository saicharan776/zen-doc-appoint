export type Specialization =
  | "Cardiology"
  | "Dermatology"
  | "Pediatrics"
  | "Neurology"
  | "Orthopedics"
  | "General Physician"
  | "Psychiatry"
  | "Gynecology"
  | "Dentistry";

export interface Doctor {
  id: string;
  name: string;
  specialization: Specialization;
  experience: number;
  fee: number;
  rating: number;
  reviews: number;
  location: string;
  clinic: string;
  qualifications: string;
  about: string;
  avatar: string;
  available: boolean;
  nextSlot: string;
  verified: boolean;
}

const avatars = [
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=240&h=240&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=240&h=240&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=240&h=240&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=240&h=240&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=240&h=240&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=240&h=240&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=240&h=240&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=240&h=240&fit=crop&crop=faces",
];

export const doctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Aanya Sharma",
    specialization: "Cardiology",
    experience: 12,
    fee: 1200,
    rating: 4.9,
    reviews: 312,
    location: "Mumbai",
    clinic: "Heartwell Clinic",
    qualifications: "MBBS, MD (Cardiology), DM",
    about: "Senior interventional cardiologist focused on preventive cardiac care.",
    avatar: avatars[0],
    available: true,
    nextSlot: "Today, 4:30 PM",
    verified: true,
  },
  {
    id: "d2",
    name: "Dr. Rohan Mehta",
    specialization: "Dermatology",
    experience: 8,
    fee: 800,
    rating: 4.7,
    reviews: 198,
    location: "Bengaluru",
    clinic: "SkinScience",
    qualifications: "MBBS, MD (Dermatology)",
    about: "Cosmetic dermatology, acne and pigmentation specialist.",
    avatar: avatars[1],
    available: true,
    nextSlot: "Tomorrow, 10:00 AM",
    verified: true,
  },
  {
    id: "d3",
    name: "Dr. Priya Nair",
    specialization: "Pediatrics",
    experience: 10,
    fee: 700,
    rating: 4.95,
    reviews: 421,
    location: "Kochi",
    clinic: "Little Steps",
    qualifications: "MBBS, DCH, MD (Pediatrics)",
    about: "Newborn and child wellness, vaccinations, growth monitoring.",
    avatar: avatars[2],
    available: true,
    nextSlot: "Today, 6:15 PM",
    verified: true,
  },
  {
    id: "d4",
    name: "Dr. Arjun Verma",
    specialization: "Neurology",
    experience: 15,
    fee: 1500,
    rating: 4.8,
    reviews: 256,
    location: "Delhi",
    clinic: "Neuro Centre",
    qualifications: "MBBS, MD, DM (Neurology)",
    about: "Headache, epilepsy and stroke management.",
    avatar: avatars[3],
    available: false,
    nextSlot: "Mon, 11:00 AM",
    verified: true,
  },
  {
    id: "d5",
    name: "Dr. Kavya Iyer",
    specialization: "Gynecology",
    experience: 9,
    fee: 900,
    rating: 4.85,
    reviews: 287,
    location: "Chennai",
    clinic: "Aarogya Women's",
    qualifications: "MBBS, MS (OBG)",
    about: "Pregnancy care, PCOS, fertility and menopause.",
    avatar: avatars[4],
    available: true,
    nextSlot: "Today, 5:00 PM",
    verified: true,
  },
  {
    id: "d6",
    name: "Dr. Sameer Khan",
    specialization: "Orthopedics",
    experience: 14,
    fee: 1100,
    rating: 4.75,
    reviews: 174,
    location: "Hyderabad",
    clinic: "BoneCare Ortho",
    qualifications: "MBBS, MS (Ortho)",
    about: "Joint replacement and sports injury rehabilitation.",
    avatar: avatars[5],
    available: true,
    nextSlot: "Tomorrow, 9:30 AM",
    verified: true,
  },
  {
    id: "d7",
    name: "Dr. Neha Kapoor",
    specialization: "Psychiatry",
    experience: 7,
    fee: 1000,
    rating: 4.9,
    reviews: 142,
    location: "Pune",
    clinic: "MindWell",
    qualifications: "MBBS, MD (Psychiatry)",
    about: "Anxiety, depression, ADHD and therapy support.",
    avatar: avatars[6],
    available: true,
    nextSlot: "Today, 7:00 PM",
    verified: true,
  },
  {
    id: "d8",
    name: "Dr. Vikram Rao",
    specialization: "General Physician",
    experience: 20,
    fee: 600,
    rating: 4.6,
    reviews: 502,
    location: "Bengaluru",
    clinic: "FamilyCare",
    qualifications: "MBBS, MD (Medicine)",
    about: "Family medicine, chronic care and preventive screenings.",
    avatar: avatars[7],
    available: true,
    nextSlot: "Today, 3:00 PM",
    verified: true,
  },
];

export const specializations: Specialization[] = [
  "Cardiology",
  "Dermatology",
  "Pediatrics",
  "Neurology",
  "Orthopedics",
  "General Physician",
  "Psychiatry",
  "Gynecology",
  "Dentistry",
];

export type AppointmentStatus = "upcoming" | "completed" | "cancelled" | "pending";

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  patientName: string;
  date: string;
  time: string;
  reason: string;
  status: AppointmentStatus;
  fee: number;
}

export const patientAppointments: Appointment[] = [
  {
    id: "a1",
    doctorId: "d1",
    doctorName: "Dr. Aanya Sharma",
    specialization: "Cardiology",
    patientName: "You",
    date: "2026-05-18",
    time: "4:30 PM",
    reason: "Follow-up review",
    status: "upcoming",
    fee: 1200,
  },
  {
    id: "a2",
    doctorId: "d3",
    doctorName: "Dr. Priya Nair",
    specialization: "Pediatrics",
    patientName: "You",
    date: "2026-05-22",
    time: "6:15 PM",
    reason: "Child vaccination",
    status: "upcoming",
    fee: 700,
  },
  {
    id: "a3",
    doctorId: "d8",
    doctorName: "Dr. Vikram Rao",
    specialization: "General Physician",
    patientName: "You",
    date: "2026-04-30",
    time: "10:00 AM",
    reason: "Fever & body ache",
    status: "completed",
    fee: 600,
  },
  {
    id: "a4",
    doctorId: "d2",
    doctorName: "Dr. Rohan Mehta",
    specialization: "Dermatology",
    patientName: "You",
    date: "2026-04-12",
    time: "2:00 PM",
    reason: "Skin allergy",
    status: "completed",
    fee: 800,
  },
  {
    id: "a5",
    doctorId: "d6",
    doctorName: "Dr. Sameer Khan",
    specialization: "Orthopedics",
    patientName: "You",
    date: "2026-03-28",
    time: "9:30 AM",
    reason: "Knee pain",
    status: "cancelled",
    fee: 1100,
  },
];

export const doctorAppointments: Appointment[] = [
  {
    id: "b1",
    doctorId: "d1",
    doctorName: "Dr. Aanya Sharma",
    specialization: "Cardiology",
    patientName: "Rahul Sen",
    date: "2026-05-15",
    time: "10:00 AM",
    reason: "Chest discomfort",
    status: "pending",
    fee: 1200,
  },
  {
    id: "b2",
    doctorId: "d1",
    doctorName: "Dr. Aanya Sharma",
    specialization: "Cardiology",
    patientName: "Meera Pillai",
    date: "2026-05-15",
    time: "11:30 AM",
    reason: "BP review",
    status: "upcoming",
    fee: 1200,
  },
  {
    id: "b3",
    doctorId: "d1",
    doctorName: "Dr. Aanya Sharma",
    specialization: "Cardiology",
    patientName: "Aditya Joshi",
    date: "2026-05-15",
    time: "2:00 PM",
    reason: "ECG report",
    status: "upcoming",
    fee: 1200,
  },
  {
    id: "b4",
    doctorId: "d1",
    doctorName: "Dr. Aanya Sharma",
    specialization: "Cardiology",
    patientName: "Sara Khan",
    date: "2026-05-16",
    time: "9:00 AM",
    reason: "Annual check",
    status: "pending",
    fee: 1200,
  },
  {
    id: "b5",
    doctorId: "d1",
    doctorName: "Dr. Aanya Sharma",
    specialization: "Cardiology",
    patientName: "Rohit Das",
    date: "2026-05-13",
    time: "3:30 PM",
    reason: "Cholesterol",
    status: "completed",
    fee: 1200,
  },
];

export interface Prescription {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  medicines: { name: string; dose: string; duration: string }[];
  notes: string;
}

export const prescriptions: Prescription[] = [
  {
    id: "p1",
    patientName: "You",
    doctorName: "Dr. Vikram Rao",
    date: "2026-04-30",
    diagnosis: "Viral fever",
    medicines: [
      { name: "Paracetamol 650mg", dose: "1-0-1", duration: "3 days" },
      { name: "Cetirizine 10mg", dose: "0-0-1", duration: "5 days" },
    ],
    notes: "Plenty of fluids. Review if fever persists beyond 3 days.",
  },
  {
    id: "p2",
    patientName: "You",
    doctorName: "Dr. Rohan Mehta",
    date: "2026-04-12",
    diagnosis: "Contact dermatitis",
    medicines: [{ name: "Mometasone cream", dose: "Apply BD", duration: "10 days" }],
    notes: "Avoid harsh soaps. Use mild moisturiser twice daily.",
  },
];

export interface Review {
  id: string;
  patient: string;
  rating: number;
  text: string;
  date: string;
}

export const sampleReviews: Review[] = [
  {
    id: "r1",
    patient: "Anita R.",
    rating: 5,
    text: "Very patient, explained everything clearly. Highly recommend.",
    date: "2 weeks ago",
  },
  {
    id: "r2",
    patient: "Karthik V.",
    rating: 5,
    text: "Top-class diagnosis and follow-up care.",
    date: "1 month ago",
  },
  {
    id: "r3",
    patient: "Shreya M.",
    rating: 4,
    text: "Great experience overall, slight wait time at clinic.",
    date: "2 months ago",
  },
];

export const adminStats = {
  totalPatients: 12845,
  totalDoctors: 326,
  appointmentsToday: 482,
  pendingApprovals: 7,
  monthlyAppointments: [
    { m: "Dec", v: 1820 },
    { m: "Jan", v: 2104 },
    { m: "Feb", v: 2390 },
    { m: "Mar", v: 2750 },
    { m: "Apr", v: 3120 },
    { m: "May", v: 3580 },
  ],
  specializationSplit: [
    { name: "Cardiology", value: 22 },
    { name: "Pediatrics", value: 18 },
    { name: "Dermatology", value: 14 },
    { name: "Orthopedics", value: 12 },
    { name: "Other", value: 34 },
  ],
};

export const pendingDoctors = [
  {
    id: "pd1",
    name: "Dr. Ishaan Gupta",
    specialization: "ENT",
    submitted: "2026-05-12",
    documents: 4,
  },
  {
    id: "pd2",
    name: "Dr. Tara Singh",
    specialization: "Dermatology",
    submitted: "2026-05-13",
    documents: 5,
  },
  {
    id: "pd3",
    name: "Dr. Manav Bose",
    specialization: "Cardiology",
    submitted: "2026-05-14",
    documents: 6,
  },
];

export const platformUsers = [
  {
    id: "u1",
    name: "Rahul Sen",
    email: "rahul@example.com",
    role: "Patient",
    joined: "2026-01-12",
    status: "Active",
  },
  {
    id: "u2",
    name: "Dr. Aanya Sharma",
    email: "aanya@medicare.app",
    role: "Doctor",
    joined: "2025-11-04",
    status: "Active",
  },
  {
    id: "u3",
    name: "Meera Pillai",
    email: "meera@example.com",
    role: "Patient",
    joined: "2026-02-18",
    status: "Active",
  },
  {
    id: "u4",
    name: "Dr. Arjun Verma",
    email: "arjun@medicare.app",
    role: "Doctor",
    joined: "2025-10-22",
    status: "Active",
  },
  {
    id: "u5",
    name: "Sara Khan",
    email: "sara@example.com",
    role: "Patient",
    joined: "2026-03-09",
    status: "Blocked",
  },
];
