import { useMemo } from 'react';
import { Vaccine } from '../types';

interface Props {
  vaccines: Vaccine[];
  loading: boolean;
  onEdit: (v: Vaccine) => void;
}

export default function SchedulePage({ vaccines, loading, onEdit }: Props) {
  const sorted = useMemo(
    () => [...vaccines].sort((a, b) => a.scheduled_time.localeCompare(b.scheduled_time)),
    [vaccines]
  );

  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return (
    <div className="schedule-page">
      {loading ? (
        <div className="empty">加载中...</div>
      ) : sorted.length === 0 ? (
        <div className="empty">还没有疫苗日程，点击下方 + 添加</div>
      ) : (
        <div className="schedule-list">
          {sorted.map((v) => {
            const date = new Date(v.scheduled_time.slice(0, 10) + 'T00:00:00');
            const isExpired = date < startToday;
            const isToday = date.getTime() === startToday.getTime();
            const fmt = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
            return (
              <div
                key={v.id}
                className={`vaccine-card schedule-card${isExpired ? ' expired' : ''}${isToday ? ' today' : ''}`}
                onClick={() => onEdit(v)}
              >
                <div className="vc-left">
                  <div className="vc-name">{v.name}</div>
                  <div className="vc-sub">
                    第 {v.dose} 针 · ¥{v.price}
                  </div>
                </div>
                <div className="vc-right">
                  <div className="vc-date">{fmt}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
