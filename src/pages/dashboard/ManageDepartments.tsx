import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Building2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Department } from '@/lib/types';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function ManageDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [counts, setCounts] = useState<Record<string, { courses: number; faculty: number; students: number }>>({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', code: '', head: '', description: '', established_year: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('departments').select('*').order('name');
    setDepartments(data || []);
    const c: Record<string, { courses: number; faculty: number; students: number }> = {};
    for (const d of data || []) {
      const [{ count: cc }, { count: fc }, { count: sc }] = await Promise.all([
        supabase.from('courses').select('*', { count: 'exact', head: true }).eq('department_id', d.id),
        supabase.from('faculty').select('*', { count: 'exact', head: true }).eq('department_id', d.id),
        supabase.from('students').select('*', { count: 'exact', head: true }).eq('department_id', d.id),
      ]);
      c[d.id] = { courses: cc || 0, faculty: fc || 0, students: sc || 0 };
    }
    setCounts(c);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', code: '', head: '', description: '', established_year: '' });
    setError('');
    setModalOpen(true);
  };

  const openEdit = (d: Department) => {
    setEditing(d);
    setForm({ name: d.name, code: d.code, head: d.head || '', description: d.description || '', established_year: d.established_year ? String(d.established_year) : '' });
    setError('');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      name: form.name,
      code: form.code.toUpperCase(),
      head: form.head || null,
      description: form.description || null,
      established_year: form.established_year ? parseInt(form.established_year) : null,
    };
    const { error: err } = editing
      ? await supabase.from('departments').update(payload).eq('id', editing.id)
      : await supabase.from('departments').insert(payload);
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
    await supabase.from('departments').delete().eq('id', deleteId);
    setDeleteId(null);
    await loadData();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Department Management</h2>
          <p className="text-sm text-slate-500">{departments.length} departments</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="h-4 w-4" /> Add Department
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-44 animate-pulse rounded-xl bg-slate-100" />)
        ) : departments.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Building2 className="mx-auto mb-2 h-8 w-8 text-slate-300" />
            <p className="text-slate-400">No departments yet.</p>
          </div>
        ) : (
          departments.map((d) => (
            <div key={d.id} className="card group p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold uppercase text-white">
                    {d.code}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{d.name}</h3>
                    {d.established_year && <p className="text-xs text-slate-400">Est. {d.established_year}</p>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(d)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-brand-50 hover:text-brand-600">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeleteId(d.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600 line-clamp-2">{d.description}</p>
              {d.head && <p className="mt-2 text-xs font-medium text-slate-500">Head: {d.head}</p>}
              <div className="mt-3 flex gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
                <span>{counts[d.id]?.courses || 0} courses</span>
                <span>{counts[d.id]?.faculty || 0} faculty</span>
                <span>{counts[d.id]?.students || 0} students</span>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal open={modalOpen} title={editing ? 'Edit Department' : 'Add Department'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSave} className="space-y-4">
          {error && <div className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">Department Name *</label>
              <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="label-field">Code *</label>
              <input required type="text" maxLength={8} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="input-field uppercase" placeholder="e.g. CSE" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">Head of Department</label>
              <input type="text" value={form.head} onChange={(e) => setForm({ ...form, head: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="label-field">Established Year</label>
              <input type="number" min="1900" max="2026" value={form.established_year} onChange={(e) => setForm({ ...form, established_year: e.target.value })} className="input-field" />
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
        title="Delete Department"
        message="Are you sure? This will not delete associated courses/faculty but will unlink them from this department."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
