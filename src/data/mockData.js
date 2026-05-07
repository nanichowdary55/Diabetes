// Mock data for the entire app
export const patients = [
  { id: 'P001', name: 'Arjun Sharma', age: 45, type: 'Type 2', email: 'arjun@email.com', status: 'Critical', lastReading: 285, target: '80-140', device: 'CGM-Pro X', createdAt: '2024-01-10' },
  { id: 'P002', name: 'Priya Menon', age: 34, type: 'Type 1', email: 'priya@email.com', status: 'Normal', lastReading: 112, target: '70-130', device: 'FreeStyle 3', createdAt: '2024-02-14' },
  { id: 'P003', name: 'Ramesh Iyer', age: 58, type: 'Type 2', email: 'ramesh@email.com', status: 'Warning', lastReading: 198, target: '80-150', device: 'Dexcom G7', createdAt: '2024-03-01' },
  { id: 'P004', name: 'Sunita Patel', age: 29, type: 'Type 1', email: 'sunita@email.com', status: 'Normal', lastReading: 95, target: '70-130', device: 'CGM-Pro X', createdAt: '2024-03-22' },
  { id: 'P005', name: 'Vikram Nair', age: 52, type: 'Type 2', email: 'vikram@email.com', status: 'Warning', lastReading: 167, target: '80-150', device: 'Libre 3', createdAt: '2024-04-05' },
];

export const generateGlucoseData = (points = 24, baseValue = 120, patientId = 'P001') => {
  const seeds = { P001: 285, P002: 112, P003: 198, P004: 95, P005: 167 };
  let value = seeds[patientId] || baseValue;
  return Array.from({ length: points }, (_, i) => {
    const hour = (new Date().getHours() - points + i + 24) % 24;
    const label = `${String(hour).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`;
    value = Math.max(60, Math.min(320, value + (Math.random() - 0.48) * 20));
    return { time: label, glucose: Math.round(value), predicted: Math.round(value + (Math.random() - 0.5) * 15) };
  });
};

export const alerts = [
  { id: 'A001', patientId: 'P001', patient: 'Arjun Sharma', level: 'Critical', message: 'Hyperglycemia detected — Glucose 285 mg/dL (threshold: 180)', isRead: false, time: '2 min ago' },
  { id: 'A002', patientId: 'P003', patient: 'Ramesh Iyer', level: 'Warning', message: 'Rising trend — Glucose approaching 200 mg/dL', isRead: false, time: '15 min ago' },
  { id: 'A003', patientId: 'P005', patient: 'Vikram Nair', level: 'Warning', message: 'Post-meal spike — 167 mg/dL, above target', isRead: true, time: '1 hr ago' },
  { id: 'A004', patientId: 'P002', patient: 'Priya Menon', level: 'Info', message: 'Glucose normalised after insulin dose', isRead: true, time: '3 hr ago' },
  { id: 'A005', patientId: 'P004', patient: 'Sunita Patel', level: 'Success', message: 'Glucose in target range for 6 consecutive hours', isRead: true, time: '4 hr ago' },
];

export const predictions = [
  { patientId: 'P001', patient: 'Arjun Sharma', current: 285, predicted30: 302, predicted60: 295, predicted120: 270, risk: 'High', confidence: 87 },
  { patientId: 'P002', patient: 'Priya Menon', current: 112, predicted30: 118, predicted60: 125, predicted120: 115, risk: 'Low', confidence: 94 },
  { patientId: 'P003', patient: 'Ramesh Iyer', current: 198, predicted30: 210, predicted60: 205, predicted120: 185, risk: 'Medium', confidence: 81 },
  { patientId: 'P004', patient: 'Sunita Patel', current: 95, predicted30: 92, predicted60: 98, predicted120: 105, risk: 'Low', confidence: 96 },
  { patientId: 'P005', patient: 'Vikram Nair', current: 167, predicted30: 172, predicted60: 168, predicted120: 155, risk: 'Medium', confidence: 78 },
];

export const apiEndpoints = [
  { method: 'GET', path: '/api/patients', description: 'Returns a list of all diabetic patients registered in the system.', response: '[ { _id, name, age, diabetes_type, email, created_at } ]', auth: true },
  { method: 'POST', path: '/api/glucose/log', description: 'Saves a new blood glucose reading sent from a sensor or manual entry.', body: '{ patient_id, value, timestamp, notes }', auth: true },
  { method: 'GET', path: '/api/glucose/:id/history', description: 'Returns the full glucose history for one patient (used for trend charts).', response: '[ { value, timestamp, notes } ]', auth: true },
  { method: 'POST', path: '/api/twin/predict', description: 'Sends current patient data to the AI model and returns a future glucose prediction.', body: '{ patient_id, recent_readings[], model_version }', response: '{ predicted_30m, predicted_60m, risk_level, confidence }', auth: true },
  { method: 'GET', path: '/api/alerts/:id', description: 'Fetches all unread medical alerts for a specific patient.', response: '[ { alert_level, message, is_read, created_at } ]', auth: true },
  { method: 'PUT', path: '/api/patient/:id/settings', description: "Updates the patient's min/max glucose thresholds and notification preferences.", body: '{ min_threshold, max_threshold, notify_sms, notify_email }', auth: true },
  { method: 'DELETE', path: '/api/glucose/:id', description: 'Deletes an incorrect or duplicate glucose entry from the database.', auth: true },
];

export const mongoCollections = [
  { name: 'patients', fields: ['_id', 'name', 'age', 'diabetes_type', 'email', 'created_at'], desc: 'Stores the profile of each diabetic patient.' },
  { name: 'glucose_readings', fields: ['_id', 'patient_id', 'value (mg/dL)', 'timestamp', 'notes'], desc: 'Every sensor or manual glucose reading.' },
  { name: 'alerts', fields: ['_id', 'patient_id', 'alert_level', 'message', 'is_read'], desc: 'Medical alerts fired by the AI engine.' },
  { name: 'twin_snapshots', fields: ['_id', 'patient_id', 'model_data', 'prediction', 'ts'], desc: 'Saved AI prediction results per session.' },
];

export const pgTables = [
  { name: 'users', fields: ['id', 'patient_id', 'role', 'password_hash', 'email'], desc: 'Secure login credentials and access roles.' },
  { name: 'medication_logs', fields: ['id', 'patient_id', 'drug_name', 'dose', 'taken_at'], desc: 'Tracks insulin and medication history.' },
  { name: 'appointments', fields: ['id', 'patient_id', 'doctor_id', 'datetime', 'notes'], desc: 'Scheduled doctor visits and check-ups.' },
  { name: 'audit_logs', fields: ['id', 'user_id', 'action', 'resource', 'logged_at'], desc: 'Security trail of all system actions.' },
];
