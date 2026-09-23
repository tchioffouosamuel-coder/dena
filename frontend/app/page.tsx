'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MenuGrid } from '@/components/MenuGrid';
import { CartDrawer } from '@/components/CartDrawer';
import { useCart } from '@/lib/cart-context';

const WHATSAPP_NUMBER = '237655063419';

export default function HomePage() {
  const [cartOpen, setCartOpen] = useState(false);
  const cart = useCart();

  return (
    <>
      <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white px-4 py-2 rounded shadow z-50">
        Aller au contenu
      </a>

      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-navy text-cream flex items-center justify-center font-display font-semibold text-sm">DENA</div>
            <div className="leading-tight">
              <p className="font-semibold text-navy">Délices des Nations</p>
              <p className="text-xs text-navy/60">Service Traiteur</p>
            </div>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-navy/80" aria-label="Navigation principale">
            <a href="#menu" className="hover:text-orange">Menu</a>
            <a href="#traiteur" className="hover:text-orange">Traiteur</a>
            <a href="#contact" className="hover:text-orange">Contact</a>
          </nav>
          <button
            onClick={() => setCartOpen(true)}
            className="relative border-2 border-navy rounded-full px-3 py-2"
            aria-label={`Ouvrir le panier, ${cart.count} article${cart.count > 1 ? 's' : ''}`}
          >
            🛒
            {cart.count > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cart.count}
              </span>
            )}
          </button>
        </div>
      </header>

      <main id="contenu">
        <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-orange font-semibold text-sm mb-2">DENA · BERTOUA</p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-navy leading-tight">
              Le goût de l&apos;excellence, à chaque occasion.
            </h1>
            <p className="mt-4 text-navy/70 max-w-md">
              Restaurant &amp; service traiteur à Bertoua. Des plats savoureux, une cuisine soignée
              et un service pensé pour vos moments importants.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="#menu" className="rounded-full bg-navy text-white px-6 py-3 font-medium">Voir le menu</a>
              <a href="#traiteur" className="rounded-full border-2 border-navy text-navy px-6 py-3 font-medium">Service traiteur</a>
            </div>
          </div>
          <div className="bg-navy text-cream rounded-3xl p-10 text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="font-display text-xl font-semibold">Votre satisfaction</h2>
            <p className="text-cream/70">Notre priorité.</p>
          </div>
        </section>

        <section id="menu" className="max-w-6xl mx-auto px-6 py-16">
          <div className="mb-10 max-w-xl">
            <p className="text-orange font-semibold text-sm mb-1">MENU DE LA SEMAINE</p>
            <h2 className="font-display text-3xl font-semibold text-navy">Chaque jour, un plaisir.</h2>
            <p className="text-navy/70 mt-2">Ajoutez un plat au panier et commandez en un clic.</p>
          </div>
          <MenuGrid />
        </section>

        <section id="traiteur" className="bg-navy text-cream py-16">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-orange font-semibold text-sm mb-1">SERVICE TRAITEUR</p>
            <h2 className="font-display text-3xl font-semibold mb-4">Nous sublimons vos événements.</h2>
            <p className="text-cream/70 max-w-xl mb-8">
              Mariages, anniversaires, dot, deuil, événements d&apos;entreprise, réunions et autres occasions.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Bonjour DENA, je souhaite un devis traiteur.")}`}
              target="_blank"
              className="inline-block rounded-full bg-orange text-white px-6 py-3 font-medium"
            >
              Demander un devis
            </a>
          </div>
        </section>

        <section id="contact" className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-orange font-semibold text-sm mb-1">CONTACT</p>
          <h2 className="font-display text-3xl font-semibold text-navy mb-6">Commandez ou réservez.</h2>
          <div className="text-navy/80 space-y-1">
            <p>📍 Ndoumbie / Bibliothèque, Bertoua</p>
            <p>📞 +237 655 06 34 19</p>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 text-center text-sm text-navy/60">
        <p>DENA — Délices des Nations · La satisfaction, notre priorité.</p>
        <Link href="/admin/login" className="underline">Espace équipe</Link>
      </footer>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
