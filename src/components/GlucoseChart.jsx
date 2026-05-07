import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Legend,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const val = payload[0]?.value;
    const status = val > 180 ? 'Hyperglycemia' : val < 70 ? 'Hypoglycemia' : 'Normal';
    const statusColor = val > 180 ? '#ef4444' : val < 70 ? '#f59e0b' : '#10b981';
    return (
      <div className="glass-card p-3 border border-white/15 shadow-xl">
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        <p className="text-white font-bold text-sm">{val} <span className="text-slate-400 font-normal">mg/dL</span></p>
        {payload[1] && <p className="text-cyan-400 text-xs mt-0.5">Predicted: {payload[1].value} mg/dL</p>}
        <div className="flex items-center gap-1 mt-1">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor }} />
          <span className="text-xs" style={{ color: statusColor }}>{status}</span>
        </div>
      </div>
    );
  }
  return null;
};

function seededValue(seed, index, amplitude = 28) {
  return Math.round(120 + Math.sin((seed + index) / 4) * amplitude + Math.cos((seed + index) / 7) * 12);
}

function buildGlucoseData(patientId, points = 24) {
  const seed = patientId.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return Array.from({ length: points }, (_, i) => {
    const value = Math.max(60, Math.min(320, seededValue(seed, i, 28)));
    const predicted = Math.max(60, Math.min(320, value + Math.sin((seed + i) / 3) * 16));
    const time = new Date(Date.now() - (points - i - 1) * 30 * 60 * 1000);
    const label = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`;
    return { time: label, glucose: value, predicted: Math.round(predicted) };
  });
}

export default function GlucoseChart({ patientId = 'P001', showPrediction = true, height = 280 }) {
  const [data, setData] = useState(() => buildGlucoseData(patientId));

  useEffect(() => {
    setData(buildGlucoseData(patientId));
    const interval = setInterval(() => {
      setData(buildGlucoseData(patientId));
    }, 5000);
    return () => clearInterval(interval);
  }, [patientId]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="glucoseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} interval={3} />
        <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} domain={[50, 350]} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={180} stroke="#ef444460" strokeDasharray="4 4" label={{ value: 'High', fill: '#ef4444', fontSize: 9, position: 'insideTopRight' }} />
        <ReferenceLine y={70} stroke="#f59e0b60" strokeDasharray="4 4" label={{ value: 'Low', fill: '#f59e0b', fontSize: 9, position: 'insideBottomRight' }} />
        <Area type="monotone" dataKey="glucose" stroke="#06b6d4" strokeWidth={2.5} fill="url(#glucoseGrad)" dot={false} activeDot={{ r: 5, fill: '#06b6d4', strokeWidth: 2, stroke: '#fff' }} name="Glucose" />
        {showPrediction && (
          <Area type="monotone" dataKey="predicted" stroke="#818cf8" strokeWidth={1.5} fill="url(#predGrad)" dot={false} strokeDasharray="5 3" name="AI Prediction" />
        )}
        {showPrediction && <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8', paddingTop: '8px' }} />}
      </AreaChart>
    </ResponsiveContainer>
  );
}
