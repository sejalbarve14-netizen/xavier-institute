import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Pencil, Trash2, BookOpen, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Course, Department } from '@/lib/types';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function ManageCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', code: '', department_id: '', credits: '3', duration: '4 Years', description: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('courses')
      .select('*, department:departments(*)')
      .order('created_at', { ascending: false });
    setCourses(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    (async () => {
      await loadData();
      const { data: d } = await supabase.from('departments').select('*').order('name');
      setDepartments(d || []);
    })();
  }, [loadData]);

  const openAdd = () => {
    setEditing(null);
    setForm({ title: '', code: '', department_id: '', credits: '3', duration: '4 Years', description: '' });
    setError('');
    setModalOpen(true);
  };

  const openEdit = (c: Course) => {
    setEditing(c);
    setForm({
      title: c.title, code: c.code, department_id: c.department_id || '',
      credits: String(c.credits), duration: c.duration, description: c.description || '',
    });
    setError('');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      title: form.title,
      code: form.code,
      department_id: form.department_id || null,
      credits: parseInt(form.credits) || 3,
      duration: form.duration,
      description: form.description || null,
    };
    const { error: err } = editing
      ? await supabase.from('courses').update(payload).eq('id', editing.id)
      : await supabase.from('courses').insert(payload);
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
    await supabase.from('courses').delete().eq('id', deleteId);
    setDeleteId(null);
    await loadData();
  };

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Course Management</h2>
          <p className="text-sm text-slate-500">{courses.length} courses offered</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="h-4 w-4" /> Add Course
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search courses by title or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-40 animate-pulse rounded-xl bg-slate-100" />)
        ) : filtered.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <BookOpen className="mx-auto mb-2 h-8 w-8 text-slate-300" />
            <p className="text-slate-400">No courses found.</p>
          </div>
        ) : (
          filtered.map((c) => (
            <div key={c.id} className="card group p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(c)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-brand-50 hover:text-brand-600">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeleteId(c.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h3 className="mt-3 font-bold text-slate-900">{c.title}</h3>
              <p className="text-xs font-mono text-slate-400">{c.code}</p>
              <p className="mt-2 text-sm text-slate-600 line-clamp-2">{c.description}</p>
              <div className="mt-3 flex items-center gap-3 border-t border-slate-100 pt-3 text-xs">
                {c.department && <span className="rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-600">{c.department.code}</span>}
                <span className="text-slate-500">{c.credits} credits · {c.duration}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal open={modalOpen} title={editing ? 'Edit Course' : 'Add Course'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSave} className="space-y-4">
          {error && <div className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
          <div>
            <label className="label-field">Course Title *</label>
            <input required type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">Course Code *</label>
              <input required type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="input-field" placeholder="e.g. BT-CSE-401" />
            </div>
            <div>
              <label className="label-field">Department</label>
              <select value={form.department_id} onChange={(e) => setForm({ ...form, department_id: e.target.value })} className="input-field">
                <option value="">Select department</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">Credits</label>
              <input type="number" min="1" max="10" value={form.credits} onChange={(e) => setForm({ ...form, credits: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="label-field">Duration</label>
              <input type="text" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="input-field" placeholder="e.g. 4 Years" />
            </div>
          </div>
          <div>
            <label className="label-field">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" />
          </div>
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
        title="Delete Course"
        message="Are you sure you want to delete this course? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
