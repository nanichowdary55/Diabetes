import Header from '../components/Header';
import { mongoCollections, pgTables } from '../data/mockData';
import { Database as DbIcon, Table, Layers, Key } from 'lucide-react';

const typeColors = ['text-cyan-400', 'text-purple-400', 'text-emerald-400', 'text-amber-400', 'text-rose-400'];

export default function Database() {
  return (
    <div className="animate-fade-in">
      <Header title="Database Schema" subtitle="MongoDB collections & PostgreSQL tables" />
      <div className="p-6 space-y-6">

        {/* Overview cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'MongoDB Collections', value: '4', icon: DbIcon, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
            { label: 'PostgreSQL Tables', value: '4', icon: Table, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
            { label: 'Total Records', value: '1.2M+', icon: Layers, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
            { label: 'Primary Keys', value: '8', icon: Key, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
          ].map(c => (
            <div key={c.label} className={`glass-card p-4 border ${c.bg}`}>
              <c.icon className={`w-5 h-5 ${c.color} mb-2`} />
              <p className={`text-2xl font-bold text-white`}>{c.value}</p>
              <p className="text-slate-400 text-xs mt-0.5">{c.label}</p>
            </div>
          ))}
        </div>

        {/* Two-database comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-5 py-4 rounded-2xl bg-white/3 border border-white/8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <p className="text-white font-bold">MongoDB — NoSQL</p>
            </div>
            <p className="text-slate-400 text-xs">Flexible JSON documents. Perfect for glucose readings and alerts with varying structure. Fast read/write for real-time sensor data.</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-blue-400" />
              <p className="text-white font-bold">PostgreSQL — Relational SQL</p>
            </div>
            <p className="text-slate-400 text-xs">Structured tables with strict schema. Great for user accounts, appointments, and medication logs needing complex queries.</p>
          </div>
        </div>

        {/* MongoDB Collections */}
        <div>
          <h2 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400" />
            MongoDB Collections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mongoCollections.map((col, idx) => (
              <div key={col.name} className="glass-card-hover p-5 border border-green-500/15">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <DbIcon className="w-4 h-4 text-green-400" />
                    <span className="text-white font-bold font-mono text-sm">{col.name}</span>
                  </div>
                  <span className="badge-success text-[10px]">MongoDB</span>
                </div>
                <p className="text-slate-400 text-xs mb-3">{col.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {col.fields.map((f, fi) => (
                    <span key={f} className={`px-2 py-0.5 rounded-lg bg-white/5 border border-white/8 text-xs font-mono ${fi === 0 ? 'text-amber-400' : typeColors[fi % typeColors.length]}`}>
                      {fi === 0 && <Key className="w-2.5 h-2.5 inline mr-1" />}{f}
                    </span>
                  ))}
                </div>
                <div className="mt-3 code-block text-[10px] text-slate-400">
                  {`db.${col.name}.find({ patient_id: "P001" })`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PostgreSQL Tables */}
        <div>
          <h2 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-400" />
            PostgreSQL Tables
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pgTables.map((tbl) => (
              <div key={tbl.name} className="glass-card-hover p-5 border border-blue-500/15">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Table className="w-4 h-4 text-blue-400" />
                    <span className="text-white font-bold font-mono text-sm">{tbl.name}</span>
                  </div>
                  <span className="badge-info text-[10px]">PostgreSQL</span>
                </div>
                <p className="text-slate-400 text-xs mb-3">{tbl.desc}</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-white/8">
                        <th className="text-left text-slate-500 pb-1.5 font-semibold">Column</th>
                        <th className="text-left text-slate-500 pb-1.5 font-semibold">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {tbl.fields.map((f, fi) => (
                        <tr key={f}>
                          <td className={`py-1.5 pr-4 font-mono ${fi === 0 ? 'text-amber-400' : 'text-slate-300'}`}>
                            {fi === 0 && <Key className="w-2.5 h-2.5 inline mr-1" />}{f}
                          </td>
                          <td className="py-1.5 text-slate-500">
                            {fi === 0 ? 'PRIMARY KEY' : f.includes('id') ? 'FOREIGN KEY' : f.includes('hash') ? 'bcrypt' : f.includes('at') || f.includes('time') ? 'TIMESTAMP' : 'VARCHAR'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 code-block text-[10px] text-slate-400">
                  {`SELECT * FROM ${tbl.name} WHERE patient_id = 'P001';`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ER note */}
        <div className="px-5 py-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20">
          <p className="text-indigo-300 font-semibold text-sm mb-2">📊 Data Flow</p>
          <p className="text-slate-400 text-xs">Sensor readings → stored in <span className="text-green-400 font-mono">glucose_readings</span> (MongoDB) → AI processes → saved in <span className="text-green-400 font-mono">twin_snapshots</span> (MongoDB) → alerts go to <span className="text-green-400 font-mono">alerts</span> (MongoDB) · User accounts in <span className="text-blue-400 font-mono">users</span> (PostgreSQL) · Appointments in <span className="text-blue-400 font-mono">appointments</span> (PostgreSQL)</p>
        </div>
      </div>
    </div>
  );
}
