import { useState } from 'react';
import Header from '../components/Header';
import { ChevronLeft, ChevronRight, Circle } from 'lucide-react';

const slides = [
  {
    num: '01', title: 'Digital Twin for Diabetes',
    subtitle: 'Understanding the project before diving into development',
    content: [
      { icon: '👤', head: 'Real Patient', body: 'Wears sensors measuring blood glucose, insulin, and vitals continuously.' },
      { icon: '🖥️', head: 'Digital Copy (Twin)', body: 'A virtual model mirroring the patient\'s health data in real-time.' },
      { icon: '📊', head: 'Monitoring Dashboard', body: 'Doctors see live charts, alerts, glucose trends, and predictions.' },
      { icon: '🔔', head: 'Alerts & Predictions', body: 'AI predicts future glucose levels and sends alerts before danger.' },
    ],
    color: 'from-cyan-500/20 to-blue-500/10',
  },
  {
    num: '02', title: 'Tech Stack — Overview',
    subtitle: 'All the technologies used to build this system',
    content: [
      { icon: '⚛️', head: 'React.js — Frontend', body: 'Displays dashboards, charts, glucose graphs, patient info in the browser.' },
      { icon: '🟢', head: 'Node.js + Express — Server', body: 'Receives requests, processes data, sends back responses.' },
      { icon: '🐍', head: 'Python + TensorFlow — AI', body: 'Predicts future blood glucose levels using machine learning.' },
      { icon: '🗄️', head: 'MongoDB + PostgreSQL — DB', body: 'Saves patient records, glucose readings, alerts and appointments.' },
      { icon: '☁️', head: 'AWS + Azure IoT — Cloud', body: 'Receives real-time data from wearable glucose sensors.' },
    ],
    color: 'from-purple-500/20 to-indigo-500/10',
  },
  {
    num: '03', title: 'Frontend — React.js',
    subtitle: 'What users see — fast, interactive web pages',
    content: [
      { icon: '🧩', head: 'Dashboard Tabs', body: 'Each tab (Overview, Blood Glucose, Patients, Analytics) is a React component.' },
      { icon: '📈', head: 'Real-time Charts', body: 'Chart.js / Recharts display live blood glucose graphs updated every 5s.' },
      { icon: '🔄', head: 'Why React?', body: 'Fast, reusable, most popular frontend framework for modern dashboards.' },
      { icon: '🛣️', head: 'React Router', body: 'Handles navigation between pages without full page reload (SPA).' },
    ],
    color: 'from-sky-500/20 to-cyan-500/10',
  },
  {
    num: '04', title: 'Backend — Node.js + Express',
    subtitle: 'Server logic that handles all API requests',
    content: [
      { icon: '⚡', head: 'Non-blocking I/O', body: 'Handles thousands of sensor readings simultaneously without slowing down.' },
      { icon: '🛤️', head: 'API Routes', body: '/api/glucose  /api/patients  /api/twin/predict' },
      { icon: '🔐', head: 'Middleware', body: 'JWT authentication checks login before allowing access to patient data.' },
      { icon: '🔗', head: 'Why Node.js?', body: 'JavaScript on the server — same language as frontend, fast and scalable.' },
    ],
    color: 'from-emerald-500/20 to-green-500/10',
  },
  {
    num: '05', title: 'AI/ML — Python + TensorFlow',
    subtitle: 'How predictions are made using the Digital Twin model',
    content: [
      { icon: '🧠', head: 'TensorFlow', body: 'Google\'s open-source AI library. Trained on thousands of glucose readings.' },
      { icon: '👾', head: 'Digital Twin Model', body: 'Simulates the patient\'s glucose behaviour — predicts next few hours.' },
      { icon: '🚨', head: 'Prediction Alerts', body: 'If hypoglycemia/hyperglycemia predicted → triggers API alert automatically.' },
      { icon: '🔌', head: 'Endpoint', body: 'POST /api/twin/predict — Python communicates with Node.js server via REST.' },
    ],
    color: 'from-rose-500/20 to-pink-500/10',
  },
  {
    num: '06', title: 'Cloud — AWS + Azure IoT',
    subtitle: 'How IoT device data is collected and scaled',
    content: [
      { icon: '📡', head: 'What is IoT?', body: 'Devices like glucose monitors that send data to the internet automatically.' },
      { icon: '🔵', head: 'Azure IoT Hub', body: 'Receives thousands of data points/second from patient wearables securely.' },
      { icon: '🪣', head: 'AWS S3', body: 'Stores medical files and reports in cloud object storage.' },
      { icon: '⚙️', head: 'AWS Lambda', body: 'Serverless functions for alert notifications and automated backups.' },
    ],
    color: 'from-amber-500/20 to-orange-500/10',
  },
  {
    num: '07', title: 'Architecture — Layers',
    subtitle: 'Blueprint of how all parts connect and work together',
    content: [
      { icon: '🖥️', head: 'Layer 1 — Presentation', body: 'FRONTEND — React.js renders dashboards, charts, and patient info.' },
      { icon: '⚙️', head: 'Layer 2 — Application', body: 'BACKEND — Node.js + Express handles requests, auth, business rules.' },
      { icon: '🧠', head: 'Layer 3 — Intelligence', body: 'AI ENGINE — Python + TensorFlow runs Digital Twin simulation & predictions.' },
      { icon: '🗄️', head: 'Layer 4 — Data', body: 'DATABASE — MongoDB + PostgreSQL store all patient & glucose data.' },
    ],
    color: 'from-violet-500/20 to-purple-500/10',
  },
  {
    num: '08', title: 'Architecture — Data Flow',
    subtitle: 'How data travels from sensor to doctor\'s screen',
    steps: [
      { step: '1', label: 'Patient Sensor', desc: 'Glucose sensor takes a reading every 5 minutes via Bluetooth.' },
      { step: '2', label: 'Azure IoT Hub', desc: 'Receives raw sensor data from thousands of devices, queues securely.' },
      { step: '3', label: 'Node.js Server', desc: 'Validates data, stores in database, calls AI engine for prediction.' },
      { step: '4', label: 'AI/ML Engine', desc: 'Runs Digital Twin model, predicts glucose, fires alerts if needed.' },
      { step: '5', label: 'Database', desc: 'Results saved in MongoDB/PostgreSQL for history and analytics.' },
      { step: '6', label: 'React Dashboard', desc: 'Updates in real-time — doctors see charts, alerts, and predictions.' },
    ],
    color: 'from-teal-500/20 to-cyan-500/10',
  },
  {
    num: '09', title: 'API — What is an API?',
    subtitle: 'Application Programming Interface — how frontend talks to backend',
    content: [
      { icon: '🍽️', head: 'API = Waiter', body: 'You (Frontend) → Waiter (API) → Kitchen (Backend) → brings back food (data).' },
      { icon: '📥', head: 'GET — Read', body: 'GET /api/patients — fetch list of all patients from database.' },
      { icon: '📤', head: 'POST — Create', body: 'POST /api/glucose/log — save a new glucose reading to database.' },
      { icon: '✏️', head: 'PUT — Update', body: 'PUT /api/patient/:id/settings — update patient alert thresholds.' },
      { icon: '🗑️', head: 'DELETE — Remove', body: 'DELETE /api/glucose/:id — remove incorrect glucose reading.' },
    ],
    color: 'from-blue-500/20 to-indigo-500/10',
  },
  {
    num: '10', title: 'API — All 7 Endpoints',
    subtitle: 'Each endpoint is a specific URL the frontend calls',
    endpoints: [
      { method: 'GET', path: '/api/patients', desc: 'All patients list' },
      { method: 'POST', path: '/api/glucose/log', desc: 'Save glucose reading' },
      { method: 'GET', path: '/api/glucose/:id/history', desc: 'Patient glucose history' },
      { method: 'POST', path: '/api/twin/predict', desc: 'AI glucose prediction' },
      { method: 'GET', path: '/api/alerts/:id', desc: 'Patient alerts' },
      { method: 'PUT', path: '/api/patient/:id/settings', desc: 'Update thresholds' },
      { method: 'DELETE', path: '/api/glucose/:id', desc: 'Delete entry' },
    ],
    color: 'from-cyan-500/20 to-sky-500/10',
  },
  {
    num: '11', title: 'Database — Collections & Tables',
    subtitle: 'Exact data structure for patient and glucose information',
    dbs: [
      { type: 'MongoDB', color: 'text-green-400', badge: 'bg-green-500/20 text-green-400', items: [
        { name: 'patients', fields: '_id, name, age, diabetes_type, email, created_at' },
        { name: 'glucose_readings', fields: '_id, patient_id, value (mg/dL), timestamp, notes' },
        { name: 'alerts', fields: '_id, patient_id, alert_level, message, is_read' },
        { name: 'twin_snapshots', fields: '_id, patient_id, model_data, prediction, ts' },
      ]},
      { type: 'PostgreSQL', color: 'text-blue-400', badge: 'bg-blue-500/20 text-blue-400', items: [
        { name: 'users', fields: 'id, patient_id, role, password_hash, email' },
        { name: 'medication_logs', fields: 'id, patient_id, drug_name, dose, taken_at' },
        { name: 'appointments', fields: 'id, patient_id, doctor_id, datetime, notes' },
        { name: 'audit_logs', fields: 'id, user_id, action, resource, logged_at' },
      ]},
    ],
    color: 'from-indigo-500/20 to-purple-500/10',
  },
  {
    num: '12', title: '🎉 Thank You!',
    subtitle: 'Digital Twin — Diabetes Monitoring System',
    summary: true,
    color: 'from-cyan-500/20 to-primary-600/10',
  },
];

