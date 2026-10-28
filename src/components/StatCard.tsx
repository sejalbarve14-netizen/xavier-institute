interface StatCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  trend?: string;
  color?: 'brand' | 'gold' | 'emerald' | 'rose';
}

const colorMap = {
  brand: 'bg-brand-50 text-brand-600',
  gold: 'bg-gold-50 text-gold-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  rose: 'bg-rose-50 text-rose-600',
};

export default function StatCard({ value, label, icon, trend, color = 'brand' }: StatCardProps) {
  return (
    <div className="card flex items-center gap-4 p-5">
      {icon && (
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colorMap[color]}`}>
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="truncate text-sm text-slate-500">{label}</div>
        {trend && <div className="mt-0.5 text-xs font-medium text-emerald-600">{trend}</div>}
      </div>
    </div>
  );
}
