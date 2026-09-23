# DENA — Plateforme complète (Next.js + NestJS)

Application de restaurant prête pour la production : site client (menu, panier, commande)
+ espace admin (menu, commandes, statistiques, équipe), pensée pour supporter la montée en charge.

## Architecture

```
dena-platform/
├── backend/     NestJS + Prisma + PostgreSQL — API REST sécurisée
├── frontend/    Next.js 14 (App Router) + TypeScript + Tailwind + React Query
└── docker-compose.yml
```

**Pourquoi cette architecture tient la charge :**
- Base de données relationnelle (PostgreSQL) avec index sur les champs interrogés souvent (statut de commande, date) — les requêtes restent rapides même avec des dizaines de milliers de commandes.
- Backend sans état ("stateless") : chaque requête porte son propre jeton d'authentification (JWT), donc on peut lancer plusieurs instances du backend derrière un répartiteur de charge sans configuration supplémentaire.
- Le prix de chaque commande est toujours recalculé côté serveur à partir de la base — impossible pour un client de falsifier un total.
- Séparation nette frontend/backend : le site (Next.js) peut être hébergé sur un CDN mondial (Vercel, Cloudflare Pages) pendant que l'API scale indépendamment.
- Limitation de débit (rate limiting) intégrée contre les abus et attaques par force brute.
- Photos automatiquement compressées et converties en WebP à l'upload — réduit la bande passante consommée, important pour les connexions mobiles.

## Démarrage en local (avec Docker)

Prérequis : Docker Desktop installé.

```bash
cd dena-platform
docker compose up --build
```

Puis, dans un autre terminal, initialisez la base (une seule fois) :
```bash
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npm run prisma:seed
```

- Site client : http://localhost:3000
- Espace admin : http://localhost:3000/admin/login
- API (documentation Swagger) : http://localhost:4000/api/docs

Le compte admin créé par défaut est indiqué dans la sortie de la commande `prisma:seed`
(email `admin@dena.cm`, mot de passe `ChangeMoi123!` par défaut — **à changer immédiatement**
via les variables `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`, ou en créant un nouvel
administrateur puis en supprimant celui-ci depuis l'espace Équipe).

## Démarrage en local (sans Docker)

**Backend :**
```bash
cd backend
cp .env.example .env      # puis éditez DATABASE_URL pour pointer vers votre PostgreSQL
npm install
npx prisma migrate dev
npm run prisma:seed
npm run start:dev
```

**Frontend :**
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

## Déploiement en production

Recommandation simple et robuste pour démarrer (gratuit ou très peu coûteux, scalable ensuite) :

| Composant | Où l'héberger | Pourquoi |
|---|---|---|
| Frontend (Next.js) | Vercel | CDN mondial, déploiement automatique à chaque `git push`, gratuit pour démarrer |
| Backend (NestJS) | Railway ou Render | Déploiement Docker en un clic, montée en charge simple, base PostgreSQL incluse |
| Base de données | PostgreSQL managé (Railway/Render/Supabase) | Sauvegardes automatiques, pas de maintenance serveur |
| Photos | Cloudflare R2 (compatible S3) | Stockage illimité peu coûteux, à brancher dans `media.service.ts` |
| Sécurité / CDN | Cloudflare devant le frontend et l'API | Protection DDoS, cache, HTTPS gratuit |

Étapes générales :
1. Créez un dépôt Git (GitHub/GitLab) avec ce dossier `dena-platform`.
2. Sur Railway ou Render : nouveau service → pointez vers `/backend` → ajoutez une base
   PostgreSQL → renseignez les variables d'environnement (voir `backend/.env.example`) →
   déployez. Notez l'URL publique de l'API (ex: `https://dena-api.up.railway.app`).
3. Sur Vercel : nouveau projet → pointez vers `/frontend` → variable d'environnement
   `NEXT_PUBLIC_API_URL=https://dena-api.up.railway.app/api` → déployez.
4. Mettez à jour `CORS_ORIGIN` côté backend avec l'URL Vercel du frontend.
5. (Optionnel mais recommandé) Ajoutez votre domaine (ex: dena.cm) sur Vercel, et passez
   le trafic par Cloudflare pour la sécurité et la mise en cache.

## Faire évoluer le projet sans rien casser

- Chaque fonctionnalité est un **module** indépendant côté backend (`dishes`, `orders`,
  `media`, `stats`, `users`) — ajouter une fonctionnalité, c'est ajouter un nouveau module,
  sans toucher aux autres.
- Toutes les entrées sont validées automatiquement (DTO + `class-validator`) avant d'atteindre
  la logique métier — une donnée invalide est rejetée proprement avec un message clair.
- Le schéma de base de données (`backend/prisma/schema.prisma`) est la source de vérité :
  toute évolution passe par une migration (`npx prisma migrate dev`), ce qui garde un historique
  traçable et réversible des changements de structure.
- Le frontend et le backend communiquent uniquement via l'API REST documentée (Swagger) —
  aucun couplage caché, on peut remplacer l'un ou l'autre indépendamment.

## Accessibilité

- Navigation clavier complète, focus visible partout (`:focus-visible`).
- Attributs ARIA sur les éléments interactifs (panier, formulaires, statuts).
- Contraste de couleurs conforme AA sur les textes principaux.
- `prefers-reduced-motion` respecté.
- Structure sémantique (landmarks `header`/`main`/`footer`, hiérarchie de titres cohérente).

## Prochaines étapes possibles

- Notifications push réelles (même app fermée) via Firebase Cloud Messaging ou OneSignal.
- Paiement en ligne (Mobile Money : Orange Money / MTN MoMo via leur API, ou Stripe).
- Tests automatisés (Jest côté backend, Playwright côté frontend) avant chaque mise en ligne.
- Journal d'audit (qui a modifié quoi et quand) pour l'espace admin.
