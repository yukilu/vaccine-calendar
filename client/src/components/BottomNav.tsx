import { View } from '../types';

interface Props {
  view: View;
  onChange: (v: View) => void;
  onAdd: () => void;
}

function CalendarIcon({ active }: { active: boolean }) {
  const color = active ? '#2b6cff' : '#8a8f99';
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ListIcon({ active }: { active: boolean }) {
  const color = active ? '#2b6cff' : '#8a8f99';
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

export default function BottomNav({ view, onChange, onAdd }: Props) {
  return (
    <nav className="bottom-nav">
      <button
        className={`nav-item ${view === 'calendar' ? 'active' : ''}`}
        onClick={() => onChange('calendar')}
      >
        <CalendarIcon active={view === 'calendar'} />
        <span className="nav-label">日历</span>
      </button>
      <button className="nav-add" onClick={onAdd} aria-label="新增疫苗日程">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
      <button
        className={`nav-item ${view === 'schedule' ? 'active' : ''}`}
        onClick={() => onChange('schedule')}
      >
        <ListIcon active={view === 'schedule'} />
        <span className="nav-label">日程</span>
      </button>
    </nav>
  );
}
