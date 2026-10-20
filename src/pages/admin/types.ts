export interface AdminOffer {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  destination: string;
  country: string;
  duration_days: number;
  duration_nights: number;
  price_ron: number;
  image_url: string;
  short_desc: string;
  full_desc: string;
  difficulty: string;
  transport: string;
  accommodation: string;
  featured: number;
  created_at: string;
}

export interface AdminReservation {
  id: number;
  name: string;
  email: string;
  phone: string;
  offer_id: string;
  offer_title: string;
  message: string;
  status: 'noua' | 'in_progres' | 'confirmata' | 'anulata';
  created_at: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  birthdate: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface AdminStats {
  users: number;
  reservations: number;
  new_res: number;
  offers: number;
}

export const CATEGORIES = [
  'Aventură Montană',
  'City Break & Cultură',
  'Litoral & Relaxare',
  'Circuite Școlare',
  'Eco-Turism',
] as const;

export const DIFFICULTIES = ['Ușor', 'Moderat', 'Activ / Aventură'] as const;

export const STATUS_LABELS: Record<string, string> = {
  noua: 'Nouă',
  in_progres: 'În progres',
  confirmata: 'Confirmată',
  anulata: 'Anulată',
};

export const STATUS_COLORS: Record<string, string> = {
  noua: 'bg-[#89CFF0]/15 text-[#89CFF0]',
  in_progres: 'bg-yellow-400/15 text-yellow-300',
  confirmata: 'bg-emerald-400/15 text-emerald-300',
  anulata: 'bg-red-400/15 text-red-300',
};
