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

Copier l'**ID du document** depuis l'URL :
```
https://docs.getgrist.com/[ID-ICI]/suivi-bebe/...
```

### Étape 3 — Obtenir une clé API

Menu profil (en bas à gauche) → **Gestion des API** → **Nouvelle clé** → copier la clé.

### Étape 4 — Configurer l'app

Au premier lancement, appuyer sur **"Première utilisation / Reconfigurer"** et renseigner :

| Champ | Description |
|-------|-------------|
| Prénom du bébé | Affiché dans l'app et le dashboard |
| Date de naissance | Pour le calcul de l'âge |
| Code PIN | 4 chiffres — partagé entre les deux parents |
| Clé API Grist | Obtenue à l'étape 3 |
| ID du document | Obtenu à l'étape 2 |

→ L'app crée automatiquement les tables `Events` et `Reports` dans Grist. ✅

> ⚠️ **Chaque parent configure l'app sur son téléphone** avec les mêmes identifiants Grist et le même PIN.

---

## 🗂️ Structure du projet

```
suivi-bebe/
├── index.html        ← App complète (HTML + CSS + JS)
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

## 🛠️ Utilisation en local (iPhone)

```bash
# Lancer un serveur local
python3 -m http.server 8080

# Ou avec Node
npx serve .
```

Puis ouvrir `http://[IP-locale]:8080` dans Safari.

---

## 📄 Licence

MIT — voir [LICENSE](LICENSE)
