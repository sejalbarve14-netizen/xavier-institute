import { useState } from 'react';
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, CalendarCheck,
  Megaphone, Building2, FileText, Menu, X, ArrowLeft, Bell,
} from 'lucide-react';
import Logo from '@/components/Logo';

const navItems = [
  { to: '/erp', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, end: true },
  { to: '/erp/students', label: 'Students', icon: <Users className="h-5 w-5" /> },
  { to: '/erp/faculty', label: 'Faculty', icon: <GraduationCap className="h-5 w-5" /> },
  { to: '/erp/courses', label: 'Courses', icon: <BookOpen className="h-5 w-5" /> },
  { to: '/erp/attendance', label: 'Attendance', icon: <CalendarCheck className="h-5 w-5" /> },
  { to: '/erp/notices', label: 'Notices', icon: <Megaphone className="h-5 w-5" /> },
  { to: '/erp/departments', label: 'Departments', icon: <Building2 className="h-5 w-5" /> },
  { to: '/erp/admissions', label: 'Admissions', icon: <FileText className="h-5 w-5" /> },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const currentLabel = navItems.find((n) => (n.end ? location.pathname === n.to : location.pathname.startsWith(n.to))?.label) || 'Dashboard';

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-slate-900 text-slate-300 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
          <Logo light />
          <button className="text-slate-400 lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-brand-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-800 p-4">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Website
          </Link>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex flex-1 flex-col lg:ml-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button className="text-slate-600 lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-bold text-slate-900">{currentLabel}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                AD
              </div>
              <div className="hidden text-sm sm:block">
                <div className="font-semibold text-slate-900">Admin</div>
                <div className="text-xs text-slate-500">Administrator</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
