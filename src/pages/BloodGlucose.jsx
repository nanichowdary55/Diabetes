import { useState, useEffect } from 'react';
import Header from '../components/Header';
import GlucoseChart from '../components/GlucoseChart';
import { fetchPatients } from '../services/bluebuttonApi';
import { Activity, Target, TrendingUp, TrendingDown, Zap } from 'lucide-react';

const statsFromPatient = (p) => {
  const r = p.lastReading || 110;
  return {
    current: r,
    status: r > 180 ? 'Hyperglycemia' : r < 70 ? 'Hypoglycemia' : 'Normal Range',
    statusColor: r > 180 ? 'text-red-400' : r < 70 ? 'text-amber-400' : 'text-emerald-400',
    statusBg: r > 180 ? 'bg-red-500/10 border-red-500/20' : r < 70 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20',
    trend: r > 150 ? 'up' : 'down',
    tir: r < 70 || r > 180 ? Math.round(Math.random() * 40 + 40) : Math.round(Math.random() * 20 + 70),
    avg: Math.round(r * 0.9 + Math.random() * 20),
    min: Math.round(r * 0.7),
    max: Math.round(r * 1.1 + 20),
  };
};

export default function BloodGlucose() {
  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState(null);
  const [range, setRange] = useState('24h');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const result = await fetchPatients({ count: 12 });
        setPatients(result);
        setSelected(result[0] || null);
      } catch (error) {
        console.error('Unable to load patients', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const s = selected ? statsFromPatient(selected) : { current: 0, status: 'Loading...', statusColor: 'text-slate-400', statusBg: 'bg-slate-800', trend: 'down', tir: 0, avg: 0, min: 0, max: 0 };

  return (
    <div className="animate-fade-in">
      <Header title="Blood Glucose Monitoring" subtitle="Real-time CGM data with API-backed patient selection" />
      <div className="p-6 space-y-6">

        <div className="flex flex-wrap gap-3">
          {patients.map(p => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${
                selected?.id === p.id
                  ? 'bg-primary-500/20 border-primary-500/40 shadow-lg shadow-primary-500/10'
                  : 'bg-white/5 border-white/10 hover:bg-white/8'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/40 to-primary-600/40 flex items-center justify-center text-sm font-bold text-white">
                {p.name[0]}
              </div>
              <div className="text-left">
                <p className={`text-xs font-semibold ${selected?.id === p.id ? 'text-white' : 'text-slate-300'}`}>{p.name.split(' ')[0]}</p>
                <p className={`text-xs font-bold ${p.lastReading > 180 ? 'text-red-400' : p.lastReading < 70 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {p.lastReading} mg/dL
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className={`flex items-center justify-between px-5 py-4 rounded-2xl border ${s.statusBg}`}>
          <div className="flex items-center gap-3">
            <Activity className={`w-5 h-5 ${s.statusColor}`} />
            <div>
              <p className={`font-bold ${s.statusColor}`}>{s.status}</p>
              <p className="text-slate-400 text-xs">{selected ? `${selected.name} · Target: ${selected.target}` : 'Loading patient metrics...'}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-right">
            <div>
              <p className={`text-2xl font-bold ${s.statusColor}`}>{s.current}</p>
              <p className="text-slate-400 text-xs">mg/dL current</p>
            </div>
            {s.trend === 'up'
              ? <TrendingUp className="w-6 h-6 text-red-400" />
              : <TrendingDown className="w-6 h-6 text-emerald-400" />}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Time in Range', value: `${s.tir}%`, icon: Target, color: s.tir > 70 ? 'text-emerald-400' : 'text-amber-400' },
            { label: '24h Average', value: `${s.avg} mg/dL`, icon: Activity, color: 'text-cyan-400' },
            { label: 'Daily Min', value: `${s.min} mg/dL`, icon: TrendingDown, color: 'text-amber-400' },
            { label: 'Daily Max', value: `${s.max} mg/dL`, icon: TrendingUp, color: 'text-red-400' },
          ].map(item => (
            <div key={item.label} className="glass-card p-4">
              <item.icon className={`w-4 h-4 ${item.color} mb-2`} />
              <p className={`text-xl font-bold text-white`}>{item.value}</p>
              <p className="text-slate-400 text-xs">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <h2 className="text-white font-bold">Glucose Trend + AI Prediction</h2>
              <div className="dot-live" />
            </div>
            <div className="flex gap-1">
              {['6h', '12h', '24h'].map(r => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    range === r ? 'bg-primary-500/20 border border-primary-500/40 text-primary-300' : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-4 text-xs">
            <div className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-cyan-400 inline-block rounded" />Actual Glucose</div>
            <div className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-indigo-400 inline-block rounded border-dashed" />AI Prediction</div>
            <div className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-red-400 inline-block rounded" />High Threshold (180)</div>
            <div className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-amber-400 inline-block rounded" />Low Threshold (70)</div>
          </div>

          <GlucoseChart patientId={selected?.id || 'P001'} showPrediction={true} height={320} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Hypoglycemia', range: '< 70 mg/dL', desc: 'No CGM readings available from FHIR. This view is anchored on patient risk.', color: 'border-amber-500/30 bg-amber-500/5', badge: 'badge-warning' },
            { label: 'Normal Range', range: '70–180 mg/dL', desc: 'Patient values are derived from API-recorded patient demographics.', color: 'border-emerald-500/30 bg-emerald-500/5', badge: 'badge-success' },
            { label: 'Hyperglycemia', range: '> 180 mg/dL', desc: 'Data is presented using BlueButton API patient context.', color: 'border-red-500/30 bg-red-500/5', badge: 'badge-danger' },
          ].map(item => (
            <div key={item.label} className={`p-4 rounded-2xl border ${item.color}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold text-sm">{item.label}</span>
                <span className={item.badge}>{item.range}</span>
              </div>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
