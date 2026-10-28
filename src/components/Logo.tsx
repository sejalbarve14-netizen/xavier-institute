import { GraduationCap } from 'lucide-react';

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm">
        <GraduationCap className="h-6 w-6" />
      </div>
      <div className="leading-tight">
        <div className={`font-serif text-lg font-bold ${light ? 'text-white' : 'text-slate-900'}`}>
          St. Xavier's
        </div>
        <div className={`text-[11px] font-medium uppercase tracking-wider ${light ? 'text-brand-200' : 'text-slate-500'}`}>
          Institute of Technology
        </div>
      </div>
    </div>
  );
}
