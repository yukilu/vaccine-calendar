import { useState, useEffect } from 'react';
import { Vaccine, VaccineInput } from '../types';
import { createVaccine, updateVaccine, deleteVaccine } from '../api';

interface Props {
  vaccine: Vaccine | null;
  onClose: () => void;
  onSaved: () => void;
}

function pad(n: number) {
  return n < 10 ? '0' + n : '' + n;
}

function todayDate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function VaccineForm({ vaccine, onClose, onSaved }: Props) {
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [scheduledTime, setScheduledTime] = useState(todayDate());
  const [price, setPrice] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (vaccine) {
      setName(vaccine.name);
      setDose(vaccine.dose != null ? String(vaccine.dose) : '');
      setScheduledTime(vaccine.scheduled_time.slice(0, 10));
      setPrice(vaccine.price != null ? String(vaccine.price) : '');
    }
  }, [vaccine]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('请填写名称');
      return;
    }
    if (!scheduledTime) {
      setError('请选择时间');
      return;
    }
    const payload: VaccineInput = {
      name: name.trim(),
      dose: Number(dose) || 1,
      scheduled_time: scheduledTime,
      price: Number(price) || 0,
    };
    setSaving(true);
    try {
      if (vaccine) await updateVaccine(vaccine.id, payload);
      else await createVaccine(payload);
      onSaved();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!vaccine) return;
    if (!confirm('确定删除该疫苗日程吗？')) return;
    setSaving(true);
    try {
      await deleteVaccine(vaccine.id);
      onSaved();
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{vaccine ? '编辑疫苗日程' : '新增疫苗日程'}</h3>
          <button className="modal-close" onClick={onClose} aria-label="关闭">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="form">
          <label className="field">
            <span>名称</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="如：乙肝疫苗"
              autoFocus
            />
          </label>
          <label className="field">
            <span>针次</span>
            <input
              type="number"
              min={1}
              value={dose}
              onChange={(e) => setDose(e.target.value)}
              placeholder="请输入针次"
            />
          </label>
          <label className="field">
            <span>时间</span>
            <input
              type="date"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            />
          </label>
          <label className="field">
            <span>价格（元）</span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="请输入价格"
            />
          </label>
          {error && <div className="form-error">{error}</div>}
          <div className="form-actions">
            {vaccine && (
              <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={saving}>
                删除
              </button>
            )}
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>
              取消
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
