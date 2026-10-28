import { useEffect, useState, useCallback } from 'react';
import { Search, Trash2, FileText, Mail, Phone, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { AdmissionInquiry } from '@/lib/types';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';

const statusColors: Record<string, string> = {
  new: 'bg-brand-50 text-brand-700',
  contacted: 'bg-gold-50 text-gold-700',
  resolved: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-rose-50 text-rose-700',
};

export default function ManageAdmissions() {
  const [inquiries, setInquiries] = useState<AdmissionInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewing, setViewing] = useState<AdmissionInquiry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('admission_inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    setInquiries(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('admission_inquiries').update({ status }).eq('id', id);
    await loadData();
    if (viewing?.id === id) setViewing({ ...viewing, status });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from('admission_inquiries').delete().eq('id', deleteId);
    setDeleteId(null);
    await loadData();
  };

  const filtered = inquiries.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const newCount = inquiries.filter((i) => i.status === 'new').length;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Admission Inquiries</h2>
        <p className="text-sm text-slate-500">{inquiries.length} total inquiries · {newCount} new</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field sm:w-40">
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Applicant</th>
                <th className="px-4 py-3 font-semibold">Course Interest</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  <FileText className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                  No inquiries found.
                </td></tr>
              ) : (
                filtered.map((i) => (
                  <tr key={i.id} className="cursor-pointer transition-colors hover:bg-slate-50" onClick={() => setViewing(i)}>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{i.name}</div>
                      <div className="text-xs text-slate-500">{i.email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{i.course_interest || '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {new Date(i.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColors[i.status] || statusColors.new}`}>
                        {i.status}
                      </span>
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end">
                        <button onClick={() => setDeleteId(i.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600">
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

      {/* Detail Modal */}
      <Modal open={!!viewing} title="Inquiry Details" onClose={() => setViewing(null)}>
        {viewing && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                {viewing.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{viewing.name}</h3>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColors[viewing.status] || statusColors.new}`}>
                  {viewing.status}
                </span>
              </div>
            </div>
            <div className="space-y-2 rounded-lg bg-slate-50 p-4">
              {viewing.email && (
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Mail className="h-4 w-4 text-slate-400" /> {viewing.email}
                </div>
              )}
              {viewing.phone && (
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Phone className="h-4 w-4 text-slate-400" /> {viewing.phone}
                </div>
              )}
              {viewing.course_interest && (
                <div className="text-sm text-slate-700"><span className="font-medium">Interested in:</span> {viewing.course_interest}</div>
              )}
            </div>
            {viewing.message && (
              <div>
                <div className="mb-1 text-sm font-medium text-slate-700">Message</div>
                <p className="rounded-lg border border-slate-200 p-4 text-sm text-slate-600">{viewing.message}</p>
              </div>
            )}
            <div>
              <div className="mb-2 text-sm font-medium text-slate-700">Update Status</div>
              <div className="flex flex-wrap gap-2">
                {['new', 'contacted', 'resolved', 'rejected'].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(viewing.id, s)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                      viewing.status === s
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={() => setViewing(null)} className="btn-secondary">
                <X className="h-4 w-4" /> Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Inquiry"
        message="Are you sure you want to delete this inquiry? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
