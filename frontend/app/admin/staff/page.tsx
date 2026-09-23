'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser, deleteUser } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function AdminStaffPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useQuery({ queryKey: ['users'], queryFn: getUsers });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'STAFF' as 'ADMIN' | 'STAFF' });
  const [error, setError] = useState<string | null>(null);

  const createMut = useMutation({
    mutationFn: createUser,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['users'] }); setOpen(false); setForm({ email: '', password: '', name: '', role: 'STAFF' }); },
    onError: () => setError("Impossible de créer ce compte (email déjà utilisé ?)."),
  });
  const deleteMut = useMutation({ mutationFn: deleteUser, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }) });

  if (user?.role !== 'ADMIN') {
    return <p className="text-navy/60">Cette section est réservée aux administrateurs.</p>;
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-navy">Membres de l&apos;équipe</h1>
        <button onClick={() => setOpen(true)} className="rounded-full bg-navy text-white px-4 py-2 text-sm font-medium">+ Ajouter un accès</button>
      </div>

      {isLoading ? (
        <p className="text-navy/60">Chargement…</p>
      ) : (
        <div className="grid gap-3">
          {users?.map((u) => (
            <div key={u.id} className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div>
                <h3 className="font-semibold">{u.name || u.email}</h3>
                <p className="text-sm text-navy/60">{u.email} — {u.role === 'ADMIN' ? 'administrateur' : 'employé'}</p>
              </div>
              <button onClick={() => deleteMut.mutate(u.id)} className="rounded-full border px-3 py-1.5 text-sm text-red-700">Retirer l&apos;accès</button>
            </div>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20 p-4" onClick={() => setOpen(false)}>
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => { e.preventDefault(); setError(null); createMut.mutate(form); }}
            className="bg-white rounded-2xl p-6 w-full max-w-md space-y-3"
          >
            <h2 className="font-display text-lg font-semibold text-navy">Ajouter un accès</h2>
            <label className="block text-sm font-medium">Nom
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" />
            </label>
            <label className="block text-sm font-medium">Email
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" />
            </label>
            <label className="block text-sm font-medium">Mot de passe provisoire
              <input required minLength={8} type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border rounded-lg px-3 py-2 mt-1" />
            </label>
            <label className="block text-sm font-medium">Rôle
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as 'ADMIN' | 'STAFF' })} className="w-full border rounded-lg px-3 py-2 mt-1">
                <option value="STAFF">Employé (menu et commandes)</option>
                <option value="ADMIN">Administrateur (accès complet)</option>
              </select>
            </label>
            {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded-full border px-4 py-2 text-sm">Annuler</button>
              <button type="submit" className="rounded-full bg-navy text-white px-4 py-2 text-sm font-medium">Créer le compte</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
