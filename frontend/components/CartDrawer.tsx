'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { createOrder } from '@/lib/api';

const WHATSAPP_NUMBER = '237655063419';
function formatPrice(n: number) {
  return n.toLocaleString('fr-FR') + ' FCFA';
}

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const cart = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (cart.lines.length === 0) return;
    setSubmitting(true);
    setError(null);
    try {
      await createOrder({
        customerName: name,
        customerPhone: phone,
        items: cart.lines.map((l) => ({ dishId: l.dishId, quantity: l.quantity })),
      });
      const details = cart.lines.map((l) => `- ${l.name} x${l.quantity} (${formatPrice(l.price * l.quantity)})`).join('\n');
      const text = `Bonjour DENA, je suis ${name}.\nTéléphone: ${phone}\n\nMa commande:\n${details}\n\nTotal: ${formatPrice(cart.total)}`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
      cart.clear();
      onClose();
    } catch (err) {
      setError("La commande n'a pas pu être envoyée. Vérifiez votre connexion et réessayez.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity z-20 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-label="Votre panier"
        aria-hidden={!open}
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-30 shadow-2xl transition-transform flex flex-col ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-display text-lg font-semibold text-navy">Votre commande</h2>
          <button onClick={onClose} aria-label="Fermer le panier" className="text-2xl leading-none">&times;</button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.lines.length === 0 ? (
            <p className="text-navy/60">Votre panier est vide. Ajoutez un plat depuis le menu.</p>
          ) : (
            <ul className="space-y-4">
              {cart.lines.map((l) => (
                <li key={l.dishId} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">{l.name}</p>
                    <p className="text-sm text-navy/60">{formatPrice(l.price)} × {l.quantity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button aria-label={`Retirer un ${l.name}`} onClick={() => cart.changeQty(l.dishId, -1)} className="w-7 h-7 rounded-full border">−</button>
                    <span aria-live="polite">{l.quantity}</span>
                    <button aria-label={`Ajouter un ${l.name}`} onClick={() => cart.changeQty(l.dishId, 1)} className="w-7 h-7 rounded-full border">+</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form onSubmit={handleSubmit} className="border-t px-6 py-4 space-y-3">
          <div className="flex justify-between font-semibold text-navy">
            <span>Total</span>
            <span>{formatPrice(cart.total)}</span>
          </div>
          <label className="block text-sm" htmlFor="cart-name">Votre nom</label>
          <input id="cart-name" required value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
          <label className="block text-sm" htmlFor="cart-phone">Téléphone</label>
          <input id="cart-phone" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
          {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
          <button
            type="submit"
            disabled={submitting || cart.lines.length === 0}
            className="w-full rounded-full bg-orange text-white font-semibold py-3 disabled:opacity-50"
          >
            {submitting ? 'Envoi en cours…' : 'Commander sur WhatsApp'}
          </button>
        </form>
      </aside>
    </>
  );
}
