'use client';

import { useQuery } from '@tanstack/react-query';
import { getStats } from '@/lib/api';

function formatPrice(n: number) {
  return n.toLocaleString('fr-FR') + ' FCFA';
}

export default function AdminStatsPage() {
  const { data: stats, isLoading } = useQuery({ queryKey: ['stats'], queryFn: getStats });

  if (isLoading || !stats) return <p className="text-navy/60">Chargement…</p>;

  return (
    <section>
      <h1 className="font-display text-2xl font-semibold text-navy mb-6">Statistiques</h1>
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white rounded-xl p-6 text-center shadow-sm">
          <p className="text-2xl font-bold text-navy">{formatPrice(stats.revenue)}</p>
          <p className="text-sm text-navy/60">Revenu total</p>
        </div>
        <div className="bg-white rounded-xl p-6 text-center shadow-sm">
          <p className="text-2xl font-bold text-navy">{stats.orderCount}</p>
          <p className="text-sm text-navy/60">Commandes reçues</p>
        </div>
        <div className="bg-white rounded-xl p-6 text-center shadow-sm">
          <p className="text-2xl font-bold text-navy">{formatPrice(stats.avgBasket)}</p>
          <p className="text-sm text-navy/60">Panier moyen</p>
        </div>
      </div>
      <h2 className="font-display text-lg font-semibold text-navy mb-3">Plats les plus commandés</h2>
      <div className="grid gap-2">
        {stats.topDishes.length === 0 ? (
          <p className="text-navy/60">Pas encore de données.</p>
        ) : (
          stats.topDishes.map((d) => (
            <div key={d.name} className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm">
              <span className="font-medium">{d.name}</span>
              <span className="text-sm bg-cream px-3 py-1 rounded-full font-semibold text-navy">{d.quantity} vendus</span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
