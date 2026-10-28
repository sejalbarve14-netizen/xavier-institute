import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Pencil, Trash2, GraduationCap, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Faculty, Department } from '@/lib/types';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function ManageFaculty() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Faculty | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', department_id: '', designation: 'Assistant Professor', qualification: '', bio: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('faculty')
      .select('*, department:departments(*)')
      .order('created_at', { ascending: false });
    setFaculty(data || []);
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
    setForm({ name: '', email: '', department_id: '', designation: 'Assistant Professor', qualification: '', bio: '' });
    setError('');
    setModalOpen(true);
  };

  const openEdit = (f: Faculty) => {
    setEditing(f);
    setForm({
      name: f.name, email: f.email || '', department_id: f.department_id || '',
      designation: f.designation, qualification: f.qualification || '', bio: f.bio || '',
    });
    setError('');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      name: form.name,
      email: form.email || null,
      department_id: form.department_id || null,
      designation: form.designation,
      qualification: form.qualification || null,
      bio: form.bio || null,
    };
    const { error: err } = editing
      ? await supabase.from('faculty').update(payload).eq('id', editing.id)
      : await supabase.from('faculty').insert(payload);
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
    await supabase.from('faculty').delete().eq('id', deleteId);
    setDeleteId(null);
    await loadData();
  };

  const filtered = faculty.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) || f.designation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Faculty Management</h2>
          <p className="text-sm text-slate-500">{faculty.length} faculty members</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="h-4 w-4" /> Add Faculty
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search faculty by name or designation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Faculty</th>
                <th className="px-4 py-3 font-semibold">Designation</th>
                <th className="px-4 py-3 font-semibold">Department</th>
                <th className="px-4 py-3 font-semibold">Qualification</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  <GraduationCap className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                  No faculty found.
                </td></tr>
              ) : (
                filtered.map((f) => (
                  <tr key={f.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-100 text-xs font-bold text-gold-700">
                          {f.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{f.name}</div>
                          <div className="text-xs text-slate-500">{f.email || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{f.designation}</td>
                    <td className="px-4 py-3 text-slate-600">{f.department?.code || '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{f.qualification || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEdit(f)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-brand-50 hover:text-brand-600">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteId(f.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} title={editing ? 'Edit Faculty' : 'Add Faculty'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSave} className="space-y-4">
          {error && <div className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
          <div>
            <label className="label-field">Full Name *</label>
            <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="label-field">Designation *</label>
              <select value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} className="input-field">
                <option value="Professor & HOD">Professor & HOD</option>
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Lecturer">Lecturer</option>
                <option value="Visiting Faculty">Visiting Faculty</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label-field">Department</label>
            <select value={form.department_id} onChange={(e) => setForm({ ...form, department_id: e.target.value })} className="input-field">
              <option value="">Select department</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label-field">Qualification</label>
            <input type="text" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} className="input-field" placeholder="e.g. Ph.D. in Computer Science, IIT Delhi" />
          </div>
          <div>
            <label className="label-field">Bio</label>
            <textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="input-field resize-none" placeholder="Brief biography..." />
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
        title="Delete Faculty"
        message="Are you sure you want to remove this faculty member? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
