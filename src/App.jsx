import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import BloodGlucose from './pages/BloodGlucose';
import Patients from './pages/Patients';
import Analytics from './pages/Analytics';
import APIExplorer from './pages/APIExplorer';
import Database from './pages/Database';
import Slides from './pages/Slides';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-64 min-h-screen">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/glucose" element={<BloodGlucose />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/api" element={<APIExplorer />} />
            <Route path="/database" element={<Database />} />
            <Route path="/slides" element={<Slides />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
