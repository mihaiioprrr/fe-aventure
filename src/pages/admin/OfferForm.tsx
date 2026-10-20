import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { AdminOffer, CATEGORIES, DIFFICULTIES } from './types';

interface Props {
  initial?: AdminOffer | null;
  onSave: (data: Partial<AdminOffer>) => Promise<void>;
  onClose: () => void;
}

const EMPTY: Partial<AdminOffer> = {
  slug: '',
  title: '',
  subtitle: '',
  category: 'Aventură Montană',
  destination: '',
  country: 'România',
  duration_days: 3,
  duration_nights: 2,
  price_ron: 0,
  image_url: '',
  short_desc: '',
  full_desc: '',
  difficulty: 'Ușor',
  transport: '',
  accommodation: '',
  featured: 0,
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export const OfferForm: React.FC<Props> = ({ initial, onSave, onClose }) => {
  const [form, setForm] = useState<Partial<AdminOffer>>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(initial ?? EMPTY);
    setError('');
  }, [initial]);

  const set = (field: keyof AdminOffer, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleTitleChange = (v: string) => {
    setForm((prev) => ({
      ...prev,
      title: v,
      // auto-generate slug only when creating new
      ...(initial ? {} : { slug: slugify(v) }),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.title?.trim() || !form.slug?.trim() || !form.destination?.trim() || !form.price_ron) {
      setError('Titlu, slug, destinație și preț sunt obligatorii.');
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err: any) {
      setError(err.message ?? 'Eroare la salvare.');
    } finally {
      setSaving(false);
    }
  };

  const field = (
    label: string,
    key: keyof AdminOffer,
    opts?: { type?: string; required?: boolean; placeholder?: string }
  ) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
        {label} {opts?.required && <span className="text-[#89CFF0]">*</span>}
      </label>
      <input
        type={opts?.type ?? 'text'}
        placeholder={opts?.placeholder ?? ''}
        value={String(form[key] ?? '')}
        onChange={(e) =>
          key === 'title' ? handleTitleChange(e.target.value) : set(key, e.target.value)
        }
        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#89CFF0]/50 transition-colors"
        required={opts?.required}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#0d0f14] border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#0d0f14] px-6 py-4 border-b border-white/[0.07] flex items-center justify-between">
          <h2 className="text-base font-bold text-white">
            {initial ? 'Editează oferta' : 'Adaugă ofertă nouă'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('Titlu', 'title', { required: true, placeholder: 'ex: Aventura Carpaților' })}
            {field('Slug (URL)', 'slug', { required: true, placeholder: 'ex: aventura-carpatilor' })}
          </div>

          {field('Subtitlu', 'subtitle', { placeholder: 'ex: 5 zile de drumeție în Bucegi' })}

          {/* Category & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Categorie <span className="text-[#89CFF0]">*</span>
              </label>
              <select
                value={form.category ?? ''}
                onChange={(e) => set('category', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white focus:outline-none focus:border-[#89CFF0]/50 transition-colors"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-[#0d0f14]">{c}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Dificultate
              </label>
              <select
                value={form.difficulty ?? 'Ușor'}
                onChange={(e) => set('difficulty', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white focus:outline-none focus:border-[#89CFF0]/50 transition-colors"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d} className="bg-[#0d0f14]">{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Destination & Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('Destinație', 'destination', { required: true, placeholder: 'ex: Sinaia, Prahova' })}
            {field('Țară', 'country', { placeholder: 'ex: România' })}
          </div>

          {/* Duration & Price */}
          <div className="grid grid-cols-3 gap-4">
            {field('Zile', 'duration_days', { type: 'number' })}
            {field('Nopți', 'duration_nights', { type: 'number' })}
            {field('Preț (RON)', 'price_ron', { type: 'number', required: true })}
          </div>

          {/* Transport & Accommodation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('Transport', 'transport', { placeholder: 'ex: Autocar AC' })}
            {field('Cazare', 'accommodation', { placeholder: 'ex: Pensiune 3★' })}
          </div>

          {field('URL Imagine principală', 'image_url', { placeholder: 'https://...' })}

          {/* Descriptions */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Descriere scurtă
            </label>
            <textarea
              rows={2}
              value={form.short_desc ?? ''}
              onChange={(e) => set('short_desc', e.target.value)}
              placeholder="1-2 propoziții pentru lista de oferte..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#89CFF0]/50 transition-colors resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Descriere completă
            </label>
            <textarea
              rows={5}
              value={form.full_desc ?? ''}
              onChange={(e) => set('full_desc', e.target.value)}
              placeholder="Descriere detaliată a pachetului turistic..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#89CFF0]/50 transition-colors resize-none"
            />
          </div>

          {/* Featured toggle */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => set('featured', form.featured ? 0 : 1)}
              className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 ${
                form.featured ? 'bg-[#89CFF0]' : 'bg-white/10'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                  form.featured ? 'translate-x-4.5' : 'translate-x-0'
                }`}
              />
            </div>
            <span className="text-sm text-neutral-300">Promovată pe pagina principală</span>
          </label>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-neutral-400 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
            >
              Anulează
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold text-[#07080c] bg-[#89CFF0] hover:bg-[#70c4e8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Se salvează...' : 'Salvează'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
