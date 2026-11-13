# Alerte discrète — mimi & Les petits riens (HACK4HER 2026 · Défi 5)

> Prototype **simulé** : données 100 % fictives, aucun service d'urgence réel n'est contacté.

**Discret au quotidien. Clair pour agir.** Deux portes d'entrée anodines, deux formes de violence, une même chaîne de soutien.

| Porte d'entrée | Forme de violence | Déclencheur |
|---|---|---|
| **mimi** (`index.html`), chat « Ton petit coin de douceur » | Cyberharcèlement, surveillance d'écran | Écrire sa **phrase secrète** dans la conversation |
| **Les petits riens** (`carnet.html`), carnet papier sans texte | Agression physique, danger immédiat | **Toucher deux fois le nuage** |
| **Cellule** (`dashboard.html`) | Réception, qualification, orientation | Protocole adapté au type d'alerte, contrôle humain |

## Fichiers

| Fichier | Rôle |
|---|---|
| `demo.html` | **Page de présentation** : direction & parcours, plus la **démo en direct** (les 3 écrans côte à côte) |
| `index.html` | App mimi (mobile) |
| `carnet.html` | App Les petits riens (mobile) |
| `dashboard.html` | Tableau de bord de la cellule (Alertes, Dossiers, Équipe, Journal d'accès, Protocoles) |
| `tests.html` | 54 tests automatiques |
| `shared.js` | Cœur : détection, double appui, alertes, file hors ligne, NPI fictif, canal sûr |
| `bot.js` | Réponses de mimi (règles, **sans IA**) |
| `manifest.json`, `carnet.webmanifest`, icônes, `sw.js` | Installation des 2 apps sur l'écran d'accueil + hors ligne |
| `FICHE_RISQUES.md` | Fiche technique et de risques (livrable) |

## Lancer

1. Dans VS Code, installer **Live Server**, puis clic droit sur `demo.html` → **Open with Live Server**.
2. Onglet **« Démo en direct »** : mimi, le carnet et la cellule s'affichent côte à côte.
3. Sinon, ouvrir les pages séparément **dans le même navigateur** : `index.html` et `carnet.html` en vue mobile (F12 puis Ctrl+Shift+M), `dashboard.html` en grand.

## Installer sur un vrai téléphone

`installer.html` est une page **neutre** (« Mes petites apps ») :
- **sur ordinateur**, elle affiche un **QR code** à scanner ;
- **sur téléphone**, elle propose les deux apps et les étapes illustrées pour **Android** (Chrome, menu ⋮ → « Ajouter à l'écran d'accueil ») et **iPhone** (Safari, Partager → « Sur l'écran d'accueil »).

Les apps s'installent **sans store et sans compte** (PWA), avec une icône et un nom neutres, et fonctionnent hors ligne.

> Dans une version réelle, la cellule remet le QR code **lors d'un moment sûr** (entretien, séance de sensibilisation) et accompagne la configuration. Pas de fiche sur un store, que l'agresseur pourrait consulter.

### Mise en ligne (GitHub Pages)

1. Sur github.com, créer un dépôt **vide** au nom neutre (par ex. `petits-riens`), **public**.
2. Relier et envoyer le code :
   ```
   git remote add origin https://github.com/<compte>/petits-riens.git
   git push -u origin master
   ```
3. Sur GitHub : **Settings → Pages → Branch : `master` / `(root)` → Save**.
4. Après 1 à 2 minutes, le site est en ligne : `https://<compte>.github.io/petits-riens/installer.html`.

⚠ Le code devient public. Les données sont 100 % fictives, donc c'est conforme au règlement.

**Démo sur téléphone + ordinateur :** le « serveur » étant simulé par le navigateur, une alerte envoyée depuis le téléphone **n'arrive pas** sur le tableau de bord de l'ordinateur. Sur le téléphone, montrez l'installation, l'icône neutre et le geste. Faites le parcours complet avec la cellule sur l'ordinateur (`demo.html` → « Démo en direct »).

## Gestes

| App | Geste | Effet |
|---|---|---|
| mimi | Phrase secrète dans un message | Alerte (priorité haute). mimi répond **« Super ! Fais attention à toi 🌸 »** |
| mimi | « oublie » dans les 30 s | Annulation |
| mimi | Appui long sur un de ses messages | Mise au coffre, invisible |
| mimi | Appui long 3 s sur le titre « mimi » | Réglages secrets, scénario de démo, tout effacer |
| carnet | Deux appuis rapides sur le **nuage** ☁️ | Alerte **urgente**. Le 3ᵉ trou de la reliure fonce légèrement |
| carnet | Deux appuis rapides sur le **cœur** ❤️ dans les 30 s | Annulation |
| carnet | Appui long 3 s sur la reliure (les points en haut) | Réglages : vitesse du double appui, ré-entraînement, tout effacer |

La configuration (NPI fictif, canal sûr, consentement) se fait **une seule fois** et sert aux deux apps.

**Conversation éphémère :** la discussion avec mimi n'est jamais enregistrée et **s'efface dès que l'étudiante quitte l'app**. À son retour, la conversation est neuve. L'agresseur qui ouvre mimi ne voit ni la phrase secrète ni les messages collés. Le coffre, lui, est conservé : il faut donc faire l'appui long juste après avoir collé un message.

## Script de démo (3 minutes)

1. **(20 s) Le problème.** « Deux situations : Aïcha (fictive) dont l'ex surveille le téléphone, et une agression physique où elle n'a que quelques secondes. »
2. **(40 s) mimi.** Écrire « Bonjour » : mimi répond comme une appli banale. Appui long sur le titre → « Charger un scénario fictif ». Appui long sur un message de menace : rien ne bouge. Écrire « Je vais promener le chat ».
3. **(20 s) Cellule.** L'alerte **SIM-001 · Mot de code · Haute** arrive. Ouvrir « Voir les preuves » : le coffre est là, la consultation est journalisée.
4. **(30 s) Carnet.** « Aucun texte à l'écran. » Toucher deux fois le nuage. Sur la cellule, **SIM-002 · Geste discret · URGENT** passe en tête, avec un son différent. Montrer la liste « Avant de contacter » propre à ce cas : **ne pas appeler**.
5. **(40 s) Contrôle humain.** Prendre en charge, cocher la liste, « Escalade (simulée) », révéler le NPI avec un motif, puis montrer le **Journal d'accès** et la page **Protocoles**.
6. **(20 s) Bonus.** Couper le réseau (DevTools → Network → Offline), toucher deux fois le nuage : rien n'arrive. Rétablir le réseau : l'alerte arrive. Puis ouvrir `tests.html` : 54 tests ✅.
7. **(10 s) Limite assumée.** « La discrétion n'est pas une garantie d'invisibilité. »

Avant le passage devant le jury : **« Réinitialiser la démo »** (dans la cellule ou sur demo.html).

## Choix techniques

- **HTML/CSS/JS vanilla, PWA** : aucune installation, léger, hors ligne, installable avec une icône neutre.
- **Pas d'IA dans mimi** : aucun message ne quitte le téléphone, déclenchement fiable.
- **Sécurité par défaut** : ni son, ni vibration, ni notification côté étudiante. Noms et icônes neutres.
- **Minimisation** : pseudonyme, NPI fictif masqué, aucune géolocalisation, aucune preuve collectée par le carnet.
- **Contrôle humain** : le système ne décide rien. Chaque action de l'agente est journalisée.
