'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllDishes, createDish, updateDish, deleteDish, uploadImage, Dish } from '@/lib/api';

const DAYS = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE'];
const emptyForm = { day: 'LUNDI', name: '', description: '', price: 0, imageUrl: '' };

function formatPrice(n: number) {
  return n.toLocaleString('fr-FR') + ' FCFA';
}

export default function AdminDishesPage() {
  const queryClient = useQueryClient();
  const { data: dishes, isLoading } = useQuery({ queryKey: ['admin-dishes'], queryFn: getAllDishes });

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-dishes'] });
    queryClient.invalidateQueries({ queryKey: ['dishes'] });
  };

  const createMut = useMutation({ mutationFn: createDish, onSuccess: () => { invalidate(); closeForm(); } });
  const updateMut = useMutation({
    mutationFn: (vars: { id: string; data: Partial<Dish> }) => updateDish(vars.id, vars.data),
    onSuccess: () => { invalidate(); closeForm(); },
  });
  const deleteMut = useMutation({ mutationFn: deleteDish, onSuccess: invalidate });

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(dish: Dish) {
    setEditingId(dish.id);
    setForm({ day: dish.day, name: dish.name, description: dish.description, price: dish.price, imageUrl: dish.imageUrl || '' });
    setOpen(true);
  }

  function closeForm() {
    setOpen(false);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      setForm((f) => ({ ...f, imageUrl: url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${url}` }));
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) updateMut.mutate({ id: editingId, data: form });
    else createMut.mutate(form);
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-navy">Menu de la semaine</h1>
        <button onClick={openCreate} className="rounded-full bg-brand-blue text-white hover:bg-brand-blue-dark px-4 py-2 text-sm font-medium">+ Ajouter un plat</button>
      </div>

      {isLoading ? (
        <p className="text-navy/60">Chargement…</p>
      ) : (
        <div className="grid gap-3">
          {dishes?.map((d) => (
            <div key={d.id} className="bg-white rounded-xl p-4 flex items-center justify-between gap-4 shadow-sm">
              <div>
                <span className="inline-block text-xs font-semibold bg-cream text-navy px-2 py-1 rounded-full mr-2">{d.day}</span>
                {!d.active && <span className="inline-block text-xs font-semibold bg-red-100 text-red-700 px-2 py-1 rounded-full mr-2">inactif</span>}
                <h3 className="font-semibold inline">{d.name}</h3>
                <p className="text-sm text-navy/60">{d.description}</p>
                <p className="text-sm font-semibold text-orange mt-1">{formatPrice(d.price)}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(d)} className="rounded-full border px-3 py-1.5 text-sm">Modifier</button>
                <button onClick={() => deleteMut.mutate(d.id)} className="rounded-full border px-3 py-1.5 text-sm text-red-700">Retirer</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20 p-4" onClick={closeForm}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 w-full max-w-md space-y-3">
            <h2 className="font-display text-lg font-semibold text-navy">{editingId ? 'Modifier le plat' : 'Ajouter un plat'}</h2>
            <label className="block text-sm font-medium">Jour
              <select value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1">
                {DAYS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium">Nom
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" />
            </label>
            <label className="block text-sm font-medium">Description
              <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" />
            </label>
            <label className="block text-sm font-medium">Prix (FCFA)
              <input required type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2 mt-1" />
            </label>
            <label className="block text-sm font-medium">Photo
              <input type="file" accept="image/*" onChange={handleFileChange} className="w-full mt-1" />
              {uploading && <span className="text-xs text-navy/60">Envoi de la photo…</span>}
              {form.imageUrl && <img src={form.imageUrl} alt="" className="mt-2 h-24 rounded-lg object-cover" />}
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={closeForm} className="rounded-full border px-4 py-2 text-sm">Annuler</button>
              <button type="submit" disabled={uploading} className="rounded-full bg-brand-blue text-white hover:bg-brand-blue-dark px-4 py-2 text-sm font-medium">Enregistrer</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
