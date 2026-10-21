'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MenuGrid } from '@/components/MenuGrid';
import { CartDrawer } from '@/components/CartDrawer';
import { useCart } from '@/lib/cart-context';
import { FAQS, OCCASIONS, ORDER_STEPS, RESTAURANT, whatsappLink } from '@/lib/site-content';

const NAVIGATION = [
  { href: '#maison', label: 'La maison' },
  { href: '#menu', label: 'Le menu' },
  { href: '#traiteur', label: 'Traiteur' },
  { href: '#questions', label: 'Questions' },
  { href: '#contact', label: 'Contact' },
];

const QUOTE_URL = whatsappLink('Bonjour DENA, je souhaite un devis traiteur. Voici mon événement :\nDate souhaitée :\nLieu :\nNombre de convives :\nBudget indicatif :\nPréférences de menu :');
const CONTACT_URL = whatsappLink('Bonjour DENA, je souhaite avoir des renseignements sur vos repas et votre service traiteur.');

export default function HomePage() {
  const [cartOpen, setCartOpen] = useState(false);
  const cart = useCart();

  return (
    <>
      <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 bg-white px-4 py-2 rounded shadow z-50">
        Aller au contenu
      </a>

      <header className="sticky top-0 z-10 border-b border-navy/10 bg-cream/95 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-5 sm:px-6 py-4">
          <a href="#accueil" className="flex items-center gap-2 sm:gap-3" aria-label="DENA, retour à l’accueil">
            <span className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-full bg-navy text-cream flex items-center justify-center font-display font-semibold text-sm">DENA</span>
            <span className="leading-tight text-sm sm:text-base">
              <span className="block font-semibold text-navy">Délices des Nations</span>
              <span className="block text-[10px] sm:text-xs text-navy/70 mt-1">Restaurant & service traiteur</span>
            </span>
          </a>
          <nav className="hidden lg:flex gap-6 text-sm font-medium" aria-label="Navigation principale">
            {NAVIGATION.map(item => <a key={item.href} href={item.href} className="hover:underline underline-offset-4">{item.label}</a>)}
          </nav>
          <button
            onClick={() => setCartOpen(true)}
            className="flex shrink-0 items-center gap-2 border border-navy/25 rounded-full px-3 sm:px-4 py-2.5 text-sm font-semibold hover:bg-white"
            aria-label={`Ouvrir le panier, ${cart.count} article${cart.count > 1 ? 's' : ''}`}
          >
            Panier <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-navy px-1 text-xs text-white" aria-live="polite">{cart.count}</span>
          </button>
        </div>
        <nav className="lg:hidden flex gap-6 overflow-x-auto whitespace-nowrap border-t border-navy/10 px-5 sm:px-6 py-3 text-sm font-medium" aria-label="Navigation principale mobile">
          {NAVIGATION.map(item => <a key={item.href} href={item.href} className="hover:underline underline-offset-4">{item.label}</a>)}
        </nav>
      </header>

      <main id="contenu">
        <section id="accueil" className="max-w-6xl mx-auto px-5 sm:px-6 py-14 sm:py-20 grid lg:grid-cols-[1.15fr_1fr] gap-12 items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] uppercase mb-5">Bertoua, Cameroun · Délices des Nations</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-navy leading-[1.12]">
              Le goût du partage.<br /><span className="text-[#a95000]">Le plaisir de se retrouver.</span>
            </h1>
            <p className="mt-6 text-navy/75 text-lg leading-relaxed max-w-xl">
              Un repas pour votre journée, une table pour vos retrouvailles, un menu pour vos grandes occasions.
              À Bertoua, DENA réunit restaurant et service traiteur autour du plaisir de partager.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#menu" className="rounded-full bg-navy text-white px-6 py-3.5 text-sm font-semibold hover:bg-navy/90">Découvrir le menu <span aria-hidden="true">↗</span></a>
              <a href={QUOTE_URL} target="_blank" rel="noopener noreferrer" className="rounded-full border border-navy/30 px-6 py-3.5 text-sm font-semibold hover:bg-white">Préparer un événement</a>
            </div>
            <a href={RESTAURANT.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-block text-sm text-navy/70 underline underline-offset-4">Nous retrouver à {RESTAURANT.address}</a>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] bg-navy p-7 sm:p-10 text-cream">
            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border border-cream/10" aria-hidden="true" />
            <div className="pointer-events-none absolute -right-8 -top-12 h-48 w-48 rounded-full border border-cream/10" aria-hidden="true" />
            <div className="relative">
              <p className="text-xs font-semibold tracking-[0.22em] uppercase text-cream/70">Bienvenue chez DENA</p>
              <p className="font-display text-4xl sm:text-5xl leading-tight mt-12 mb-8">Les petits repas.<br />Les grands moments.</p>
              <div className="space-y-5 border-t border-cream/20 pt-6">
                <div className="flex gap-4"><span className="text-orange" aria-hidden="true">01</span><div><h2 className="font-semibold">Votre repas au quotidien</h2><p className="text-sm text-cream/75 mt-1">Le menu de la semaine, à découvrir selon les disponibilités.</p></div></div>
                <div className="flex gap-4"><span className="text-orange" aria-hidden="true">02</span><div><h2 className="font-semibold">Votre événement à imaginer</h2><p className="text-sm text-cream/75 mt-1">Une proposition traiteur à construire avec notre équipe.</p></div></div>
              </div>
              <p className="border-t border-cream/20 pt-5 mt-7 text-sm text-cream/75">La satisfaction, notre priorité.</p>
            </div>
          </div>
        </section>

        <section id="maison" aria-labelledby="maison-title" className="border-y border-navy/10 bg-white/65">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 py-16 grid md:grid-cols-2 gap-8 md:gap-16">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4">La maison DENA</p>
              <h2 id="maison-title" className="font-display text-3xl sm:text-4xl leading-tight">À chaque occasion,<br />une raison de partager.</h2>
            </div>
            <div className="text-navy/75 leading-relaxed space-y-4">
              <p>Délices des Nations vous accueille dans son univers de restaurant et de service traiteur à Bertoua. Notre idée est simple : donner au repas toute sa place, du déjeuner du quotidien aux moments qui rassemblent vos proches.</p>
              <p>Vous cherchez un plat pour aujourd’hui ou préparez une réception ? Découvrez le menu, puis échangez avec nous sur vos envies, vos convives et votre organisation.</p>
              <a href="#contact" className="inline-block font-semibold text-navy underline underline-offset-4">Faisons connaissance <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </section>

        <section id="menu" aria-labelledby="menu-title" className="max-w-6xl mx-auto px-5 sm:px-6 py-16 sm:py-20">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div className="max-w-xl">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4">À votre table</p>
              <h2 id="menu-title" className="font-display text-3xl sm:text-4xl">Cette semaine, on se régale.</h2>
              <p className="text-navy/75 mt-4 leading-relaxed">Parcourez les plats du menu, choisissez vos quantités et composez votre repas. Les prix sont affichés en FCFA.</p>
            </div>
            <a href="#comment-commander" className="text-sm font-semibold underline underline-offset-4 shrink-0">Comment commander ?</a>
          </div>
          <MenuGrid />
          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-navy/15 bg-white/60 p-5 sm:p-6">
            <div><h3 className="font-semibold">Une question sur un plat ou une disponibilité ?</h3><p className="mt-1 text-sm leading-relaxed text-navy/70">L’équipe vous renseigne avant de confirmer votre commande.</p></div>
            <a href={whatsappLink('Bonjour DENA, quels plats sont disponibles aujourd’hui ?')} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-full border border-navy/30 px-5 py-3 text-sm font-semibold hover:bg-cream">Nous écrire sur WhatsApp <span aria-hidden="true">↗</span></a>
          </div>
        </section>

        <section id="comment-commander" aria-labelledby="commande-title" className="bg-white/65 border-y border-navy/10">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 py-16">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4">Du menu à votre repas</p>
            <h2 id="commande-title" className="font-display text-3xl sm:text-4xl">Votre commande en trois étapes.</h2>
            <ol className="grid md:grid-cols-3 gap-8 mt-10">
              {ORDER_STEPS.map(step => (
                <li key={step.number} className="border-t border-navy/20 pt-5">
                  <span className="font-display text-3xl text-[#a95000]" aria-hidden="true">{step.number}</span>
                  <h3 className="font-semibold text-lg mt-4 mb-3">{step.title}</h3>
                  <p className="text-sm text-navy/75 leading-relaxed">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="traiteur" aria-labelledby="traiteur-title" className="bg-navy text-cream">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 py-16 sm:py-20">
            <div className="max-w-2xl">
              <p className="text-orange text-xs font-semibold tracking-[0.2em] uppercase mb-4">Service traiteur</p>
              <h2 id="traiteur-title" className="font-display text-3xl sm:text-5xl leading-tight">Vous réunissez vos invités.<br />Parlons du repas.</h2>
              <p className="text-cream/75 mt-5 leading-relaxed">Une célébration en famille, un rendez-vous professionnel, une cérémonie : chaque occasion a ses attentes. Partagez votre projet avec nous pour préparer une proposition adaptée.</p>
            </div>
            <div className="grid sm:grid-cols-2 mt-10 border-t border-cream/20">
              {OCCASIONS.map(occasion => (
                <article key={occasion.number} className="border-b border-cream/20 py-7 sm:pr-8 sm:even:pl-8 sm:even:pr-0 sm:odd:border-r">
                  <p className="text-orange text-sm mb-3" aria-hidden="true">{occasion.number}</p>
                  <h3 className="font-display text-2xl">{occasion.title}</h3>
                  <p className="text-cream/80 mt-3 leading-relaxed">{occasion.description}</p>
                  <p className="text-sm text-cream/70 mt-3 leading-relaxed">{occasion.detail}</p>
                  <a href={whatsappLink(occasion.message)} target="_blank" rel="noopener noreferrer" className="inline-block mt-5 text-sm font-semibold underline underline-offset-4">Discuter de cet événement <span className="sr-only">: {occasion.title}</span> <span aria-hidden="true">↗</span></a>
                </article>
              ))}
            </div>
            <div className="mt-10 rounded-2xl bg-cream text-navy p-6 sm:p-8 grid md:grid-cols-[1fr_auto] gap-6 items-center">
              <div><h3 className="font-display text-2xl">Votre projet commence par une conversation.</h3><p className="text-sm leading-relaxed mt-3 text-navy/75">Préparez la date, le lieu, le nombre de convives et votre budget indicatif. Notre message WhatsApp vous aide à préciser ces informations.</p></div>
              <a href={QUOTE_URL} target="_blank" rel="noopener noreferrer" className="justify-self-start rounded-full bg-navy text-white px-6 py-3.5 text-sm font-semibold hover:bg-navy/90">Demander un devis <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </section>

        <section id="questions" aria-labelledby="questions-title" className="max-w-6xl mx-auto px-5 sm:px-6 py-16 sm:py-20 grid lg:grid-cols-[0.8fr_1.2fr] gap-8 lg:gap-16">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4">Les informations utiles</p>
            <h2 id="questions-title" className="font-display text-3xl sm:text-4xl">Avant de passer à table.</h2>
            <p className="text-navy/75 leading-relaxed mt-5">Commande, réception, allergies ou organisation : voici quelques réponses pour préparer votre prochain repas avec DENA.</p>
            <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer" className="inline-block mt-6 font-semibold text-sm underline underline-offset-4">Poser une autre question <span aria-hidden="true">↗</span></a>
          </div>
          <div className="border-t border-navy/20">
            {FAQS.map(faq => (
              <details key={faq.question} className="group border-b border-navy/20 py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-base">
                  {faq.question}<span aria-hidden="true" className="relative shrink-0 text-xl leading-6"><span className="group-open:hidden">+</span><span className="hidden group-open:inline">−</span></span>
                </summary>
                <p className="mt-4 pr-6 text-sm leading-relaxed text-navy/75">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="contact" aria-labelledby="contact-title" className="border-t border-navy/10 bg-white/65">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 py-16 grid md:grid-cols-2 gap-10 md:gap-16">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4">Retrouvons-nous à Bertoua</p>
              <h2 id="contact-title" className="font-display text-3xl sm:text-4xl">Un repas en tête ?<br />Un événement à préparer ?</h2>
              <p className="text-navy/75 leading-relaxed mt-5">Contactez l’équipe pour connaître les disponibilités, préciser votre commande ou parler de votre prochaine réception.</p>
              <div className="flex flex-wrap gap-3 mt-7">
                <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer" className="rounded-full bg-navy text-white px-6 py-3 text-sm font-semibold hover:bg-navy/90">Écrire sur WhatsApp</a>
                <a href={RESTAURANT.phoneHref} className="rounded-full border border-navy/30 px-6 py-3 text-sm font-semibold hover:bg-white">Appeler l’équipe</a>
              </div>
            </div>
            <div className="rounded-2xl border border-navy/15 bg-cream p-6 sm:p-8">
              <h3 className="font-display text-2xl">Délices des Nations</h3>
              <address className="not-italic mt-6 space-y-5 text-sm">
                <div><p className="text-xs uppercase tracking-widest text-navy/65 mb-2">Adresse</p><p>{RESTAURANT.address}</p><a href={RESTAURANT.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 underline underline-offset-4">Rechercher le quartier sur Google Maps <span aria-hidden="true">↗</span></a></div>
                <div><p className="text-xs uppercase tracking-widest text-navy/65 mb-2">Téléphone & WhatsApp</p><a href={RESTAURANT.phoneHref} className="text-lg font-semibold underline underline-offset-4">{RESTAURANT.phone}</a></div>
              </address>
              <p className="border-t border-navy/15 mt-6 pt-5 text-sm leading-relaxed text-navy/75">Avant de vous déplacer, contactez-nous pour confirmer les horaires du jour et les plats disponibles.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-navy text-cream">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-10 grid sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] gap-8">
          <div><p className="font-display text-3xl">DENA</p><p className="mt-2 font-semibold">Délices des Nations</p><p className="mt-3 text-sm text-cream/75 leading-relaxed">Restaurant & service traiteur à Bertoua.<br />La satisfaction, notre priorité.</p></div>
          <nav aria-label="Navigation de pied de page"><p className="font-semibold mb-4">À découvrir</p><ul className="space-y-3 text-sm text-cream/80">{NAVIGATION.map(item => <li key={item.href}><a href={item.href} className="hover:underline underline-offset-4">{item.label}</a></li>)}</ul></nav>
          <div><p className="font-semibold mb-4">Restons en contact</p><a href={RESTAURANT.phoneHref} className="text-sm underline underline-offset-4">{RESTAURANT.phone}</a><p className="text-sm text-cream/75 mt-3">{RESTAURANT.address}</p><a href={QUOTE_URL} target="_blank" rel="noopener noreferrer" className="inline-block text-sm font-semibold mt-5 underline underline-offset-4">Votre devis traiteur <span aria-hidden="true">↗</span></a></div>
        </div>
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-5 border-t border-cream/20 flex flex-wrap justify-between gap-3 text-xs text-cream/70"><p>DENA · Délices des Nations · Bertoua, Cameroun</p><Link href="/admin/login" className="underline underline-offset-4">Espace équipe</Link></div>
      </footer>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
