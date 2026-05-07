import { Search, ChevronDown, User } from 'lucide-react';

export default function Header({ title, subtitle }) {
  return (
    <header className="h-16 border-b border-white/8 bg-slate-900/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h1 className="text-white font-bold text-lg leading-tight">{title}</h1>
        {subtitle && <p className="text-slate-400 text-xs">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search patients..."
            className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500/50 w-48 transition-all"
          />
        </div>

        <button className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 hover:bg-white/10 transition-all">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-primary-600 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-white text-xs font-medium hidden sm:block">FHIR API User</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>
      </div>
    </header>
  );
}
