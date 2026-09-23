'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, updateOrderStatus, Order } from '@/lib/api';

function formatPrice(n: number) {
  return n.toLocaleString('fr-FR') + ' FCFA';
}

const STATUSES: Order['status'][] = ['NOUVELLE', 'EN_PREPARATION', 'LIVREE', 'ANNULEE'];
const STATUS_LABELS: Record<Order['status'], string> = {
  NOUVELLE: 'nouvelle',
  EN_PREPARATION: 'en préparation',
  LIVREE: 'livrée',
  ANNULEE: 'annulée',
};

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const { data: orders, isLoading } = useQuery({ queryKey: ['orders'], queryFn: getOrders, refetchInterval: 15000 });

  const statusMut = useMutation({
    mutationFn: (vars: { id: string; status: Order['status'] }) => updateOrderStatus(vars.id, vars.status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  });

  return (
    <section>
      <h1 className="font-display text-2xl font-semibold text-navy mb-6">Commandes reçues</h1>
      {isLoading ? (
        <p className="text-navy/60">Chargement…</p>
      ) : !orders || orders.length === 0 ? (
        <p className="text-navy/60">Aucune commande passée depuis l&apos;app pour le moment.</p>
      ) : (
        <div className="grid gap-3">
          {orders.map((o) => (
            <div key={o.id} className="bg-white rounded-xl p-4 flex items-center justify-between gap-4 shadow-sm flex-wrap">
              <div>
                <span className="text-xs text-navy/50">{new Date(o.createdAt).toLocaleString('fr-FR')}</span>
                <h3 className="font-semibold">{o.customerName} — {formatPrice(o.total)}</h3>
                <p className="text-sm text-navy/60">{o.items.map((i) => `${i.name} x${i.quantity}`).join(', ')}</p>
                <p className="text-sm text-navy/60">📞 {o.customerPhone}</p>
              </div>
              <select
                value={o.status}
                onChange={(e) => statusMut.mutate({ id: o.id, status: e.target.value as Order['status'] })}
                className="border rounded-lg px-3 py-2 text-sm"
                aria-label={`Statut de la commande de ${o.customerName}`}
              >
                {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
