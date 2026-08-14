import { useState, useEffect, useCallback } from 'react';
import { Vaccine } from './types';
import { fetchVaccines } from './api';
import BottomNav from './components/BottomNav';
import CalendarPage from './components/CalendarPage';
import SchedulePage from './components/SchedulePage';
import VaccineForm from './components/VaccineForm';
import { View } from './types';

export default function App() {
  const [view, setView] = useState<View>('calendar');
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Vaccine | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchVaccines();
      setVaccines(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (v: Vaccine) => {
    setEditing(v);
    setFormOpen(true);
  };

  return (
    <div className="app">
      <div className="content">
        {view === 'calendar' ? (
          <CalendarPage vaccines={vaccines} />
        ) : (
          <SchedulePage vaccines={vaccines} loading={loading} onEdit={openEdit} />
        )}
      </div>
      <BottomNav view={view} onChange={setView} onAdd={openAdd} />
      {formOpen && (
        <VaccineForm
          vaccine={editing}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            load();
          }}
        />
      )}
    </div>
  );
}
