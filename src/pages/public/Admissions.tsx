import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheck, Calendar, DollarSign, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Course } from '@/lib/types';
import SectionHeading from '@/components/SectionHeading';

const steps = [
  { icon: <FileText className="h-6 w-6" />, title: 'Submit Application', desc: 'Fill out the online inquiry form or download the application form from our portal.' },
  { icon: <ClipboardCheck className="h-6 w-6" />, title: 'Eligibility Check', desc: 'Our admissions team reviews your application and academic records for eligibility.' },
  { icon: <Calendar className="h-6 w-6" />, title: 'Entrance Test / Interview', desc: 'Qualified candidates are invited for an entrance examination or personal interview.' },
  { icon: <CheckCircle2 className="h-6 w-6" />, title: 'Confirmation & Enrollment', desc: 'Selected candidates receive an offer letter and complete the enrollment formalities.' },
];

const eligibility = [
  'Completion of 10+2 (or equivalent) with Physics, Chemistry, and Mathematics',
  'Minimum 60% aggregate in qualifying examination (55% for reserved categories)',
  'Valid score in JEE Main / state entrance examination (for B.Tech programs)',
  'Graduation in relevant discipline with 55% for postgraduate programs',
];

export default function Admissions() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    supabase.from('courses').select('title').order('title').then(({ data }) => setCourses(data || []));
  }, []);

  return (
    <div>
      <section className="relative flex items-center justify-center bg-slate-900 py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-slate-900 to-slate-800" />
        <div className="relative text-center">
          <div className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-300">Join Us</div>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Admissions 2026-27</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Your path to excellence starts here. Apply now and become part of our vibrant academic community.
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="How to Apply" title="Admission Process" subtitle="A simple, transparent, four-step process to join our institution." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} className="relative card p-6">
                <div className="absolute -top-3 left-6 flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                  {i + 1}
                </div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  {s.icon}
                </div>
                <h3 className="font-bold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility + Fee */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-slate-900">Eligibility Criteria</h2>
              <ul className="mt-5 space-y-3">
                {eligibility.map((e) => (
                  <li key={e} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-slate-900">Fee Structure</h2>
              <div className="mt-5 space-y-4">
                {[
                  { program: 'B.Tech (per year)', fee: '₹1,20,000' },
                  { program: 'M.Tech (per year)', fee: '₹80,000' },
                  { program: 'BBA (per year)', fee: '₹75,000' },
                  { program: 'Hostel + Mess (per year)', fee: '₹65,000' },
                ].map((f) => (
                  <div key={f.program} className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="flex items-center gap-2 text-slate-700">
                      <DollarSign className="h-4 w-4 text-brand-600" /> {f.program}
                    </span>
                    <span className="font-bold text-slate-900">{f.fee}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-slate-500">Scholarships available for merit and economically disadvantaged students.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick inquiry CTA */}
      <section className="bg-brand-600 py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 lg:flex-row lg:text-left lg:px-8">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Have questions about admissions?</h2>
            <p className="mt-2 text-brand-100">Send us an inquiry and our team will get back to you within 48 hours.</p>
          </div>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-sm transition-all hover:shadow-md">
            Contact Admissions <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Programs list */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Programs" title="Available Programs" />
          <div className="flex flex-wrap justify-center gap-3">
            {courses.map((c) => (
              <span key={c.id} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                {c.title}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
