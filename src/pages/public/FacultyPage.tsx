import { useEffect, useState } from 'react';
import { Mail, Award, BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Faculty } from '@/lib/types';
import SectionHeading from '@/components/SectionHeading';

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('faculty')
      .select('*, department:departments(*)')
      .order('name')
      .then(({ data }) => {
        setFaculty(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <section className="relative flex items-center justify-center bg-slate-900 py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-slate-900 to-slate-800" />
        <div className="relative text-center">
          <div className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-300">Our People</div>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Faculty</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Learn from accomplished academicians and industry experts dedicated to your growth.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-72 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {faculty.map((f) => (
                <div key={f.id} className="card overflow-hidden">
                  <div className="flex items-center gap-4 bg-gradient-to-br from-brand-50 to-slate-50 p-6">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xl font-bold text-white shadow-md">
                      {f.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-slate-900">{f.name}</h3>
                      <p className="text-sm font-medium text-brand-600">{f.designation}</p>
                      {f.department && (
                        <p className="mt-0.5 text-xs text-slate-500">{f.department.name}</p>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    {f.qualification && (
                      <p className="flex items-start gap-2 text-sm text-slate-600">
                        <Award className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                        {f.qualification}
                      </p>
                    )}
                    {f.bio && <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.bio}</p>}
                    {f.email && (
                      <p className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-700">
                        <Mail className="h-4 w-4 text-brand-600" /> {f.email}
                      </p>
                    )}
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
