import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, BookOpen, Award } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Department } from '@/lib/types';
import SectionHeading from '@/components/SectionHeading';

export default function Departments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courseCounts, setCourseCounts] = useState<Record<string, number>>({});
  const [facultyCounts, setFacultyCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: d } = await supabase.from('departments').select('*').order('name');
      setDepartments(d || []);

      const cc: Record<string, number> = {};
      const fc: Record<string, number> = {};
      for (const dept of d || []) {
        const [{ count: cCount }, { count: fCount }] = await Promise.all([
          supabase.from('courses').select('*', { count: 'exact', head: true }).eq('department_id', dept.id),
          supabase.from('faculty').select('*', { count: 'exact', head: true }).eq('department_id', dept.id),
        ]);
        cc[dept.id] = cCount || 0;
        fc[dept.id] = fCount || 0;
      }
      setCourseCounts(cc);
      setFacultyCounts(fc);
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <section className="relative flex items-center justify-center bg-slate-900 py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-slate-900 to-slate-800" />
        <div className="relative text-center">
          <div className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-300">Academics</div>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Departments</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Five specialized departments, each dedicated to advancing knowledge and practice in their field.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {departments.map((dept) => (
                <div key={dept.id} className="card group p-7">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="rounded-lg bg-brand-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                        {dept.code}
                      </span>
                      <h2 className="mt-3 text-xl font-bold text-slate-900 group-hover:text-brand-700">{dept.name}</h2>
                    </div>
                    {dept.established_year && (
                      <div className="text-right">
                        <div className="text-xs text-slate-400">Established</div>
                        <div className="font-bold text-slate-700">{dept.established_year}</div>
                      </div>
                    )}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">{dept.description}</p>
                  {dept.head && (
                    <p className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Award className="h-4 w-4 text-brand-600" /> Head of Department: {dept.head}
                    </p>
                  )}
                  <div className="mt-5 flex items-center gap-6 border-t border-slate-100 pt-4">
                    <span className="flex items-center gap-2 text-sm text-slate-600">
                      <BookOpen className="h-4 w-4 text-brand-600" /> {courseCounts[dept.id] || 0} Courses
                    </span>
                    <span className="flex items-center gap-2 text-sm text-slate-600">
                      <Users className="h-4 w-4 text-brand-600" /> {facultyCounts[dept.id] || 0} Faculty
                    </span>
                    <Link to="/courses" className="ml-auto flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700">
                      View Courses <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
