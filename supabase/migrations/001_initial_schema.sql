-- Initial schema for MediCare Connect
-- Run this in your Supabase SQL editor to create the full project schema.

create extension if not exists "uuid-ossp";

create type appointment_status as enum ('pending', 'confirmed', 'cancelled', 'completed', 'rejected');
create type notification_type as enum ('booking', 'reminder', 'cancellation', 'system');
create type gender_type as enum ('male', 'female', 'other');
create type user_role_type as enum ('patient', 'doctor', 'admin');

create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role_type not null,
  full_name text not null,
  email text not null unique,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table patients (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade unique,
  date_of_birth date,
  gender gender_type,
  address text,
  blood_group text,
  medical_history text,
  emergency_contact text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table doctors (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade unique,
  specialization text not null,
  experience integer not null default 0,
  consultation_fee numeric(10,2) not null default 0,
  bio text,
  clinic_name text,
  clinic_address text,
  verified boolean not null default false,
  rating numeric(3,2) not null default 0,
  total_reviews integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table schedules (
  id uuid primary key default uuid_generate_v4(),
  doctor_id uuid not null references doctors(id) on delete cascade,
  available_date date not null,
  start_time time not null,
  end_time time not null,
  slot_duration integer not null default 30,
  is_blocked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table appointments (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references users(id) on delete cascade,
  doctor_id uuid not null references doctors(id) on delete cascade,
  schedule_id uuid references schedules(id) on delete set null,
  appointment_date date not null,
  appointment_time time not null,
  status appointment_status not null default 'pending',
  reason text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table prescriptions (
  id uuid primary key default uuid_generate_v4(),
  appointment_id uuid not null references appointments(id) on delete cascade,
  doctor_id uuid not null references doctors(id) on delete cascade,
  patient_id uuid not null references users(id) on delete cascade,
  prescription_file_url text,
  notes text,
  follow_up_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table reviews (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references users(id) on delete cascade,
  doctor_id uuid not null references doctors(id) on delete cascade,
  appointment_id uuid references appointments(id) on delete set null,
  rating integer not null check (rating >= 1 and rating <= 5),
  review text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  title text not null,
  message text not null,
  type notification_type not null default 'system',
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_patients_user_id on patients(user_id);
create index idx_doctors_user_id on doctors(user_id);
create index idx_schedules_doctor_id on schedules(doctor_id);
create index idx_appointments_patient_id on appointments(patient_id);
create index idx_appointments_doctor_id on appointments(doctor_id);
create index idx_prescriptions_doctor_id on prescriptions(doctor_id);
create index idx_prescriptions_patient_id on prescriptions(patient_id);
create index idx_reviews_doctor_id on reviews(doctor_id);
create index idx_reviews_patient_id on reviews(patient_id);
create index idx_notifications_user_id on notifications(user_id);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_set_updated_at
before update on users
for each row execute procedure set_updated_at();

create trigger patients_set_updated_at
before update on patients
for each row execute procedure set_updated_at();

create trigger doctors_set_updated_at
before update on doctors
for each row execute procedure set_updated_at();

create trigger schedules_set_updated_at
before update on schedules
for each row execute procedure set_updated_at();

create trigger appointments_set_updated_at
before update on appointments
for each row execute procedure set_updated_at();

create trigger prescriptions_set_updated_at
before update on prescriptions
for each row execute procedure set_updated_at();

create trigger reviews_set_updated_at
before update on reviews
for each row execute procedure set_updated_at();

create trigger notifications_set_updated_at
before update on notifications
for each row execute procedure set_updated_at();

alter table users enable row level security;
alter table patients enable row level security;
alter table doctors enable row level security;
alter table schedules enable row level security;
alter table appointments enable row level security;
alter table prescriptions enable row level security;
alter table reviews enable row level security;
alter table notifications enable row level security;

create policy users_select_own on users
  for select using (auth.uid() = id);

create policy users_select_admin on users
  for select using (exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin'));

create policy users_insert_own on users
  for insert with check (auth.uid() = id);

create policy users_update_own on users
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy patients_select_own on patients
  for select using (
    user_id = auth.uid() or exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin')
  );

create policy patients_insert_own on patients
  for insert with check (
    user_id = auth.uid() and exists (select 1 from users u where u.id = auth.uid() and u.role = 'patient')
  );

create policy patients_update_own on patients
  for update using (
    user_id = auth.uid() or exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin')
  ) with check (
    user_id = auth.uid() or exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin')
  );

create policy doctors_select_public on doctors
  for select using (
    verified or user_id = auth.uid() or exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin')
  );

create policy doctors_insert_own on doctors
  for insert with check (
    user_id = auth.uid() and exists (select 1 from users u where u.id = auth.uid() and u.role = 'doctor')
  );

create policy doctors_update_own on doctors
  for update using (
    user_id = auth.uid() or exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin')
  ) with check (
    user_id = auth.uid() or exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin')
  );

create policy schedules_select_authenticated on schedules
  for select using (auth.uid() is not null);

create policy schedules_insert_owner on schedules
  for insert with check (
    doctor_id in (select id from doctors where user_id = auth.uid())
  );

create policy schedules_update_owner on schedules
  for update using (
    doctor_id in (select id from doctors where user_id = auth.uid()) or exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin')
  ) with check (
    doctor_id in (select id from doctors where user_id = auth.uid()) or exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin')
  );

create policy schedules_delete_admin on schedules
  for delete using (exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin'));

create policy appointments_select_owner on appointments
  for select using (
    patient_id = auth.uid()
    or doctor_id in (select id from doctors where user_id = auth.uid())
    or exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin')
  );

create policy appointments_insert_patient on appointments
  for insert with check (
    patient_id = auth.uid()
  );

create policy appointments_update_owner on appointments
  for update using (
    patient_id = auth.uid()
    or doctor_id in (select id from doctors where user_id = auth.uid())
    or exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin')
  );

create policy appointments_delete_admin on appointments
  for delete using (exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin'));

create policy prescriptions_select_owner on prescriptions
  for select using (
    patient_id = auth.uid()
    or doctor_id in (select id from doctors where user_id = auth.uid())
    or exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin')
  );

create policy prescriptions_insert_doctor on prescriptions
  for insert with check (
    doctor_id in (select id from doctors where user_id = auth.uid())
  );

create policy prescriptions_update_doctor on prescriptions
  for update using (
    doctor_id in (select id from doctors where user_id = auth.uid())
    or exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin')
  );

create policy reviews_select_owner on reviews
  for select using (
    patient_id = auth.uid()
    or doctor_id in (select id from doctors where user_id = auth.uid())
    or exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin')
  );

create policy reviews_insert_patient on reviews
  for insert with check (
    patient_id = auth.uid()
  );

create policy reviews_update_owner on reviews
  for update using (
    patient_id = auth.uid()
    or exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin')
  );

create policy notifications_select_own on notifications
  for select using (
    user_id = auth.uid() or exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin')
  );

create policy notifications_insert_owner on notifications
  for insert with check (
    user_id = auth.uid() or exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin')
  );

create policy notifications_update_owner on notifications
  for update using (
    user_id = auth.uid() or exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin')
  ) with check (
    user_id = auth.uid() or exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin')
  );
