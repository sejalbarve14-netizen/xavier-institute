import { useEffect, useState } from 'react';
import { Calendar, Pin, Search, Tag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Notice } from '@/lib/types';

const categoryColors: Record<string, string> = {
  admissions: 'bg-brand-50 text-brand-700',
  events: 'bg-gold-50 text-gold-700',
  examination: 'bg-rose-50 text-rose-700',
  placements: 'bg-emerald-50 text-emerald-700',
  general: 'bg-slate-100 text-slate-600',
};

export default function Notices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    supabase
      .from('notices')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('date', { ascending: false })
      .then(({ data }) => {
        setNotices(data || []);
        setLoading(false);
      });
  }, []);

  const categories = ['all', ...Array.from(new Set(notices.map((n) => n.category)))];
  const filtered = notices.filter((n) => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'all' || n.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div>
      <section className="relative flex items-center justify-center bg-slate-900 py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-slate-900 to-slate-800" />
        <div className="relative text-center">
          <div className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-300">Information</div>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Notices & Announcements</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Stay updated with the latest news, events, and important information.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Search + Filter */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search notices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`rounded-lg px-3 py-2 text-xs font-medium capitalize transition-colors ${
                    category === c ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-slate-500">No notices found matching your search.</p>
          ) : (
            <div className="space-y-4">
              {filtered.map((notice) => (
                <div key={notice.id} className={`card p-5 ${notice.is_pinned ? 'border-l-4 border-l-gold-400' : ''}`}>
                  <div className="flex flex-wrap items-center gap-3">
                    {notice.is_pinned && (
                      <span className="flex items-center gap-1 rounded bg-gold-100 px-2 py-0.5 text-xs font-medium text-gold-700">
                        <Pin className="h-3 w-3" /> Pinned
                      </span>
                    )}
                    <span className={`flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium capitalize ${categoryColors[notice.category] || categoryColors.general}`}>
                      <Tag className="h-3 w-3" /> {notice.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Calendar className="h-3 w-3" />
                      {new Date(notice.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-slate-900">{notice.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{notice.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
