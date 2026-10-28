import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BookOpen, Users, Award, FlaskConical, Trophy,
  Mic, Building2, Stethoscope, Coffee, Lightbulb, GraduationCap,
  ChevronRight, Calendar, MapPin, Phone,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Notice, Department, Course } from '@/lib/types';
import SectionHeading from '@/components/SectionHeading';

const facilityIcons: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="h-6 w-6" />,
  FlaskConical: <FlaskConical className="h-6 w-6" />,
  Trophy: <Trophy className="h-6 w-6" />,
  Mic: <Mic className="h-6 w-6" />,
  Building2: <Building2 className="h-6 w-6" />,
  Stethoscope: <Stethoscope className="h-6 w-6" />,
  Coffee: <Coffee className="h-6 w-6" />,
  Lightbulb: <Lightbulb className="h-6 w-6" />,
};

const heroImage = 'https://images.pexels.com/photos/19554793/pexels-photo-19554793.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export default function Home() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [facilityCount, setFacilityCount] = useState(0);
  const [facultyCount, setFacultyCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    (async () => {
      const [{ data: n }, { data: d }, { data: c }, { count: fc }, { count: fcnt }, { count: sc }] = await Promise.all([
        supabase.from('notices').select('*').order('is_pinned', { ascending: false }).order('date', { ascending: false }).limit(4),
        supabase.from('departments').select('*').order('name'),
        supabase.from('courses').select('*').limit(6),
        supabase.from('facilities').select('*', { count: 'exact', head: true }),
        supabase.from('faculty').select('*', { count: 'exact', head: true }),
        supabase.from('students').select('*', { count: 'exact', head: true }),
      ]);
      setNotices(n || []);
      setDepartments(d || []);
      setCourses(c || []);
      setFacilityCount(fc || 0);
      setFacultyCount(fcnt || 0);
      setStudentCount(sc || 0);
    })();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[90vh] items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Campus" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/30" />
        </div>
        <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-2xl animate-fade-up">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-600/20 px-4 py-1.5 text-sm font-medium text-brand-200 ring-1 ring-brand-400/30 backdrop-blur-sm">
              <Award className="h-4 w-4" />
              Ranked among top engineering institutes 2026
            </div>
            <h1 className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Shaping Tomorrow's Innovators Today
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-200">
              St. Xavier's Institute of Technology delivers world-class education in engineering,
              management, and research — empowering students to lead, innovate, and excel.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/admissions" className="btn-gold">
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/courses" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20">
                Explore Programs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-slate-200 sm:grid-cols-4">
          {[
            { value: studentCount.toLocaleString(), label: 'Students Enrolled', icon: <Users className="h-6 w-6" /> },
            { value: facultyCount.toLocaleString(), label: 'Faculty Members', icon: <GraduationCap className="h-6 w-6" /> },
            { value: departments.length.toString(), label: 'Departments', icon: <BookOpen className="h-6 w-6" /> },
            { value: facilityCount.toString(), label: 'Campus Facilities', icon: <Building2 className="h-6 w-6" /> },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-4 bg-white p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                {s.icon}
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{s.value}</div>
                <div className="text-sm text-slate-500">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Welcome / About preview */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-600">Welcome</div>
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">A Legacy of Excellence in Education</h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">
                For over three decades, St. Xavier's has been at the forefront of technical and
                management education. Our institution blends rigorous academics with hands-on
                learning, research opportunities, and a vibrant campus life.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'NAAC A+ accredited with a 3.6 CGPA',
                  'Industry-aligned curriculum with internships',
                  'Dedicated innovation and startup incubation cell',
                  '95% placement record with top recruiters',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-700">
                    <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-brand-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/about" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700">
                Learn more about us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/8199558/pexels-photo-8199558.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Students in library"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 hidden rounded-xl bg-brand-600 p-6 text-white shadow-lg sm:block">
                <div className="text-3xl font-bold">35+</div>
                <div className="text-sm text-brand-100">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs / Courses */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Academics"
            title="Our Programs"
            subtitle="Industry-relevant programs designed to build expertise, foster innovation, and prepare students for successful careers."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Link key={course.id} to="/courses" className="card group p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {course.duration}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-700">{course.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 line-clamp-2">{course.description}</p>
                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-brand-600">
                  {course.credits} Credits
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Departments"
            title="Explore Our Departments"
            subtitle="Five specialized departments, each committed to pushing the boundaries of knowledge and practice."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept) => (
              <Link key={dept.id} to="/departments" className="card group p-6">
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-brand-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    {dept.code}
                  </span>
                  {dept.established_year && (
                    <span className="text-xs text-slate-400">Est. {dept.established_year}</span>
                  )}
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-brand-700">{dept.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 line-clamp-2">{dept.description}</p>
                {dept.head && <p className="mt-3 text-sm font-medium text-slate-700">Head: {dept.head}</p>}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Notices */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Latest Updates"
            title="Notices & Announcements"
            subtitle="Stay informed about campus events, examinations, placements, and important deadlines."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {notices.map((notice) => (
              <div key={notice.id} className="card flex gap-4 p-5">
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {notice.is_pinned && (
                      <span className="rounded bg-gold-100 px-2 py-0.5 text-xs font-medium text-gold-700">Pinned</span>
                    )}
                    <span className="text-xs text-slate-400">
                      {new Date(notice.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="mt-1 font-semibold text-slate-900">{notice.title}</h3>
                  <p className="mt-1 text-sm text-slate-600 line-clamp-2">{notice.content}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/notices" className="btn-secondary">
              View All Notices <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Facilities preview */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-400">Campus Life</div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">World-Class Facilities</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
              Our campus is equipped with modern infrastructure to support learning, research, and well-rounded student life.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'Central Library', icon: 'BookOpen' },
              { name: 'Advanced Labs', icon: 'FlaskConical' },
              { name: 'Sports Complex', icon: 'Trophy' },
              { name: 'Innovation Hub', icon: 'Lightbulb' },
              { name: 'Auditorium', icon: 'Mic' },
              { name: 'Hostels', icon: 'Building2' },
              { name: 'Medical Center', icon: 'Stethoscope' },
              { name: 'Cafeteria', icon: 'Coffee' },
            ].map((f) => (
              <div key={f.name} className="rounded-xl bg-slate-800 p-5 transition-colors hover:bg-slate-700">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600/20 text-brand-400">
                  {facilityIcons[f.icon]}
                </div>
                <div className="font-semibold text-white">{f.name}</div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/facilities" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
              Explore Facilities <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-600 py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:px-8">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to begin your journey?</h2>
            <p className="mt-2 text-brand-100">Admissions for 2026-27 are now open. Secure your seat today.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/admissions" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-sm transition-all hover:shadow-md">
              Apply Now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">
              <Phone className="h-4 w-4" /> Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Contact info bar */}
      <section className="bg-white py-10">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            { icon: <MapPin className="h-5 w-5" />, label: 'Visit Us', value: '123 Education City Road, New Delhi - 110001' },
            { icon: <Phone className="h-5 w-5" />, label: 'Call Us', value: '+91 11 2345 6789' },
            { icon: <Calendar className="h-5 w-5" />, label: 'Office Hours', value: 'Mon–Sat, 9:00 AM – 5:00 PM' },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">{c.icon}</div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{c.label}</div>
                <div className="text-sm font-medium text-slate-700">{c.value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
