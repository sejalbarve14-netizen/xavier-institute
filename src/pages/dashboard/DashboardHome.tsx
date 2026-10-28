import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, GraduationCap, BookOpen, Building2, CalendarCheck,
  Megaphone, FileText, ArrowRight, TrendingUp, UserCheck, UserX, Clock,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Student, Notice, AdmissionInquiry } from '@/lib/types';
import StatCard from '@/components/StatCard';

export default function DashboardHome() {
  const [stats, setStats] = useState({
    students: 0,
    faculty: 0,
    courses: 0,
    departments: 0,
    notices: 0,
    inquiries: 0,
  });
  const [recentStudents, setRecentStudents] = useState<Student[]>([]);
  const [recentNotices, setRecentNotices] = useState<Notice[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<AdmissionInquiry[]>([]);
  const [attendanceStats, setAttendanceStats] = useState({ present: 0, absent: 0, late: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [
        { count: sCount }, { count: fCount }, { count: cCount },
        { count: dCount }, { count: nCount }, { count: iCount },
        { data: rStudents }, { data: rNotices }, { data: rInquiries },
        { data: attToday },
      ] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact', head: true }),
        supabase.from('faculty').select('*', { count: 'exact', head: true }),
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('departments').select('*', { count: 'exact', head: true }),
        supabase.from('notices').select('*', { count: 'exact', head: true }),
        supabase.from('admission_inquiries').select('*', { count: 'exact', head: true }),
        supabase.from('students').select('*, department:departments(*), course:courses(*)').order('created_at', { ascending: false }).limit(5),
        supabase.from('notices').select('*').order('date', { ascending: false }).limit(4),
        supabase.from('admission_inquiries').select('*').order('created_at', { ascending: false }).limit(4),
        supabase.from('attendance').select('status').eq('date', new Date().toISOString().slice(0, 10)),
      ]);
      setStats({
        students: sCount || 0, faculty: fCount || 0, courses: cCount || 0,
        departments: dCount || 0, notices: nCount || 0, inquiries: iCount || 0,
      });
      setRecentStudents(rStudents || []);
      setRecentNotices(rNotices || []);
      setRecentInquiries(rInquiries || []);
      const att = (attToday || []);
      setAttendanceStats({
        present: att.filter((a: { status: string }) => a.status === 'present').length,
        absent: att.filter((a: { status: string }) => a.status === 'absent').length,
        late: att.filter((a: { status: string }) => a.status === 'late').length,
      });
      setLoading(false);
    })();
  }, []);

  const totalAttendance = attendanceStats.present + attendanceStats.absent + attendanceStats.late;
  const attendanceRate = totalAttendance > 0 ? Math.round((attendanceStats.present / totalAttendance) * 100) : 0;

  const quickLinks = [
    { to: '/erp/students', label: 'Manage Students', icon: <Users className="h-5 w-5" />, desc: `${stats.students} enrolled` },
    { to: '/erp/faculty', label: 'Manage Faculty', icon: <GraduationCap className="h-5 w-5" />, desc: `${stats.faculty} members` },
    { to: '/erp/courses', label: 'Manage Courses', icon: <BookOpen className="h-5 w-5" />, desc: `${stats.courses} programs` },
    { to: '/erp/attendance', label: 'Mark Attendance', icon: <CalendarCheck className="h-5 w-5" />, desc: `${attendanceRate}% today` },
    { to: '/erp/notices', label: 'Post Notice', icon: <Megaphone className="h-5 w-5" />, desc: `${stats.notices} total` },
    { to: '/erp/admissions', label: 'View Inquiries', icon: <FileText className="h-5 w-5" />, desc: `${stats.inquiries} received` },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 p-6 text-white sm:p-8">
        <h2 className="text-2xl font-bold text-white">Welcome back, Admin</h2>
        <p className="mt-1 text-brand-100">Here's what's happening at your institute today.</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur-sm">
            <TrendingUp className="h-4 w-4" /> {attendanceRate}% attendance today
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur-sm">
            <FileText className="h-4 w-4" /> {stats.inquiries} new inquiries
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard value={stats.students} label="Total Students" icon={<Users className="h-6 w-6" />} color="brand" trend="+12 this month" />
        <StatCard value={stats.faculty} label="Faculty Members" icon={<GraduationCap className="h-6 w-6" />} color="gold" />
        <StatCard value={stats.courses} label="Active Courses" icon={<BookOpen className="h-6 w-6" />} color="emerald" />
        <StatCard value={stats.departments} label="Departments" icon={<Building2 className="h-6 w-6" />} color="rose" />
      </div>

      {/* Attendance overview + Quick actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Attendance */}
        <div className="card p-6">
          <h3 className="font-bold text-slate-900">Today's Attendance</h3>
          <div className="mt-4 flex items-center justify-center">
            <div className="relative h-36 w-36">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="42" fill="none" stroke="#1d57f5" strokeWidth="10"
                  strokeDasharray={`${(attendanceRate / 100) * 264} 264`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-900">{attendanceRate}%</span>
                <span className="text-xs text-slate-500">Present</span>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-emerald-600"><UserCheck className="h-4 w-4" /> Present</span>
              <span className="font-semibold text-slate-900">{attendanceStats.present}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-rose-600"><UserX className="h-4 w-4" /> Absent</span>
              <span className="font-semibold text-slate-900">{attendanceStats.absent}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-gold-600"><Clock className="h-4 w-4" /> Late</span>
              <span className="font-semibold text-slate-900">{attendanceStats.late}</span>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="font-bold text-slate-900">Quick Actions</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {quickLinks.map((q) => (
              <Link
                key={q.to}
                to={q.to}
                className="group flex flex-col gap-2 rounded-xl border border-slate-200 p-4 transition-all hover:border-brand-300 hover:shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  {q.icon}
                </div>
                <div className="text-sm font-semibold text-slate-900">{q.label}</div>
                <div className="text-xs text-slate-500">{q.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent students */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Recent Students</h3>
            <Link to="/erp/students" className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {loading ? (
              <p className="text-sm text-slate-400">Loading...</p>
            ) : recentStudents.length === 0 ? (
              <p className="text-sm text-slate-400">No students yet.</p>
            ) : (
              recentStudents.map((s) => (
                <div key={s.id} className="flex items-center gap-3 rounded-lg border border-slate-100 p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                    {s.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-slate-900">{s.name}</div>
                    <div className="truncate text-xs text-slate-500">{s.roll_number} · {s.department?.code || '—'}</div>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium capitalize text-emerald-700">
                    {s.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent notices + inquiries */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Recent Inquiries</h3>
            <Link to="/erp/admissions" className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {loading ? (
              <p className="text-sm text-slate-400">Loading...</p>
            ) : recentInquiries.length === 0 ? (
              <p className="text-sm text-slate-400">No inquiries yet.</p>
            ) : (
              recentInquiries.map((i) => (
                <div key={i.id} className="flex items-center gap-3 rounded-lg border border-slate-100 p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-100 text-sm font-bold text-gold-700">
                    {i.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-slate-900">{i.name}</div>
                    <div className="truncate text-xs text-slate-500">{i.course_interest || 'General inquiry'}</div>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                    i.status === 'new' ? 'bg-brand-50 text-brand-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {i.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
