import { Vaccine, VaccineInput } from './types';

const BASE = '/api/vaccines';

async function handle(res: Response) {
  if (!res.ok) {
    let msg = '请求失败';
    try {
      const data = await res.json();
      msg = data.error || msg;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }
  return res;
}

export async function fetchVaccines(): Promise<Vaccine[]> {
  const res = await handle(await fetch(BASE));
  return res.json();
}

export async function createVaccine(data: VaccineInput): Promise<Vaccine> {
  const res = await handle(
    await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  );
  return res.json();
}

export async function updateVaccine(id: number, data: VaccineInput): Promise<Vaccine> {
  const res = await handle(
    await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  );
  return res.json();
}

export async function deleteVaccine(id: number): Promise<void> {
  await handle(await fetch(`${BASE}/${id}`, { method: 'DELETE' }));
}
