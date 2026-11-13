# Fiche technique et d'analyse des risques — Alerte discrète (mimi & Les petits riens)

**HACK4HER 2026 · Défi 5 « Alerte discrète »** · Équipe : _[nom de l'équipe / établissement]_

> Les champs _[entre crochets]_ sont à compléter avec **vos propres résultats de test**.

## 1. Le besoin

**Phrase de cadrage :** Pour **les étudiantes exposées à une surveillance de leur téléphone ou à une agression physique**, qui ont besoin de **demander de l'aide sans que l'agresseur s'en aperçoive**, notre outil propose **deux portes d'entrée déguisées (un chat de douceur et un carnet sans texte)** afin de **prévenir discrètement une cellule d'écoute, qui qualifie et oriente avec un contrôle humain**.

| | Forme de violence 1 | Forme de violence 2 |
|---|---|---|
| **Situation** | Cyberharcèlement, surveillance d'écran (souvent par un partenaire ou un ex) | Agression physique, danger immédiat |
| **Contrainte** | L'agresseur peut lire l'écran | Quelques secondes, impossible d'écrire |
| **Porte d'entrée** | mimi : phrase secrète dans le chat | Les petits riens : double appui sur le nuage |
| **Priorité** | Haute | Urgente |

- **Utilisatrice finale :** étudiante (le prototype vise un campus).
- **Structure publique utilisatrice :** cellule d'écoute institutionnelle (fictive dans le prototype). À valider avec la structure réelle.

## 2. Fonctions

| Fonction | État |
|---|---|
| mimi : faux chat crédible, phrase secrète (mots entiers, accents et majuscules ignorés), confirmation convenue, annulation 30 s | ✅ |
| mimi : coffre par appui long, invisible, transmis seulement avec une alerte | ✅ |
| Carnet : interface sans texte, double appui sur le nuage, annulation par le cœur, indice discret sur la reliure | ✅ |
| Carnet : entraînement guidé (3 réussites), délai du double appui réglable (rapide / normal / lent) | ✅ |
| Configuration unique : NPI fictif, canal sûr convenu, consentement | ✅ |
| File d'attente hors ligne : envoi au retour du réseau | ✅ |
| Cellule : file de traitement priorisée, alerte en vedette, liste « Avant de contacter » propre à chaque type, escalade **simulée** | ✅ |
| Cellule : identité masquée (révélation avec motif), consultation des preuves journalisée, journal d'accès, protocoles | ✅ |
| Réglages secrets et effacement rapide dans les deux apps | ✅ |

## 3. Tests réalisés

| Critère | Comment | Résultat |
|---|---|---|
| **Fonctionnalité** | `tests.html` : parcours complets mimi et carnet, file hors ligne, numéros uniques. Test de bout en bout dans Chrome (mimi → cellule, carnet → cellule, annulation) | 54/54 tests automatiques ✅ · _[vos essais manuels]_ |
| **Accessibilité** | Les deux apps données à _[n]_ personnes d'autres équipes, sans explication | _[temps moyen, blocages, corrections]_ |
| **Sécurité** | Check-list (section 4). Mots évidents refusés (« sos », « aide »…). Protection XSS. Aucune réponse suspecte de mimi sur 200 essais | ✅ |
| **Biais** | mimi : majuscules, accents, ponctuation, mot dans un autre mot, ordre des mots, lettres du fon. Carnet : vitesses d'appui, rebond d'écran | ✅ · limites en section 5 |
| **Données fictives** | Vrai NPI refusé, seul `FICT-xxxxxx` accepté. Messages inventés. Zone fictive. Bandeau « Données fictives » | ✅ |

## 4. Check-list Safety by Design

| Principe | Mise en œuvre |
|---|---|
| **Confidentialité** | Rien ne part sans alerte. Conversation mimi éphémère : jamais stockée, effacée dès qu'on quitte l'app. Phrase secrète jamais affichée. Pseudonyme, NPI masqué. Ni GPS ni preuve collectée par le carnet |
| **Sécurité par défaut** | Ni son, ni vibration, ni notification côté étudiante. Noms et icônes neutres. Aucun réglage nécessaire |
| **Accessibilité** | mimi pour qui lit et écrit, carnet sans texte pour les autres situations. Grandes cibles, vitesse réglable, entraînement, hors ligne |
| **Recours et contrôle humain** | Toute alerte est traitée par une agente. La cellule ne recontacte que par le canal sûr choisi par l'étudiante. Escalade décidée par un humain. Tout est journalisé |

## 5. Risques et limites

| Risque / limite | Gravité | Mesure prise | À faire en plus |
|---|---|---|---|
| L'agresseur découvre le fonctionnement de l'app (escalade de la violence) | 🔴 | Noms et icônes neutres, réglages cachés, effacement rapide | Code pour les réglages, faux contenu crédible dans le carnet |
| Double appui accidentel sur le nuage (fausse alerte urgente) | 🟠 | Annulation par le cœur, alertes annulées visibles, une seule alerte carnet à la fois | Mesurer le taux de fausses alertes en conditions réelles |
| Impossible de déverrouiller ou d'ouvrir l'app pendant l'agression | 🔴 | Assumé (limite du web) | Version native : raccourci physique (bouton volume ou power) |
| Alerte ratée dans mimi (faute de frappe, correcteur, langage SMS) | 🟠 | Accents et majuscules ignorés | Tolérance aux fautes légères |
| L'écran d'explication est vu par l'agresseur au premier lancement | 🟠 | Une seule fois, « à faire dans un moment sûr » | Installation accompagnée par la cellule |
| Coffre stocké sur le téléphone | 🟠 | Effacement rapide | Chiffrement, envoi puis suppression locale |
| Pas de localisation pour une agression physique | 🟠 | Choix de minimisation (pas de GPS) | Localisation optionnelle, avec consentement explicite, seulement pour le carnet |
| Réception dépendante du réseau | 🟠 | File d'attente, envoi au retour du réseau | Envoi de secours par SMS (version native) |
| Démo limitée à un navigateur | 🟢 | Assumé | Serveur sécurisé (HTTPS, authentification des agentes) |

## 6. Après l'alerte (protocoles, voir l'onglet « Protocoles » de la cellule)

- **Mot de code (mimi) :** prise en charge → **ne jamais appeler par défaut**, utiliser le canal sûr → qualifier → orienter (sécurisation des comptes, preuves, soutien psychologique et juridique, plainte si l'étudiante le souhaite) → clôturer.
- **Geste discret (carnet) :** prise en charge en moins de 2 minutes → **ni appel ni message** → escalade vers les services compétents (**simulée dans le prototype**) → recontact via le canal sûr une fois le danger écarté → orientation.
- **Une alerte n'est pas une plainte.** La plainte reste une décision de l'étudiante.

## 7. Conditions avant tout usage réel

1. **Juridique :** autorisation du traitement de données (le NPI est une donnée sensible) auprès de l'autorité de protection des données compétente, et cadre légal de la transmission.
2. **Institutionnel :** accord avec une structure réelle, protocoles d'escalade validés avec les services compétents, agentes formées, numéros officiels.
3. **Technique :** serveur sécurisé, chiffrement, authentification forte, audit de sécurité, version native pour le déclenchement physique.
4. **Humain :** tests avec des étudiantes et des associations, sans obliger personne à raconter son expérience.
5. **Sécurité de l'étudiante :** étude du risque d'escalade si l'agresseur découvre l'app.

---
_Données 100 % fictives. Aucun service d'urgence réel n'est connecté._
