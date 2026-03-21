# 🍼 Suivi Bébé

Application web progressive (PWA) de suivi quotidien pour bébé — conçue pour être hébergée sur **GitHub Pages** et synchronisée via **Grist** entre deux parents.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-blue)](https://pages.github.com/)
[![Powered by Grist](https://img.shields.io/badge/Database-Grist-green)](https://www.getgrist.com/)

---

## ✨ Fonctionnalités

| Onglet | Description |
|--------|-------------|
| 📅 **Journée** | Timeline chronologique des événements du jour — navigation par date, ajout / modification / suppression |
| 📋 **Rapport** | Génération automatique du rapport quotidien format WhatsApp (journée + nuit + matin suivant) |
| 📁 **Archives** | Historique de tous les rapports sauvegardés, consultables et copiables |
| 📊 **Bilan** | Dashboard sur 7 jours : lait total, siestes, heure de coucher, réveils nocturnes, légumes explorés |

### Événements enregistrables

- 🌙 **Réveil nocturne** — heure + volume bu (rappel : réveil 1 → 180 ml, réveil 2 → 150 ml, réveil 3 → 90 ml)
- ⏰ **Lever** — heure
- 😴 **Sieste** — début + fin (durée calculée automatiquement) + type (matin / après-midi / micro)
- 🍼 **Biberon** — heure + volume + repas (petit-déj / déjeuner / goûter / dîner)
- 🥣 **Légumes** — ingrédient + type (nouveau : 2–5 c. / connu : 30 g)
- 🛁 **Bain** — heure
- 🌜 **Coucher** — heure + notes
- 📝 **Note libre**

### Autres fonctionnalités

- 🔐 Accès protégé par **code PIN à 4 chiffres**
- 👨‍👩‍👧 **Synchronisation temps réel** entre les deux parents via Grist
- 📱 **PWA installable** sur iPhone (Safari → Partager → Sur l'écran d'accueil)
- 🎂 Affichage de l'**âge du bébé** en mois et semaines

---

## 📸 Captures d'écran

| PIN | Journée | Dashboard |
|-----|---------|-----------|
| ![PIN](screenshots/pin.png) | ![Journée](screenshots/journee.png) | ![Bilan](screenshots/bilan.png) |

> 💡 *Ajouter vos propres captures dans le dossier `screenshots/`*

---

## 🚀 Déploiement sur GitHub Pages

### 1. Créer le repo GitHub

```bash
git init
git add .
git commit -m "Initial commit — Suivi Bébé"
```

Créer un repo sur [github.com](https://github.com/new) (**public**, nom au choix), puis :

```bash
git remote add origin https://github.com/VOTRE-USER/suivi-bebe.git
git push -u origin main
```

### 2. Activer GitHub Pages

Dans le repo GitHub → **Settings** → **Pages** → Source : `main` → `/ (root)` → **Save**

L'app sera disponible à : `https://VOTRE-USER.github.io/suivi-bebe/`

---

## ⚙️ Configuration Grist (base de données)

### Étape 1 — Créer un compte Grist

Aller sur [docs.getgrist.com](https://docs.getgrist.com) → créer un compte gratuit.

### Étape 2 — Créer le document

Créer un nouveau document et lui donner un nom (ex : `suivi-bébé`).

Récupérer l'**ID du document** : cliquer sur l'**avatar en haut à droite** → **Paramètres du document** → copier l'ID (longue chaîne alphanumérique, ex : `2BnxjkiuSm6EscdpfV4sDg`).

> ⚠️ Utiliser l'ID depuis les **paramètres du document** (et non depuis l'URL, qui peut être plus court).

### Étape 3 — Obtenir une clé API

Cliquer sur l'**avatar en haut à droite** → **Paramètres du compte** → section **Clés API** → **Ajouter une clé** → copier la clé.

### Étape 4 — Proxy Cloudflare Worker (requis sur iPhone Safari)

Safari iOS bloque les requêtes cross-origin avec header `Authorization`. Un proxy Cloudflare Worker est nécessaire pour contourner cette restriction.

1. Créer un compte gratuit sur [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Workers & Pages** → **Create** → **Hello World** → **Deploy**
3. **Edit code** → tout sélectionner → remplacer par le contenu de [`worker.js`](worker.js) → **Deploy**
4. Copier l'URL générée (ex : `https://suivi-bebe.moncompte.workers.dev`)

### Étape 5 — Configurer l'app

Au premier lancement, appuyer sur **"Première utilisation / Reconfigurer"** et renseigner :

| Champ | Description |
|-------|-------------|
| Prénom du bébé | Affiché dans l'app et le dashboard |
| Date de naissance | Pour le calcul de l'âge |
| Code PIN | Optionnel — 4 chiffres, laisser vide pour désactiver |
| Clé API Grist | Obtenue à l'étape 3 |
| ID du document | Obtenu à l'étape 2 (depuis les paramètres du document) |
| URL du proxy | URL Cloudflare Worker obtenue à l'étape 4 |

→ L'app crée automatiquement les tables `Events` et `Reports` dans Grist. ✅

> ⚠️ **Chaque parent configure l'app sur son téléphone** avec les mêmes identifiants Grist et la même URL proxy. Le PIN est optionnel et peut être différent pour chaque parent.

> 💡 **Installer comme app native** : Safari → **Partager** → **Sur l'écran d'accueil**

---

## 🗂️ Structure du projet

```
suivi-bebe/
├── index.html        ← App complète (HTML + CSS + JS)
├── worker.js         ← Proxy Cloudflare Worker (CORS Safari iOS)
├── manifest.json     ← Manifest PWA
├── sw.js             ← Service worker (cache offline)
├── icon-192.svg      ← Icône PWA
├── icon-512.svg      ← Icône PWA grande taille
├── LICENSE           ← MIT
└── README.md
```

---

## 🗄️ Schéma Grist

### Table `Events`

| Colonne | Type | Description |
|---------|------|-------------|
| `date` | Text | YYYY-MM-DD |
| `time` | Text | HH:MM |
| `type` | Text | `night_waking`, `wake_up`, `nap`, `bottle`, `veggies`, `bath`, `bedtime`, `note` |
| `quantity_ml` | Numeric | Volume biberon / réveil (ml) |
| `quantity_spoons` | Numeric | Cuillères (légumes nouveau) |
| `quantity_grams` | Numeric | Grammes (légumes connu) |
| `ingredient` | Text | Nom du légume |
| `is_new` | Bool | Vrai = nouvel ingrédient |
| `end_time` | Text | Heure de fin de sieste (HH:MM) |
| `nap_label` | Text | `matin`, `après-midi`, `micro` |
| `meal_type` | Text | `petit-déjeuner`, `déjeuner`, `goûter`, `dîner` |
| `notes` | Text | Notes libres |

### Table `Reports`

| Colonne | Type | Description |
|---------|------|-------------|
| `date` | Text | YYYY-MM-DD |
| `report_text` | Text | Texte complet du rapport |
| `generated_at` | Text | ISO timestamp |

---

## 📋 Format du rapport WhatsApp

```
Bonjour,

*Journée d'hier - mercredi 18 mars*

⏰ Lever : 7h18
🍼 7h50 : 190 ml
🛏 Sieste matin : 9h30 – 10h00 (30 min)
🥣 Déjeuner (11h35)
• 3 c. carottes (nouveau)
🍼 11h45 : 180 ml
🛏 Sieste après-midi : 12h29 – 14h13 (1h44)
🍼 15h20 : 180 ml
🌜 Coucher : 19h30 (endormi dans les bras après le rot)

🌙 *Nuit*
🍼 Réveil 3h56 : 120 ml

🌅 *Matin - jeudi 19 mars*

⏰ Lever : 7h18
🍼 7h50 : 190 ml
```

---

## 📄 Licence

MIT — voir [LICENSE](LICENSE)
