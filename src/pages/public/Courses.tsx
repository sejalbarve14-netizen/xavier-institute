import { useEffect, useState } from 'react';
import { BookOpen, Clock, Award, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Course, Department } from '@/lib/types';
import SectionHeading from '@/components/SectionHeading';

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: c }, { data: d }] = await Promise.all([
        supabase.from('courses').select('*, department:departments(*)').order('title'),
        supabase.from('departments').select('*').order('name'),
      ]);
      setCourses(c || []);
      setDepartments(d || []);
      setLoading(false);
    })();
  }, []);

  const filtered = filter === 'all' ? courses : courses.filter((c) => c.department_id === filter);

  return (
    <div>
      <section className="relative flex items-center justify-center bg-slate-900 py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-slate-900 to-slate-800" />
        <div className="relative text-center">
          <div className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-300">Academics</div>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Our Courses</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Comprehensive programs designed to equip you with the skills and knowledge for a successful career.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Filter */}
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === 'all' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Programs
            </button>
            {departments.map((d) => (
              <button
                key={d.id}
                onClick={() => setFilter(d.id)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filter === d.id ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {d.code}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-slate-500">No programs found for this department.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((course) => (
                <div key={course.id} className="card group flex flex-col p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    {course.department && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        {course.department.code}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-700">{course.title}</h3>
                  <p className="mt-1 text-xs font-medium text-slate-400">{course.code}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{course.description}</p>
                  <div className="mt-5 flex items-center gap-4 border-t border-slate-100 pt-4 text-sm">
                    <span className="flex items-center gap-1.5 font-medium text-slate-700">
                      <Award className="h-4 w-4 text-brand-600" /> {course.credits} Credits
                    </span>
                    <span className="flex items-center gap-1.5 font-medium text-slate-700">
                      <Clock className="h-4 w-4 text-brand-600" /> {course.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Admissions" title="Ready to Apply?" subtitle="Take the first step towards a rewarding career. Our admissions team is here to guide you." />
          <a href="/admissions" className="btn-primary">
            Start Your Application <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