const methodBadge = { GET: 'badge-get', POST: 'badge-post', PUT: 'badge-put', DELETE: 'badge-delete' };

function SlideContent({ slide }) {
  if (slide.summary) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[
          { label: 'Tech Stack', items: ['React.js','Node.js','Python','TensorFlow','AWS','MongoDB'], color: 'border-cyan-500/30 bg-cyan-500/5' },
          { label: 'Architecture', items: ['Presentation Layer','Application Layer','AI/ML Layer','Data Layer'], color: 'border-purple-500/30 bg-purple-500/5' },
          { label: 'API Endpoints', items: ['7 REST Endpoints','GET · POST','PUT · DELETE','JWT Secured'], color: 'border-emerald-500/30 bg-emerald-500/5' },
          { label: 'Database', items: ['MongoDB (NoSQL)','PostgreSQL (SQL)','8 Collections/Tables','1.2M+ Records'], color: 'border-amber-500/30 bg-amber-500/5' },
        ].map(c => (
          <div key={c.label} className={`p-4 rounded-2xl border ${c.color}`}>
            <p className="text-white font-bold mb-2 text-sm">{c.label}</p>
            <ul className="space-y-1">
              {c.items.map(i => <li key={i} className="text-slate-400 text-xs">• {i}</li>)}
            </ul>
          </div>
        ))}
        <div className="col-span-2 md:col-span-4 text-center mt-4">
          <p className="text-slate-400 text-sm">This is a full-stack system where React, Node.js, Python AI, Cloud IoT, MongoDB, and PostgreSQL all work together to monitor diabetes in real-time.</p>
          <p className="text-primary-400 font-mono mt-2 text-sm">diabetiesanalysis.netlify.app</p>
        </div>
      </div>
    );
  }
  if (slide.steps) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
        {slide.steps.map((s, i) => (
          <div key={i} className="glass-card p-4 flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-primary-400 font-bold text-sm flex-shrink-0">{s.step}</div>
            <div>
              <p className="text-white font-semibold text-sm">{s.label}</p>
              <p className="text-slate-400 text-xs mt-0.5">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (slide.dbs) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {slide.dbs.map(db => (
          <div key={db.type} className="glass-card p-4">
            <p className={`font-bold mb-3 ${db.color}`}>{db.type}</p>
            <div className="space-y-2">
              {db.items.map(item => (
                <div key={item.name} className="bg-white/3 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded ${db.badge} font-mono font-bold`}>{item.name}</span>
                  </div>
                  <p className="text-slate-400 text-xs font-mono">{item.fields}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (slide.endpoints) {
    return (
      <div className="space-y-2 mt-6">
        {slide.endpoints.map((ep, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/3 border border-white/8 hover:bg-white/5 transition-all">
            <span className={`${methodBadge[ep.method]} w-16 text-center flex-shrink-0`}>{ep.method}</span>
            <code className="text-cyan-300 font-mono text-sm flex-1">{ep.path}</code>
            <span className="text-slate-400 text-xs hidden md:block">{ep.desc}</span>
          </div>
        ))}
        <div className="px-4 py-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-300 mt-2">🔐 All endpoints protected by JWT Bearer Token · HTTPS only</div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
      {slide.content?.map((item, i) => (
        <div key={i} className="glass-card p-4 hover:border-primary-500/30 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{item.icon}</span>
            <p className="text-white font-semibold text-sm">{item.head}</p>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">{item.body}</p>
        </div>
      ))}
    </div>
  );
}

export default function Slides() {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];

  return (
    <div className="animate-fade-in">
      <Header title="Presentation Slides" subtitle="12-slide Digital Twin beginner's guide" />
      <div className="p-6">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-5">
          <span className="text-slate-400 text-xs">{current + 1} / {slides.length}</span>
          <div className="flex-1 flex gap-1">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`flex-1 h-1 rounded-full transition-all duration-300 ${i === current ? 'bg-primary-500' : i < current ? 'bg-primary-800' : 'bg-white/10'}`} />
            ))}
          </div>
        </div>

        {/* Slide */}
        <div className={`glass-card p-6 md:p-8 bg-gradient-to-br ${slide.color} min-h-[520px] animate-fade-in`} key={current}>
          <div className="flex items-start justify-between mb-2">
            <span className="text-slate-500 text-xs font-mono font-bold">SLIDE {slide.num}</span>
            <div className="flex gap-1">
              {slide.content?.slice(0, 5).map((_, i) => <Circle key={i} className="w-1.5 h-1.5 fill-primary-500 text-primary-500" />)}
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-1">{slide.title}</h2>
          <p className="text-slate-400 text-sm mt-1">{slide.subtitle}</p>
          <SlideContent slide={slide} />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-5">
          <button
            onClick={() => setCurrent(p => Math.max(0, p - 1))}
            disabled={current === 0}
            className="flex items-center gap-2 btn-ghost text-sm disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-primary-500 w-6' : 'bg-white/20 hover:bg-white/40'}`} />
            ))}
          </div>
          <button
            onClick={() => setCurrent(p => Math.min(slides.length - 1, p + 1))}
            disabled={current === slides.length - 1}
            className="flex items-center gap-2 btn-primary text-sm disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
