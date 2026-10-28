/*
# Institute ERP Schema

Creates the core tables for the college website + ERP system:
departments, courses, faculty, students, attendance, notices,
admission_inquiries, facilities.

## 1. New Tables
- departments: academic departments (name, code, head, description, established_year)
- courses: courses offered (title, code, department_id, credits, duration, description)
- faculty: faculty members (name, email, department_id, designation, qualification, bio, photo_url)
- students: students (name, email, roll_number, department_id, course_id, year, semester, status, phone)
- attendance: attendance records (student_id, date, status: present/absent/late, course_id, remarks)
- notices: public notices (title, content, category, date, is_pinned)
- admission_inquiries: contact form submissions (name, email, phone, course_interest, message)
- facilities: campus facilities (name, description, icon, image_url)

## 2. Security
- All tables: RLS enabled, CRUD granted to anon + authenticated (single-tenant shared/public data).
- Using (true) policies are intentional — this ERP uses a shared data model with no per-user isolation.
*/

CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  head text,
  description text,
  established_year int,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  code text NOT NULL UNIQUE,
  department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
  credits int NOT NULL DEFAULT 3,
  duration text NOT NULL DEFAULT '4 Years',
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS faculty (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
  designation text NOT NULL DEFAULT 'Assistant Professor',
  qualification text,
  bio text,
  photo_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  roll_number text NOT NULL UNIQUE,
  department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
  course_id uuid REFERENCES courses(id) ON DELETE SET NULL,
  year int NOT NULL DEFAULT 1,
  semester int NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'active',
  phone text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE SET NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'present',
  remarks text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  is_pinned boolean NOT NULL DEFAULT false,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admission_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  course_interest text,
  message text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text NOT NULL DEFAULT 'BookOpen',
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE admission_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON departments TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON courses TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON faculty TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON students TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON attendance TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON notices TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON admission_inquiries TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON facilities TO anon, authenticated;

-- Helper to create 4 CRUD policies for a shared table
-- departments
DROP POLICY IF EXISTS "dept_sel" ON departments; CREATE POLICY "dept_sel" ON departments FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "dept_ins" ON departments; CREATE POLICY "dept_ins" ON departments FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "dept_upd" ON departments; CREATE POLICY "dept_upd" ON departments FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "dept_del" ON departments; CREATE POLICY "dept_del" ON departments FOR DELETE TO anon, authenticated USING (true);

-- courses
DROP POLICY IF EXISTS "crs_sel" ON courses; CREATE POLICY "crs_sel" ON courses FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "crs_ins" ON courses; CREATE POLICY "crs_ins" ON courses FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "crs_upd" ON courses; CREATE POLICY "crs_upd" ON courses FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "crs_del" ON courses; CREATE POLICY "crs_del" ON courses FOR DELETE TO anon, authenticated USING (true);

-- faculty
DROP POLICY IF EXISTS "fac_sel" ON faculty; CREATE POLICY "fac_sel" ON faculty FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "fac_ins" ON faculty; CREATE POLICY "fac_ins" ON faculty FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "fac_upd" ON faculty; CREATE POLICY "fac_upd" ON faculty FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "fac_del" ON faculty; CREATE POLICY "fac_del" ON faculty FOR DELETE TO anon, authenticated USING (true);

-- students
DROP POLICY IF EXISTS "stu_sel" ON students; CREATE POLICY "stu_sel" ON students FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "stu_ins" ON students; CREATE POLICY "stu_ins" ON students FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "stu_upd" ON students; CREATE POLICY "stu_upd" ON students FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "stu_del" ON students; CREATE POLICY "stu_del" ON students FOR DELETE TO anon, authenticated USING (true);

-- attendance
DROP POLICY IF EXISTS "att_sel" ON attendance; CREATE POLICY "att_sel" ON attendance FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "att_ins" ON attendance; CREATE POLICY "att_ins" ON attendance FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "att_upd" ON attendance; CREATE POLICY "att_upd" ON attendance FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "att_del" ON attendance; CREATE POLICY "att_del" ON attendance FOR DELETE TO anon, authenticated USING (true);

-- notices
DROP POLICY IF EXISTS "not_sel" ON notices; CREATE POLICY "not_sel" ON notices FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "not_ins" ON notices; CREATE POLICY "not_ins" ON notices FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "not_upd" ON notices; CREATE POLICY "not_upd" ON notices FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "not_del" ON notices; CREATE POLICY "not_del" ON notices FOR DELETE TO anon, authenticated USING (true);

-- admission_inquiries
DROP POLICY IF EXISTS "inq_sel" ON admission_inquiries; CREATE POLICY "inq_sel" ON admission_inquiries FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "inq_ins" ON admission_inquiries; CREATE POLICY "inq_ins" ON admission_inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "inq_upd" ON admission_inquiries; CREATE POLICY "inq_upd" ON admission_inquiries FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "inq_del" ON admission_inquiries; CREATE POLICY "inq_del" ON admission_inquiries FOR DELETE TO anon, authenticated USING (true);

-- facilities
DROP POLICY IF EXISTS "faci_sel" ON facilities; CREATE POLICY "faci_sel" ON facilities FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "faci_ins" ON facilities; CREATE POLICY "faci_ins" ON facilities FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "faci_upd" ON facilities; CREATE POLICY "faci_upd" ON facilities FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "faci_del" ON facilities; CREATE POLICY "faci_del" ON facilities FOR DELETE TO anon, authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_courses_dept ON courses(department_id);
CREATE INDEX IF NOT EXISTS idx_faculty_dept ON faculty(department_id);
CREATE INDEX IF NOT EXISTS idx_students_dept ON students(department_id);
CREATE INDEX IF NOT EXISTS idx_students_course ON students(course_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_course ON attendance(course_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
