# Hanging Around — CLAUDE.md

## Projet

**Hanging Around** est une application mobile-first (PWA → Android/iOS) de rencontres sociales en groupe autour de thématiques communes. Les utilisateurs rejoignent des communautés thématiques, sont assignés automatiquement à des groupes de 6, et se retrouvent dans des restaurants partenaires. Les groupes tournent à chaque cycle pour maximiser les nouvelles rencontres.

- **Firebase project**: `hangingaround` *(à configurer)*
- **GitHub**: `https://github.com/momognawia/hangingaround`
- **Firebase Hosting**: *(à configurer après init)*
- **Firebase Console**: `https://console.firebase.google.com/project/hangingaround`
- **Spec complète**: `general_specifications.txt`

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | Angular 19 |
| UI | Angular Material 19, Bootstrap 5 |
| Backend | Firebase (Firestore, Auth, Storage, Cloud Functions) |
| SDK Firebase | @angular/fire 19 |
| Style | SCSS |
| PWA | @angular/service-worker |
| Push notifications | Firebase Cloud Messaging (FCM) |
| Paiements | Stripe |
| Tests | Karma + Jasmine |
| Native (futur) | Capacitor (Android + iOS) |

---

## Architecture

### Modules lazy-loaded (routes principales)

```
/home           → HomeFeedModule         (feed thématiques)
/themes         → ThemesModule           (découverte + détail)
/events         → EventsModule           (événements + check-in)
/chat           → ChatModule             (chat groupe + 1-to-1)
/profile        → ProfileModule          (profil utilisateur)
/settings       → SettingsModule         (fréquence, préfs)
/notifications  → NotificationsModule    (centre notifs)
/admin          → AdminModule            (back-office opérationnel)
```

### Modules chargés eagerly

```
/login          → LoginComponent
/register       → RegisterComponent
/onboarding     → OnboardingComponent   (complétion profil post-signup)
```

### Structure des dossiers clés

```
src/
├── app/
│   ├── _models/            # Interfaces TypeScript (User, Theme, Group, Event, etc.)
│   ├── _services/          # Services Firebase globaux
│   │   ├── auth.service.ts
│   │   ├── theme.service.ts
│   │   ├── group.service.ts
│   │   ├── event.service.ts
│   │   ├── chat.service.ts
│   │   ├── restaurant.service.ts
│   │   ├── notification.service.ts
│   │   ├── rating.service.ts
│   │   └── user.service.ts
│   ├── _guards/            # Route guards (auth, subscription)
│   ├── common/             # Composants réutilisables
│   ├── modules/            # Feature modules (lazy-loaded)
│   └── admin/              # Admin panel module
├── environments/           # Firebase config dev/prod
└── assets/
    ├── i18n/               # Traductions (fr, en)
    └── styles/             # SCSS globaux
```

---

## Collections Firestore

### `users`
```
- id (uid Firebase)
- email
- phone
- first_name
- birth_date
- gender
- orientation
- bio
- city
- profile_photo_url
- photos[]
- interests[]
- preferred_frequency   // weekly | biweekly | monthly
- subscription_status   // active | inactive | trial
- stripe_customer_id
- reputation_score
- verification_status
- created_at
```

### `themes`
```
- id
- creator_user_id
- title
- description
- category           // Food | Culture | Music | Tech | Outdoor | Sports | Lifestyle | Networking
- city
- age_min / age_max
- max_members
- target_group_size  // toujours 6 pour MVP
- frequency
- restaurant_budget_level
- status             // active | paused | closed
- members_count
- created_at
```

### `theme_members`
```
- theme_id
- user_id
- joined_at
- status             // active | paused | left
```

### `groups`
```
- id
- theme_id
- rotation_number
- restaurant_id
- event_date
- status             // pending | confirmed | completed | cancelled
- created_at
```

### `group_members`
```
- group_id
- user_id
- attendance_status  // pending | confirmed | checked_in | no_show
```

### `restaurants`
```
- id
- name
- address
- city
- latitude / longitude
- cuisine_type
- price_level        // 1-4
- capacity
- partner_status
- contact_name / phone / email
- created_at
```

### `bookings`
```
- id
- group_id
- restaurant_id
- booking_date
- booking_time
- guest_count
- booking_status     // pending | confirmed | cancelled
- confirmation_reference
- created_at
```

### `chat_rooms`
```
- id
- type               // group | direct
- group_id           // si type = group
- members[]          // [user_id, user_id] si type = direct
- created_at
```

### `messages`
```
- id
- room_id
- sender_user_id
- message_type       // text | image | audio | system
- content
- media_url
- created_at
```

### `notifications`
```
- id
- user_id
- type
- title / body
- read_at
- created_at
```

### `ratings`
```
- id
- from_user_id
- to_user_id
- group_id
- rating_type        // respectful | friendly | fun | punctual | good_vibes
- created_at
```

### `reports`
```
- id
- reporter_user_id
- reported_user_id
- reason
- description
- status             // pending | resolved | dismissed
- created_at
```

---

## Cloud Functions

| Fonction | Trigger | Description |
|----------|---------|-------------|
| `generateGroups` | Scheduled (cron) | Algorithme rotation : forme groupes de 6, assigne restaurants |
| `onGroupCreated` | Firestore trigger | Envoie notif push au groupe |
| `onMessageSent` | Firestore trigger | Notif push nouveau message |
| `onEventReminder` | Scheduled | Rappels J-1 avant dîner |
| `stripeWebhook` | HTTP | Synchronise statut abonnement |

---

## Algorithme de rotation (core)

Voir spec complète dans `general_specifications.txt` section "ALGORITHME DE ROTATION".

**Résumé MVP** :
1. Filtrer users actifs (subscription + fréquence + non pénalisé)
2. Grouper par thème prioritaire
3. Cluster géographique
4. Former groupes de 6 — score = diversité + nouveauté + fiabilité - répétitions
5. Assigner restaurant (capacité ≥ 6, budget, dispo)
6. Exclure derniers participants pour rotation suivante

---

## Modèle économique

- **B2C** : 19 USD/mois — accès complet (groupes, chat, réductions restaurants 6%)
- **B2B** : 299–1999 USD/mois selon taille entreprise (cohésion d'équipe)
- **Paiements** : Stripe Billing — seul `stripe_customer_id` + `subscription_status` stockés en DB

---

## Commandes courantes

```bash
# Développement local
npm start                          # ng serve (port 4200)
npm run build                      # build production

# Firebase
firebase emulators:start           # émulateurs locaux
firebase deploy                    # déploiement complet
firebase deploy --only hosting     # hosting seulement
firebase deploy --only functions   # fonctions seulement

# Génération Angular
ng generate component modules/xxx/components/yyy
ng generate service app/_services/yyy
```

---

## Variables d'environnement

Les clés Firebase sont dans `src/environments/environment.ts` (dev) et `environment.prod.ts` (prod).

**Ne jamais committer** de clés Stripe secrètes — uniquement la clé publique côté front.

---

## Règles de développement

- Lazy-loading obligatoire pour tous les modules features
- Firestore Security Rules (RLS) à écrire en parallèle du code
- Le chat groupe est **bloqué** jusqu'au check-in GPS
- Le chat 1-to-1 est **bloqué** jusqu'à participation à un dîner commun
- Toute logique métier sensible (génération groupes, abonnements) → Cloud Functions, jamais côté client
