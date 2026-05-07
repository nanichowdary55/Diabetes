import { useState, useEffect } from 'react';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import GlucoseChart from '../components/GlucoseChart';
import { fetchPatients } from '../services/bluebuttonApi';
import { Activity, Users, AlertTriangle, Brain, Wifi, ChevronRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const statusColors = {
  Critical: 'badge-danger',
  Warning: 'badge-warning',
  Normal: 'badge-success',
};

function getPatientCards(patients) {
  return patients.map(p => ({
    ...p,
    type: p.gender === 'female' ? 'Type 1' : 'Type 2',
  }));
}

export default function Dashboard() {
  const [time, setTime] = useState(new Date());
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const result = await fetchPatients({ count: 12 });
        const cards = getPatientCards(result);
        setPatients(cards);
        setSelectedPatient(cards[0] || null);
      } catch (error) {
        console.error('Unable to load patients', error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const critical = patients.filter(p => p.status === 'Critical').length;
  const warning = patients.filter(p => p.status === 'Warning').length;
  const normal = patients.filter(p => p.status === 'Normal').length;

  return (
    <div className="animate-fade-in">
      <Header title="System Dashboard" subtitle="Real-time Diabetes Monitoring Overview" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-primary-600/10 border border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="dot-live" />
            <span className="text-cyan-300 text-sm font-semibold">Live API sync active</span>
            <span className="text-slate-400 text-xs">· Last fetched from BlueButton API</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300 text-sm font-mono">
            <Clock className="w-4 h-4 text-primary-400" />
            {time.toLocaleTimeString()}
          </div>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard label="Total Patients" value={loading ? '...' : patients.length} icon={Users} color="cyan" trend="up" trendValue="Live from FHIR" />
          <StatCard label="High Risk" value={critical} icon={AlertTriangle} color="red" trend="up" trendValue={`${normal} stable`} />
          <StatCard label="Moderate Risk" value={warning} icon={Activity} color="amber" sub="API-derived conditions" />
          <StatCard label="Patient Cohort" value={patients.length ? `${normal} stable` : '...'} unit="active" icon={Brain} color="purple" sub="FHIR patient data" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-white font-bold">Live Glucose Monitor</h2>
                <p className="text-slate-400 text-xs mt-0.5">Patient: {selectedPatient ? selectedPatient.name : 'Loading...'}</p>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-xs font-semibold">API Connection</span>
              </div>
            </div>
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {patients.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPatient(p)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedPatient?.id === p.id
                      ? 'bg-primary-500/20 border border-primary-500/40 text-primary-300'
                      : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {p.name.split(' ')[0]}
                  <span className={`ml-1.5 ${p.status === 'Critical' ? 'text-red-400' : p.status === 'Warning' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {p.lastReading}
                  </span>
                </button>
              ))}
            </div>
            <GlucoseChart patientId={selectedPatient?.id || 'P001'} />
          </div>

          <div className="glass-card p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold">FHIR Patient Summary</h2>
              <span className="badge-danger">{critical} critical</span>
            </div>
            <div className="space-y-3 flex-1 overflow-y-auto">
              {loading && <p className="text-slate-400 text-xs">Loading patient summary from FHIR...</p>}
              {!loading && patients.slice(0, 5).map(a => (
                <div key={a.id} className="border-l-2 border-slate-700 rounded-r-xl px-3 py-2.5 bg-slate-950/40">
                  <p className="text-slate-200 text-xs leading-snug">{a.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-slate-500 text-[10px]">Age {a.age ?? 'N/A'}</span>
                    <span className="text-slate-500 text-[10px]">·</span>
                    <span className="text-slate-500 text-[10px]">{a.gender}</span>
                    <span className={`text-[9px] ${a.status === 'Critical' ? 'text-red-400' : a.status === 'Warning' ? 'text-amber-400' : 'text-emerald-400'}`}>{a.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/patients" className="mt-4 flex items-center justify-center gap-2 text-primary-400 text-xs font-semibold hover:text-primary-300 transition-all">
              View Patient List <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold">Patient Overview</h2>
            <Link to="/patients" className="text-primary-400 text-xs font-semibold hover:text-primary-300 transition-all flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  {['Patient', 'ID', 'Gender', 'Age', 'Trend', 'Status'].map(h => (
                    <th key={h} className="text-left text-slate-500 text-xs font-semibold pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {patients.map(p => (
                  <tr key={p.id} className="hover:bg-white/3 transition-all">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500/30 to-primary-600/30 flex items-center justify-center text-xs font-bold text-cyan-300">
                          {p.name[0]}
                        </div>
                        <span className="text-white font-medium text-xs">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-slate-400 text-xs font-mono">{p.id}</td>
                    <td className="py-3 pr-4 text-slate-300 text-xs">{p.gender}</td>
                    <td className="py-3 pr-4 text-slate-300 text-xs">{p.age ?? 'N/A'}</td>
                    <td className="py-3 pr-4 text-slate-300 text-xs">{p.lastReading} mg/dL</td>
                    <td className="py-3">
                      <span className={statusColors[p.status]}>{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
