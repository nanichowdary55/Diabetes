import Header from '../components/Header';
import { predictions } from '../data/mockData';
import { Brain, TrendingUp, TrendingDown, Minus, Shield, Zap, AlertTriangle } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

const riskColors = {
  High: { text: 'text-red-400', badge: 'badge-danger', border: 'border-red-500/20', bg: 'bg-red-500/5' },
  Medium: { text: 'text-amber-400', badge: 'badge-warning', border: 'border-amber-500/20', bg: 'bg-amber-500/5' },
  Low: { text: 'text-emerald-400', badge: 'badge-success', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5' },
};
const barColors = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };

const radarData = [
  { metric: 'Glucose Control', value: 72 },
  { metric: 'Prediction Acc.', value: 88 },
  { metric: 'Alert Response', value: 65 },
  { metric: 'Medication', value: 80 },
  { metric: 'Time in Range', value: 74 },
  { metric: 'Data Quality', value: 91 },
];

const CustomBarTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card p-3 border border-white/15 text-xs">
        <p className="text-white font-bold">{payload[0]?.payload?.patient}</p>
        <p className="text-cyan-400">Current: {payload[0]?.value} mg/dL</p>
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  return (
    <div className="animate-fade-in">
      <Header title="AI Analytics" subtitle="Digital Twin predictions powered by TensorFlow" />
      <div className="p-6 space-y-6">

        {/* AI Engine banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 rounded-2xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-purple-400" />
            <div>
              <p className="text-white font-bold">Digital Twin AI Engine</p>
              <p className="text-slate-400 text-xs">Model: LSTM v3.2 · Trained on 1.2M glucose readings · Python + TensorFlow</p>
            </div>
          </div>
          <div className="flex gap-3">
            {[['87%','Avg Accuracy','text-purple-400'],['2hr','Prediction Window','text-cyan-400'],['5','Active Twins','text-emerald-400']].map(([v,l,c])=>(
              <div key={l} className="text-center px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                <p className={`font-bold text-lg ${c}`}>{v}</p>
                <p className="text-slate-500 text-xs">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Prediction cards */}
        <div>
          <h2 className="text-white font-bold mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" /> Real-Time AI Predictions
          </h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {predictions.map(p => {
              const c = riskColors[p.risk];
              return (
                <div key={p.patientId} className={`glass-card-hover p-5 border ${c.border} ${c.bg}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/30 to-primary-600/30 flex items-center justify-center font-bold text-cyan-300">
                        {p.patient[0]}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{p.patient}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={c.badge}>{p.risk} Risk</span>
                          <span className="text-slate-500 text-xs">·</span>
                          <span className="text-slate-400 text-xs">{p.confidence}% confidence</span>
                        </div>
                      </div>
                    </div>
                    <Shield className={`w-5 h-5 ${c.text}`} />
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>AI Confidence</span><span>{p.confidence}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-indigo-500" style={{ width: `${p.confidence}%` }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: 'Now', value: p.current },
                      { label: '+30m', value: p.predicted30 },
                      { label: '+1hr', value: p.predicted60 },
                      { label: '+2hr', value: p.predicted120 },
                    ].map(t => {
                      const tc = t.value > 180 ? 'text-red-400' : t.value < 70 ? 'text-amber-400' : 'text-emerald-400';
                      const diff = t.value - p.current;
                      return (
                        <div key={t.label} className="bg-white/5 rounded-xl p-2.5 text-center">
                          <p className="text-slate-500 text-[10px] mb-1">{t.label}</p>
                          <p className={`text-base font-bold ${tc}`}>{t.value}</p>
                          {t.label !== 'Now' && (
                            <div className={`flex items-center justify-center gap-0.5 mt-0.5 ${diff > 0 ? 'text-red-400' : 'text-emerald-400'} text-[10px]`}>
                              {diff > 0 ? <TrendingUp className="w-2.5 h-2.5" /> : diff < 0 ? <TrendingDown className="w-2.5 h-2.5" /> : <Minus className="w-2.5 h-2.5" />}
                              {Math.abs(diff)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="glass-card p-5">
            <h2 className="text-white font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Current Glucose by Patient
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={predictions.map(p => ({ patient: p.patient.split(' ')[0], current: p.current, risk: p.risk }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="patient" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 350]} />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="current" radius={[4, 4, 0, 0]}>
                  {predictions.map((p, i) => <Cell key={i} fill={barColors[p.risk]} fillOpacity={0.8} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="glass-card p-5">
            <h2 className="text-white font-bold mb-4 flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" /> System Performance Metrics
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 9 }} />
                <Radar dataKey="value" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* POST endpoint */}
        <div className="px-5 py-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20">
          <div className="flex items-center gap-3 mb-2">
            <span className="badge-post">POST</span>
            <code className="text-indigo-300 text-sm font-mono">/api/twin/predict</code>
          </div>
          <p className="text-slate-400 text-xs mb-3">Sends current patient data to the AI model and returns future glucose predictions.</p>
          <div className="code-block text-xs">{`{ "patient_id": "P001", "recent_readings": [285, 272, 268], "model_version": "LSTM-v3.2" }`}</div>
        </div>
      </div>
    </div>
  );
}
