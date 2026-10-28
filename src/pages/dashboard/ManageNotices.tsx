import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Megaphone, Pin, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Notice } from '@/lib/types';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';

const categoryColors: Record<string, string> = {
  admissions: 'bg-brand-50 text-brand-700',
  events: 'bg-gold-50 text-gold-700',
  examination: 'bg-rose-50 text-rose-700',
  placements: 'bg-emerald-50 text-emerald-700',
  general: 'bg-slate-100 text-slate-600',
};

export default function ManageNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Notice | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', content: '', category: 'general', is_pinned: false, date: new Date().toISOString().slice(0, 10) });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('notices')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('date', { ascending: false });
    setNotices(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const openAdd = () => {
    setEditing(null);
    setForm({ title: '', content: '', category: 'general', is_pinned: false, date: new Date().toISOString().slice(0, 10) });
    setError('');
    setModalOpen(true);
  };

  const openEdit = (n: Notice) => {
    setEditing(n);
    setForm({ title: n.title, content: n.content, category: n.category, is_pinned: n.is_pinned, date: n.date });
    setError('');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      title: form.title,
      content: form.content,
      category: form.category,
      is_pinned: form.is_pinned,
      date: form.date,
    };
    const { error: err } = editing
      ? await supabase.from('notices').update(payload).eq('id', editing.id)
      : await supabase.from('notices').insert(payload);
    if (err) {
      setError(err.message);
      setSaving(false);
      return;
    }
    setSaving(false);
    setModalOpen(false);
    await loadData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from('notices').delete().eq('id', deleteId);
    setDeleteId(null);
    await loadData();
  };

  const togglePin = async (n: Notice) => {
    await supabase.from('notices').update({ is_pinned: !n.is_pinned }).eq('id', n.id);
    await loadData();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Notice Management</h2>
          <p className="text-sm text-slate-500">{notices.length} notices published</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="h-4 w-4" /> Add Notice
        </button>
      </div>

      <div className="space-y-3">
        {loading ? (
          [1, 2, 3].map((i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-100" />)
        ) : notices.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Megaphone className="mx-auto mb-2 h-8 w-8 text-slate-300" />
            <p className="text-slate-400">No notices yet.</p>
          </div>
        ) : (
          notices.map((n) => (
            <div key={n.id} className={`card p-5 ${n.is_pinned ? 'border-l-4 border-l-gold-400' : ''}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded px-2 py-0.5 text-xs font-medium capitalize ${categoryColors[n.category] || categoryColors.general}`}>
                      {n.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(n.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    {n.is_pinned && (
                      <span className="flex items-center gap-1 rounded bg-gold-100 px-2 py-0.5 text-xs font-medium text-gold-700">
                        <Pin className="h-3 w-3" /> Pinned
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 font-bold text-slate-900">{n.title}</h3>
                  <p className="mt-1 text-sm text-slate-600 line-clamp-2">{n.content}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => togglePin(n)} className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${n.is_pinned ? 'bg-gold-50 text-gold-600' : 'text-slate-400 hover:bg-gold-50 hover:text-gold-600'}`}>
                    <Pin className="h-4 w-4" />
                  </button>
                  <button onClick={() => openEdit(n)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-brand-50 hover:text-brand-600">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeleteId(n.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal open={modalOpen} title={editing ? 'Edit Notice' : 'Add Notice'} onClose={() => setModalOpen(false)} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          {error && <div className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
          <div>
            <label className="label-field">Title *</label>
            <input required type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                <option value="general">General</option>
                <option value="admissions">Admissions</option>
                <option value="events">Events</option>
                <option value="examination">Examination</option>
                <option value="placements">Placements</option>
              </select>
            </div>
            <div>
              <label className="label-field">Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" />
            </div>
          </div>
          <div>
            <label className="label-field">Content *</label>
            <textarea required rows={5} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="input-field resize-none" />
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input type="checkbox" checked={form.is_pinned} onChange={(e) => setForm({ ...form, is_pinned: e.target.checked })} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
            Pin this notice to the top
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
              <X className="h-4 w-4" /> Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Notice"
        message="Are you sure you want to delete this notice? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
