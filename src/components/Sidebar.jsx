import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Activity, Users, BarChart3,
  Code2, Database, BookOpen, Heart, Zap
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/glucose', icon: Activity, label: 'Blood Glucose' },
  { to: '/patients', icon: Users, label: 'Patients' },
  { to: '/analytics', icon: BarChart3, label: 'AI Analytics' },
  { to: '/api', icon: Code2, label: 'API Explorer' },
  { to: '/database', icon: Database, label: 'Database' },
  { to: '/slides', icon: BookOpen, label: 'PPT Slides' },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900/80 backdrop-blur-xl border-r border-white/8 flex flex-col z-40">
      {/* Logo */}
      <div className="p-5 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-primary-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 animate-glow">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Digital Twin</p>
            <p className="text-primary-400 text-xs font-medium">Diabetes Monitor</p>
          </div>
        </div>
      </div>

      {/* Live status */}
      <div className="mx-4 mt-4 mb-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
        <div className="dot-live" />
        <span className="text-emerald-400 text-xs font-semibold">System Live — 5 Patients</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest px-3 py-2">Navigation</p>
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => isActive ? 'nav-item-active' : 'nav-item'}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/8">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary-500/10 border border-primary-500/20">
          <Zap className="w-4 h-4 text-primary-400" />
          <div>
            <p className="text-white text-xs font-semibold">AI Engine</p>
            <p className="text-slate-400 text-[10px]">TensorFlow v2.15 Active</p>
          </div>
        </div>
        <p className="text-center text-slate-600 text-[10px] mt-3">diabetiesanalysis.netlify.app</p>
      </div>
    </aside>
  );
}
