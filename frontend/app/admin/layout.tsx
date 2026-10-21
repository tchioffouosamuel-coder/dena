'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';

const TABS = [
  { href: '/admin/dishes', label: '🍽️ Menu' },
  { href: '/admin/orders', label: '🧾 Commandes' },
  { href: '/admin/stats', label: '📊 Statistiques' },
  { href: '/admin/staff', label: '👥 Équipe', adminOnly: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!loading && !user && !isLoginPage) router.push('/admin/login');
  }, [loading, user, isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;
  if (loading || !user) return <div className="min-h-screen flex items-center justify-center text-navy/50">Chargement…</div>;

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-blue text-white flex items-center justify-center font-display font-semibold text-xs">DENA</div>
            <strong className="text-navy">Espace équipe</strong>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-navy/60">{user.email} ({user.role === 'ADMIN' ? 'administrateur' : 'employé'})</span>
            <button onClick={logout} className="rounded-full border px-4 py-1.5">Déconnexion</button>
          </div>
        </div>
        <nav className="max-w-6xl mx-auto px-6 flex gap-2 pb-3" aria-label="Navigation admin">
          {TABS.filter((t) => !t.adminOnly || user.role === 'ADMIN').map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={`rounded-full px-4 py-2 text-sm font-medium border-2 ${
                pathname === t.href ? 'bg-brand-blue text-white border-brand-blue' : 'text-navy border-brand-blue/30'
              }`}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
