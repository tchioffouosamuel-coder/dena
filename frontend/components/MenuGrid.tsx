'use client';

import { useQuery } from '@tanstack/react-query';
import { getDishes } from '@/lib/api';
import { useCart } from '@/lib/cart-context';

function formatPrice(n: number) {
  return n.toLocaleString('fr-FR') + ' FCFA';
}

export function MenuGrid() {
  const { data: dishes, isLoading, isError } = useQuery({ queryKey: ['dishes'], queryFn: getDishes });
  const cart = useCart();

  if (isLoading) {
    return <p className="text-center py-10 text-navy/60">Chargement du menu…</p>;
  }
  if (isError || !dishes) {
    return <p className="text-center py-10 text-red-700">Impossible de charger le menu pour le moment. Réessayez dans un instant.</p>;
  }
  if (dishes.length === 0) {
    return <p className="text-center py-10 text-navy/60">Le menu sera bientôt disponible.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {dishes.map((dish) => (
        <article key={dish.id} className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="bg-navy text-cream text-xs font-semibold tracking-wide px-4 py-2">{dish.day}</div>
          <div className="text-5xl text-center py-4">{dish.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={dish.imageUrl} alt={dish.name} className="w-full h-40 object-cover" />
          ) : '🍽️'}</div>
          <div className="p-5 flex flex-col flex-1">
            <h3 className="font-display text-lg font-semibold mb-1">{dish.name}</h3>
            <p className="text-sm text-navy/70 flex-1">{dish.description}</p>
            <div className="flex items-center justify-between mt-4">
              <span className="font-semibold text-orange">{formatPrice(dish.price)}</span>
              <button
                onClick={() => cart.add(dish)}
                className="rounded-full bg-navy text-white text-sm font-medium px-4 py-2 hover:bg-navy/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange"
                aria-label={`Ajouter ${dish.name} au panier`}
              >
                + Ajouter
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
