import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({ label, value, unit, trend, trendValue, icon: Icon, color = 'cyan', sub }) {
  const colorMap = {
    cyan: { bg: 'from-cyan-500/20 to-cyan-600/10', border: 'border-cyan-500/20', icon: 'text-cyan-400', iconBg: 'bg-cyan-500/20' },
    red: { bg: 'from-red-500/20 to-red-600/10', border: 'border-red-500/20', icon: 'text-red-400', iconBg: 'bg-red-500/20' },
    amber: { bg: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/20', icon: 'text-amber-400', iconBg: 'bg-amber-500/20' },
    emerald: { bg: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/20', icon: 'text-emerald-400', iconBg: 'bg-emerald-500/20' },
    purple: { bg: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/20', icon: 'text-purple-400', iconBg: 'bg-purple-500/20' },
  };
  const c = colorMap[color] || colorMap.cyan;

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-red-400' : trend === 'down' ? 'text-emerald-400' : 'text-slate-400';

  return (
    <div className={`glass-card-hover p-5 bg-gradient-to-br ${c.bg} border ${c.border} animate-fade-in`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
        {trendValue && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon className="w-3 h-3" />
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-white">{value}</span>
          {unit && <span className="text-slate-400 text-sm">{unit}</span>}
        </div>
        <p className="text-slate-400 text-xs mt-0.5">{label}</p>
        {sub && <p className="text-slate-500 text-[10px] mt-1">{sub}</p>}
      </div>
    </div>
  );
}
