import { useEffect, useState, useCallback } from 'react';
import { CalendarCheck, Save, UserCheck, UserX, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Student, Course, Attendance } from '@/lib/types';

type Status = 'present' | 'absent' | 'late';

export default function ManageAttendance() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [marks, setMarks] = useState<Record<string, Status>>({});
  const [existing, setExisting] = useState<Record<string, Attendance>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    (async () => {
      const { data: c } = await supabase.from('courses').select('*').order('title');
      setCourses(c || []);
      const { data: s } = await supabase
        .from('students')
        .select('*, department:departments(*)')
        .eq('status', 'active')
        .order('name');
      setStudents(s || []);
      setLoading(false);
    })();
  }, []);

  const loadExisting = useCallback(async () => {
    if (!selectedCourse) {
      setExisting({});
      setMarks({});
      return;
    }
    const { data } = await supabase
      .from('attendance')
      .select('*, student:students(*)')
      .eq('course_id', selectedCourse)
      .eq('date', selectedDate);
    const map: Record<string, Attendance> = {};
    const markMap: Record<string, Status> = {};
    (data || []).forEach((a) => {
      if (a.student_id) {
        map[a.student_id] = a;
        markMap[a.student_id] = a.status as Status;
      }
    });
    setExisting(map);
    setMarks(markMap);
  }, [selectedCourse, selectedDate]);

  useEffect(() => {
    loadExisting();
  }, [loadExisting]);

  const setMark = (studentId: string, status: Status) => {
    setMarks((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    if (!selectedCourse) return;
    setSaving(true);
    setSavedMsg('');

    const upserts = students.map((s) => ({
      student_id: s.id,
      course_id: selectedCourse,
      date: selectedDate,
      status: marks[s.id] || 'present',
    }));

    const { error } = await supabase
      .from('attendance')
      .upsert(upserts, { onConflict: 'student_id,course_id,date' });

    if (error) {
      setSavedMsg(`Error: ${error.message}`);
    } else {
      setSavedMsg('Attendance saved successfully.');
      await loadExisting();
    }
    setSaving(false);
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const shiftDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().slice(0, 10));
  };

  const filteredStudents = selectedCourse
    ? students
    : students;

  const presentCount = Object.values(marks).filter((s) => s === 'present').length;
  const absentCount = Object.values(marks).filter((s) => s === 'absent').length;
  const lateCount = Object.values(marks).filter((s) => s === 'late').length;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Attendance Management</h2>
        <p className="text-sm text-slate-500">Mark and track student attendance by course and date.</p>
      </div>

      {/* Controls */}
      <div className="card p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-field">Course</label>
            <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="input-field">
              <option value="">Select a course</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.title} ({c.code})</option>)}
            </select>
          </div>
          <div>
            <label className="label-field">Date</label>
            <div className="flex items-center gap-2">
              <button onClick={() => shiftDate(-1)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition-colors hover:bg-slate-50">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="input-field" />
              <button onClick={() => shiftDate(1)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition-colors hover:bg-slate-50">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Summary */}
        {selectedCourse && !loading && (
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
              <UserCheck className="h-4 w-4" /> Present: {presentCount}
            </span>
            <span className="flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-700">
              <UserX className="h-4 w-4" /> Absent: {absentCount}
            </span>
            <span className="flex items-center gap-1.5 rounded-lg bg-gold-50 px-3 py-1.5 text-sm font-medium text-gold-700">
              <Clock className="h-4 w-4" /> Late: {lateCount}
            </span>
          </div>
        )}
      </div>

      {/* Attendance list */}
      {!selectedCourse ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <CalendarCheck className="mx-auto mb-3 h-10 w-10 text-slate-300" />
          <p className="text-slate-500">Select a course to mark attendance.</p>
        </div>
      ) : loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-slate-100" />)}
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-slate-500">No active students found.</p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="divide-y divide-slate-100">
              {filteredStudents.map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-4 p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                      {s.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-slate-900">{s.name}</div>
                      <div className="truncate text-xs text-slate-500">{s.roll_number} · {s.department?.code}</div>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    {(['present', 'late', 'absent'] as Status[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => setMark(s.id, st)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                          marks[s.id] === st
                            ? st === 'present' ? 'bg-emerald-600 text-white shadow-sm'
                              : st === 'absent' ? 'bg-rose-600 text-white shadow-sm'
                              : 'bg-gold-500 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            {savedMsg && (
              <span className={`text-sm font-medium ${savedMsg.startsWith('Error') ? 'text-rose-600' : 'text-emerald-600'}`}>
                {savedMsg}
              </span>
            )}
            <button onClick={handleSave} disabled={saving} className="btn-primary ml-auto disabled:opacity-60">
              <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Attendance'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
