export interface Vaccine {
  id: number;
  name: string;
  dose: number;
  scheduled_time: string;
  price: number;
  created_at?: string;
  updated_at?: string;
}

export type VaccineInput = Omit<Vaccine, 'id' | 'created_at' | 'updated_at'>;

export type View = 'calendar' | 'schedule';
