import { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Course } from '@/lib/types';

export default function Contact() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', course_interest: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    supabase.from('courses').select('title').order('title').then(({ data }) => setCourses(data || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    const { error } = await supabase.from('admission_inquiries').insert({
      name: form.name,
      email: form.email,
      phone: form.phone,
      course_interest: form.course_interest,
      message: form.message,
    });
    if (error) {
      setStatus('error');
      setErrorMsg(error.message);
    } else {
      setStatus('success');
      setForm({ name: '', email: '', phone: '', course_interest: '', message: '' });
    }
  };

  return (
    <div>
      <section className="relative flex items-center justify-center bg-slate-900 py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-slate-900 to-slate-800" />
        <div className="relative text-center">
          <div className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-300">Get in Touch</div>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Contact Us</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            We're here to answer your questions. Reach out and we'll respond within 48 hours.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3">
            {/* Contact info */}
            <div className="space-y-6">
              {[
                { icon: <MapPin className="h-6 w-6" />, title: 'Address', lines: ['123 Education City Road', 'Knowledge Park, New Delhi', '110001, India'] },
                { icon: <Phone className="h-6 w-6" />, title: 'Phone', lines: ['+91 11 2345 6789', '+91 11 2345 6790'] },
                { icon: <Mail className="h-6 w-6" />, title: 'Email', lines: ['info@stxavier.edu', 'admissions@stxavier.edu'] },
                { icon: <Clock className="h-6 w-6" />, title: 'Office Hours', lines: ['Monday–Saturday', '9:00 AM – 5:00 PM'] },
              ].map((c) => (
                <div key={c.title} className="card p-6">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    {c.icon}
                  </div>
                  <h3 className="font-bold text-slate-900">{c.title}</h3>
                  {c.lines.map((l) => (
                    <p key={l} className="mt-1 text-sm text-slate-600">{l}</p>
                  ))}
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-slate-900">Send Us a Message</h2>
                <p className="mt-1 text-sm text-slate-500">Fields marked with * are required.</p>

                {status === 'success' && (
                  <div className="mt-5 flex items-center gap-3 rounded-lg bg-emerald-50 p-4 text-emerald-700">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <span className="text-sm font-medium">Thank you! Your inquiry has been submitted. We'll get back to you soon.</span>
                  </div>
                )}
                {status === 'error' && (
                  <div className="mt-5 flex items-center gap-3 rounded-lg bg-rose-50 p-4 text-rose-700">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span className="text-sm font-medium">{errorMsg || 'Something went wrong. Please try again.'}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label-field">Full Name *</label>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="input-field"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="label-field">Email *</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="input-field"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label-field">Phone</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="input-field"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="label-field">Course of Interest</label>
                      <select
                        value={form.course_interest}
                        onChange={(e) => setForm({ ...form, course_interest: e.target.value })}
                        className="input-field"
                      >
                        <option value="">Select a course</option>
                        {courses.map((c) => (
                          <option key={c.id} value={c.title}>{c.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="label-field">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="input-field resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="btn-primary w-full disabled:opacity-60"
                  >
                    {status === 'submitting' ? 'Sending...' : 'Send Message'}
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="bg-slate-100 py-0">
        <div className="h-80 w-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
          <div className="text-center text-slate-500">
            <MapPin className="mx-auto h-10 w-10" />
            <p className="mt-2 font-medium">123 Education City Road, New Delhi - 110001</p>
          </div>
        </div>
      </section>
    </div>
  );
}
