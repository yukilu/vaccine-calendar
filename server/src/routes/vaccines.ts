import { Router, Request, Response } from 'express';
import { db, VaccineRow } from '../db.js';

export const vaccineRouter = Router();

// 获取全部疫苗日程（按时间升序）
vaccineRouter.get('/', (_req: Request, res: Response) => {
  const rows = db.prepare('SELECT * FROM vaccines ORDER BY scheduled_time ASC').all() as unknown as VaccineRow[];
  res.json(rows);
});

// 新增疫苗日程
vaccineRouter.post('/', (req: Request, res: Response) => {
  const { name, dose, scheduled_time, price } = req.body ?? {};
  if (!name || !scheduled_time || dose == null || price == null) {
    return res.status(400).json({ error: '缺少必填字段（name/dose/scheduled_time/price）' });
  }
  const info = db
    .prepare('INSERT INTO vaccines (name, dose, scheduled_time, price) VALUES (?, ?, ?, ?)')
    .run(String(name), Number(dose), String(scheduled_time), Number(price));
  const row = db.prepare('SELECT * FROM vaccines WHERE id = ?').get(info.lastInsertRowid) as unknown as VaccineRow;
  res.status(201).json(row);
});

// 更新疫苗日程
vaccineRouter.put('/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM vaccines WHERE id = ?').get(id) as unknown as VaccineRow | undefined;
  if (!existing) return res.status(404).json({ error: '未找到该疫苗日程' });

  const { name, dose, scheduled_time, price } = req.body ?? {};
  const next = {
    name: name != null ? String(name) : existing.name,
    dose: dose != null ? Number(dose) : existing.dose,
    scheduled_time: scheduled_time != null ? String(scheduled_time) : existing.scheduled_time,
    price: price != null ? Number(price) : existing.price,
  };
  db.prepare(
    'UPDATE vaccines SET name=?, dose=?, scheduled_time=?, price=?, updated_at=CURRENT_TIMESTAMP WHERE id=?'
  ).run(next.name, next.dose, next.scheduled_time, next.price, id);
  const row = db.prepare('SELECT * FROM vaccines WHERE id = ?').get(id) as unknown as VaccineRow;
  res.json(row);
});

// 删除疫苗日程
vaccineRouter.delete('/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const info = db.prepare('DELETE FROM vaccines WHERE id = ?').run(id);
  if (info.changes === 0) return res.status(404).json({ error: '未找到该疫苗日程' });
  res.json({ success: true });
});
