export interface Department {
  id: string;
  name: string;
  code: string;
  head: string | null;
  description: string | null;
  established_year: number | null;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  code: string;
  department_id: string | null;
  credits: number;
  duration: string;
  description: string | null;
  created_at: string;
  department?: Department | null;
}

export interface Faculty {
  id: string;
  name: string;
  email: string | null;
  department_id: string | null;
  designation: string;
  qualification: string | null;
  bio: string | null;
  photo_url: string | null;
  created_at: string;
  department?: Department | null;
}

export interface Student {
  id: string;
  name: string;
  email: string | null;
  roll_number: string;
  department_id: string | null;
  course_id: string | null;
  year: number;
  semester: number;
  status: string;
  phone: string | null;
  created_at: string;
  department?: Department | null;
  course?: Course | null;
}

export interface Attendance {
  id: string;
  student_id: string;
  course_id: string | null;
  date: string;
  status: 'present' | 'absent' | 'late';
  remarks: string | null;
  created_at: string;
  student?: Student | null;
  course?: Course | null;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  is_pinned: boolean;
  date: string;
  created_at: string;
}

export interface AdmissionInquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  course_interest: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

export interface Facility {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  image_url: string | null;
  created_at: string;
}
