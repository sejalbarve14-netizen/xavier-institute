import { useEffect, useState } from 'react';
import { BookOpen, FlaskConical, Trophy, Mic, Building2, Stethoscope, Coffee, Lightbulb } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Facility } from '@/lib/types';
import SectionHeading from '@/components/SectionHeading';

const iconMap: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="h-7 w-7" />,
  FlaskConical: <FlaskConical className="h-7 w-7" />,
  Trophy: <Trophy className="h-7 w-7" />,
  Mic: <Mic className="h-7 w-7" />,
  Building2: <Building2 className="h-7 w-7" />,
  Stethoscope: <Stethoscope className="h-7 w-7" />,
  Coffee: <Coffee className="h-7 w-7" />,
  Lightbulb: <Lightbulb className="h-7 w-7" />,
};

export default function Facilities() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('facilities').select('*').order('name').then(({ data }) => {
      setFacilities(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <section className="relative flex items-center justify-center bg-slate-900 py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-slate-900 to-slate-800" />
        <div className="relative text-center">
          <div className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-300">Campus Life</div>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Facilities</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Modern infrastructure and amenities that create an enriching environment for learning and growth.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-48 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {facilities.map((f) => (
                <div key={f.id} className="card group p-6">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                    {iconMap[f.icon] || <BookOpen className="h-7 w-7" />}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{f.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Beyond Academics" title="A Campus That Inspires" subtitle="From cutting-edge labs to vibrant spaces for collaboration and recreation, our campus is designed for holistic development." />
        </div>
      </section>
    </div>
  );
}
