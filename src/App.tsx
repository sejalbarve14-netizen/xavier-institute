import { Routes, Route } from 'react-router-dom';
import PublicLayout from '@/layouts/PublicLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import Home from '@/pages/public/Home';
import About from '@/pages/public/About';
import Courses from '@/pages/public/Courses';
import Departments from '@/pages/public/Departments';
import Admissions from '@/pages/public/Admissions';
import FacultyPage from '@/pages/public/FacultyPage';
import Facilities from '@/pages/public/Facilities';
import Notices from '@/pages/public/Notices';
import Contact from '@/pages/public/Contact';
import DashboardHome from '@/pages/dashboard/DashboardHome';
import ManageStudents from '@/pages/dashboard/ManageStudents';
import ManageFaculty from '@/pages/dashboard/ManageFaculty';
import ManageCourses from '@/pages/dashboard/ManageCourses';
import ManageAttendance from '@/pages/dashboard/ManageAttendance';
import ManageNotices from '@/pages/dashboard/ManageNotices';
import ManageDepartments from '@/pages/dashboard/ManageDepartments';
import ManageAdmissions from '@/pages/dashboard/ManageAdmissions';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/faculty" element={<FacultyPage />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
      <Route path="/erp" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="students" element={<ManageStudents />} />
        <Route path="faculty" element={<ManageFaculty />} />
        <Route path="courses" element={<ManageCourses />} />
        <Route path="attendance" element={<ManageAttendance />} />
        <Route path="notices" element={<ManageNotices />} />
        <Route path="departments" element={<ManageDepartments />} />
        <Route path="admissions" element={<ManageAdmissions />} />
      </Route>
    </Routes>
  );
}
