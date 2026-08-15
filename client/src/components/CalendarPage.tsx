import { useState, useMemo } from 'react';
import { Vaccine } from '../types';

interface Props {
  vaccines: Vaccine[];
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

function pad(n: number) {
  return n < 10 ? '0' + n : '' + n;
}
function dateKey(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function CalendarPage({ vaccines }: Props) {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const byDate = useMemo(() => {
    const map = new Map<string, Vaccine[]>();
    for (const v of vaccines) {
      const key = v.scheduled_time.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(v);
    }
    return map;
  }, [vaccines]);

  const stats = useMemo(() => {
    const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const done = vaccines.filter((v) => {
      const d = new Date(v.scheduled_time.slice(0, 10) + 'T00:00:00');
      return d <= startToday;
    });
    const total = done.reduce((s, v) => s + (Number(v.price) || 0), 0);
    const byName = new Map<string, { count: number; total: number }>();
    for (const v of done) {
      if (!(Number(v.price) > 0)) continue;
      const item = byName.get(v.name) || { count: 0, total: 0 };
      item.count += 1;
      item.total += Number(v.price) || 0;
      byName.set(v.name, item);
    }
    return {
      total,
      list: [...byName.entries()].map(([name, info]) => ({ name, ...info })),
    };
  }, [vaccines]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const prevMonth = () => setCursor(new Date(year, month - 1, 1));
  const nextMonth = () => setCursor(new Date(year, month + 1, 1));
  const todayKey = dateKey(today);

  return (
    <>
      <div className="calendar-page">
        <div className="cal-header">
          <button className="cal-nav-btn" onClick={prevMonth} aria-label="上个月">
            <span>‹</span>
          </button>
          <div className="cal-title">
            {year}年{month + 1}月
          </div>
          <button className="cal-nav-btn" onClick={nextMonth} aria-label="下个月">
            <span>›</span>
          </button>
        </div>

        <div className="cal-weekdays">
          {WEEKDAYS.map((w) => (
            <div key={w} className="cal-weekday">
              {w}
            </div>
          ))}
        </div>

        <div className="cal-grid">
          {cells.map((d, i) => {
            if (d === null) return <div key={i} className="cal-cell empty" />;
            const key = `${year}-${pad(month + 1)}-${pad(d)}`;
            const items = byDate.get(key) || [];
            const isToday = key === todayKey;
            const isPast = key < todayKey;
            return (
              <div key={i} className={`cal-cell ${isToday ? 'today' : ''}`}>
                <span className="cal-day">{d}</span>
                {items.length > 0 && (
                  <div className="cal-chips">
                    {items.slice(0, 2).map((v) => (
                      <div
                        key={v.id}
                        className={`cal-chip ${isPast ? 'expired' : ''}`}
                        title={`${v.name} 第${v.dose}针`}
                      >
                        {v.name}
                        <span className="cal-chip-dose">{v.dose}</span>
                      </div>
                    ))}
                    {items.length > 2 && <span className="cal-more">+{items.length - 2}</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="stats">
        <div className="stats-total">
          <span>总花费</span>
          <strong>¥{stats.total.toFixed(2)}</strong>
        </div>
        {stats.list.length > 0 && (
          <div className="stats-list">
            {stats.list.map((item) => (
              <div key={item.name} className="stats-item">
                <span className="stats-name">
                  {item.name} ×{item.count}
                </span>
                <span className="stats-amount">¥{item.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
