import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { fetchPatients } from '../services/bluebuttonApi';
import { Search, Eye, X } from 'lucide-react';

const statusColors = { Critical: 'badge-danger', Warning: 'badge-warning', Normal: 'badge-success' };

export default function Patients() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [viewP, setViewP] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const result = await fetchPatients({ count: 50 });
        setList(result);
      } catch (error) {
        console.error('Unable to load patients', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = list.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <Header title="Patient Management" subtitle="Manage and monitor all diabetic patients from FHIR API" />
      <div className="p-6 space-y-5">

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or ID..."
              className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500/50 w-64 transition-all"
            />
          </div>
          <div className="text-slate-400 text-xs">
            Data loaded from BlueButton FHIR API
          </div>
        </div>

        {/* API hint */}
        <div className="px-4 py-2.5 rounded-xl bg-white/3 border border-white/8 flex items-center gap-3">
          <span className="badge-get">GET</span>
          <code className="text-cyan-300 text-xs font-mono">/fhir/Patient</code>
          <span className="text-slate-500 text-xs">— Showing {filtered.length} of {list.length} records from API</span>
        </div>

        {/* Patient cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-400">Loading patients from FHIR API...</p>
            </div>
          ) : (
            filtered.map(p => (
              <div key={p.id} className="glass-card-hover p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/30 to-primary-600/30 flex items-center justify-center text-lg font-bold text-cyan-300">
                      {p.name[0]}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{p.name}</p>
                      <p className="text-slate-400 text-xs font-mono">{p.id} · Age {p.age ?? 'N/A'}</p>
                    </div>
                  </div>
                  <span className={statusColors[p.status]}>{p.status}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    { label: 'Type', value: p.type || 'Type 2' },
                    { label: 'Gender', value: p.gender },
                    { label: 'Last Reading', value: `${p.lastReading ?? 'N/A'} mg/dL` },
                    { label: 'Target', value: p.target || '80-140' },
                  ].map(i => (
                    <div key={i.label} className="bg-white/3 rounded-lg p-2">
                      <p className="text-slate-500 text-[10px]">{i.label}</p>
                      <p className={`text-xs font-semibold mt-0.5 ${i.label === 'Last Reading' && p.lastReading ? (p.lastReading > 180 ? 'text-red-400' : p.lastReading < 70 ? 'text-amber-400' : 'text-emerald-400') : 'text-slate-200'}`}>
                        {i.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setViewP(p)} className="w-full btn-ghost text-xs flex items-center justify-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* View Patient Modal */}
        {viewP && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-card w-full max-w-sm p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white font-bold">Patient Profile</h2>
                <button onClick={() => setViewP(null)} className="text-slate-400 hover:text-white transition-all"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/40 to-primary-600/40 flex items-center justify-center text-2xl font-bold text-cyan-300">{viewP.name[0]}</div>
                <div>
                  <p className="text-white font-bold">{viewP.name}</p>
                  <p className="text-slate-400 text-sm">{viewP.type || 'Type 2'} Diabetes</p>
                  <span className={`mt-1 inline-block ${statusColors[viewP.status]}`}>{viewP.status}</span>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  ['Patient ID', viewP.id],
                  ['Age', viewP.age ?? 'N/A'],
                  ['Gender', viewP.gender],
                  ['Type', viewP.type || 'Type 2'],
                  ['Target Range', (viewP.target || '80-140') + ' mg/dL'],
                  ['Last Reading', (viewP.lastReading ?? 'N/A') + ' mg/dL'],
                  ['Status', viewP.status],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-slate-400 text-xs">{k}</span>
                    <span className="text-white text-xs font-medium">{v}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setViewP(null)} className="mt-4 w-full btn-primary text-sm">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
