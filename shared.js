/* ============================================================================
 * shared.js — Cœur du prototype "Alerte discrète" (HACK4HER 2026 – Défi 5)
 * ----------------------------------------------------------------------------
 * Deux portes d'entrée anodines, une même chaîne de soutien :
 *   • mimi            (index.html)   → cyberharcèlement / surveillance d'écran
 *                                       déclencheur : phrase secrète dans le chat
 *   • Les petits riens (carnet.html) → agression physique, danger immédiat
 *                                       déclencheur : deux appuis rapides sur le nuage
 *   • Cellule         (dashboard.html) → réception, qualification, orientation
 *
 * ⚠ PROTOTYPE : aucune donnée réelle, aucun secours réel.
 *   Le "serveur" est SIMULÉ par le localStorage du navigateur :
 *   toutes les pages doivent être ouvertes dans le MÊME navigateur.
 * ==========================================================================*/

const Mimi = (() => {
  /** Nom de la structure (fictive) qui reçoit les alertes. Modifiable ici. */
  const STRUCTURE = 'Cellule d\'écoute universitaire (fictive)';

  /* ---------- Clés de stockage ------------------------------------------
   * Le préfixe permet à tests.html de travailler dans un espace séparé. */
  let NS = 'mimi_';
  const key = (name) => NS + name;
  function setNamespace(prefix) { NS = prefix; }

  /* ---------- Communication temps réel entre les pages -------------------
   * BroadcastChannel : message instantané aux autres onglets/iframes.
   * Événement "storage" : secours, déclenché quand le localStorage change. */
  const channel = ('BroadcastChannel' in window) ? new BroadcastChannel('mimi-demo') : null;
  function notify(type) { if (channel) channel.postMessage({ type, at: Date.now() }); }
  function onChange(callback) {
    if (channel) channel.addEventListener('message', (e) => callback(e.data));
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.startsWith(NS)) callback({ type: 'storage', key: e.key });
    });
  }

  /* ---------- Lecture / écriture sécurisées ------------------------------ */
  function read(name, fallback) {
    try { const raw = localStorage.getItem(key(name)); return raw ? JSON.parse(raw) : fallback; }
    catch (e) { return fallback; }
  }
  function write(name, value) { try { localStorage.setItem(key(name), JSON.stringify(value)); } catch (e) { /* bloqué */ } }
  function remove(name) { try { localStorage.removeItem(key(name)); } catch (e) { /* ignoré */ } }

  /* ========================================================================
   * 1. DÉTECTION DE LA PHRASE SECRÈTE (porte d'entrée "mimi")
   * ======================================================================*/

  /** Forme comparable : minuscules, sans accents, sans ponctuation.
   *  Garde toutes les lettres, y compris ɛ et ɔ du fon. */
  function normalize(text) {
    return String(text || '')
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /** Vrai si le message contient le mot/la phrase secrète EN MOTS ENTIERS.
   *  "chat" est détecté dans "le chat dort" mais pas dans "chaton". */
  function containsSecret(message, secret) {
    const s = normalize(secret);
    if (!s) return false;
    return (' ' + normalize(message) + ' ').includes(' ' + s + ' ');
  }

  const CANCEL_WORD = 'oublie';
  const CANCEL_WINDOW_MS = 30 * 1000;
  function isCancel(message) { return containsSecret(message, CANCEL_WORD); }

  const OBVIOUS_WORDS = ['aide', 'help', 'sos', 'alerte', 'police', 'urgence', 'secours'];
  const COMMON_WORDS = ['bonjour', 'salut', 'merci', 'oui', 'non', 'ok', 'bien', 'mal', 'mimi',
    'meteo', 'pluie', 'soleil', 'temps', 'ca va', 'le', 'la', 'les', 'un', 'une', 'de', 'des',
    'et', 'je', 'tu', 'il', 'elle', 'oublie', 'pause', 'cours'];

  /** Renvoie un message d'erreur, ou null si la phrase secrète est utilisable. */
  function validateSecret(secret) {
    const s = normalize(secret);
    if (s.length < 3) return 'Choisis au moins 3 lettres.';
    if (OBVIOUS_WORDS.some((w) => (' ' + s + ' ').includes(' ' + w + ' ')))
      return 'Trop évident : quelqu\'un qui lit ton écran comprendrait.';
    if (COMMON_WORDS.includes(s)) return 'Trop courant : tu risquerais de l\'écrire sans le vouloir.';
    return null;
  }

  /* ========================================================================
   * 2. GESTE DISCRET (porte d'entrée "carnet") : deux appuis rapides
   * ----------------------------------------------------------------------
   * Le délai entre les deux appuis est réglable (accessibilité) :
   * une personne qui tremble ou qui a peur n'appuie pas à la même vitesse.
   * ======================================================================*/
  const TAP_DELAYS = { rapide: 350, normal: 500, lent: 750 };

  /** Vrai si deux appuis sont assez rapprochés pour former un "double appui". */
  function isDoubleTap(previousTs, ts, delayMs) {
    return previousTs > 0 && ts - previousTs > 30 && ts - previousTs <= delayMs;
  }

  /* ========================================================================
   * 3. IDENTIFIANT (NPI) — UNIQUEMENT FICTIF
   * Le règlement interdit toute donnée réelle : seul "FICT-" + 6 chiffres
   * est accepté. Un vrai NPI (10 chiffres) est refusé.
   * ======================================================================*/
  function validateNpi(npi) {
    const v = String(npi || '').trim().toUpperCase();
    if (/^\d{8,}$/.test(v)) return 'Prototype : n\'entre pas ton vrai NPI. Utilise un NPI fictif.';
    if (!/^FICT-\d{6}$/.test(v)) return 'Format attendu : FICT-123456 (NPI fictif).';
    return null;
  }
  function generateFakeNpi() { return 'FICT-' + String(Math.floor(Math.random() * 1e6)).padStart(6, '0'); }
  function maskNpi(npi) { return npi ? npi.slice(0, 5) + '••••' + npi.slice(-2) : '—'; }

  /* ========================================================================
   * 4. CANAL SÛR CONVENU
   * ----------------------------------------------------------------------
   * Choisi par l'étudiante au moment de la configuration. Après une alerte,
   * la cellule ne l'appelle JAMAIS par défaut : elle utilise ce canal.
   * ======================================================================*/
  const SAFE_CHANNELS = {
    mimi: 'Message discret via mimi (déguisé en conversation)',
    rdv: 'Rendez-vous à la cellule, sans prévenir à l\'avance',
    confiance: 'Passer par une personne de confiance (fictive)'
  };

  /* ========================================================================
   * 5. CONFIGURATION (stockée sur le téléphone de l'étudiante uniquement)
   * ======================================================================*/
  function getConfig() { return read('config', null); }

  /** Fusionne les champs fournis avec la configuration existante. */
  function saveConfig(fields) {
    const c = getConfig() || {
      pseudo: 'Étudiante #' + Math.random().toString(16).slice(2, 6).toUpperCase(),
      createdAt: Date.now(),
      tapDelay: 'normal',
      carnetTrained: false
    };
    const next = Object.assign({}, c, fields);
    if (next.secret) next.secret = String(next.secret).trim();
    if (next.npi) next.npi = String(next.npi).trim().toUpperCase();
    write('config', next);
    return next;
  }
  /** L'identité minimale est-elle renseignée ? (NPI + canal + consentement) */
  function hasIdentity() { const c = getConfig(); return !!(c && c.npi && c.channel && c.consent); }

  /* ========================================================================
   * 6. COFFRE-FORT (porte "mimi" : appui long sur un message collé)
   * Consentement : rien n'est transmis sans alerte.
   * ======================================================================*/
  function getVault() { return read('vault', []); }
  function addToVault(text) {
    const vault = getVault();
    const item = { id: 'p' + Date.now() + Math.random().toString(36).slice(2, 5), text, addedAt: Date.now(), synthetic: true };
    vault.push(item);
    write('vault', vault);
    const active = getActiveAlert('mimi');
    if (active) {
      updateAlert(active.id, (a) => {
        a.evidence.push(item);
        a.log.push({ at: Date.now(), who: 'Étudiante', what: 'Nouvel élément ajouté au coffre' });
      });
    }
    return item;
  }
  function clearVault() { remove('vault'); }

  /* ========================================================================
   * 7. ALERTES (le "serveur" simulé de la cellule)
   * ----------------------------------------------------------------------
   * Statuts : a_qualifier → en_cours → cloturee   (ou annulee)
   * Contrôle humain : rien ne change de statut tout seul.
   * Réseau : si le téléphone est hors ligne, l'alerte attend dans une file
   * et part automatiquement au retour du réseau ("réception dépendante du
   * réseau", comme dans la maquette).
   * ======================================================================*/
  const SOURCES = {
    mimi: {
      app: 'mimi', trigger: 'Mot de code', priority: 'haute',
      type: 'Cyberharcèlement / surveillance d\'écran',
      title: 'Mot de code activé. Action : contacter la cellule'
    },
    carnet: {
      app: 'Les petits riens', trigger: 'Geste discret', priority: 'urgente',
      type: 'Agression physique — danger immédiat',
      title: 'Geste discret activé. Action : protocole d\'urgence'
    }
  };
  const ZONES_FICTIVES = ['Campus — zone simulée A', 'Campus — zone simulée B', 'Cotonou — zone simulée', 'Abomey-Calavi — zone simulée'];

  function isOnline() { return typeof navigator === 'undefined' || navigator.onLine !== false; }

  function getAlerts() { return read('alerts', []); }
  function saveAlerts(list) { write('alerts', list); notify('alerts'); }
  /** Alertes réellement arrivées à la cellule (pas celles en file d'attente). */
  function getDeliveredAlerts() { return getAlerts().filter((a) => a.delivered); }

  function getActiveAlert(source) {
    const c = getConfig();
    if (!c) return null;
    return getAlerts().slice().reverse().find((a) => a.pseudo === c.pseudo &&
      (!source || a.source === source) && (a.status === 'a_qualifier' || a.status === 'en_cours')) || null;
  }

  /** Numéro de dossier lisible et unique : SIM-001, SIM-002… */
  function nextDossierId() {
    const n = read('seq', 0) + 1;
    write('seq', n);
    return 'SIM-' + String(n).padStart(3, '0');
  }

  /** Crée une alerte FICTIVE. Aucun service réel n'est contacté.
   *  opts.online permet aux tests de simuler une coupure réseau. */
  function sendAlert(source, opts = {}) {
    const c = getConfig();
    const s = SOURCES[source];
    if (!c || !s) return null;
    const online = opts.online !== undefined ? opts.online : isOnline();
    const now = Date.now();
    const alert = {
      id: nextDossierId(),
      source, app: s.app, trigger: s.trigger, type: s.type, title: s.title, priority: s.priority,
      pseudo: c.pseudo, npi: c.npi, channel: c.channel || null,
      zone: ZONES_FICTIVES[Math.floor(Math.random() * ZONES_FICTIVES.length)],
      createdAt: now,
      delivered: online, deliveredAt: online ? now : null,
      status: 'a_qualifier',
      // Mimi : seulement ce que l'étudiante a mis au coffre. Carnet : rien (pas de collecte par défaut).
      evidence: source === 'mimi' ? getVault() : [],
      checklist: [], notes: '', identityRevealed: false, synthetic: true,
      log: [{ at: now, who: 'Système', what: s.trigger + ' détecté — alerte fictive créée' + (online ? '' : ' (hors ligne : en file d\'attente)') }]
    };
    const list = getAlerts();
    list.push(alert);
    saveAlerts(list);
    if (online) notifyCellule(alert);
    return alert;
  }

  /** Prévient la cellule par e-mail via la fonction serveur /api/notify.
   *  On n'envoie QUE le n° de dossier, la source et la priorité : aucune donnée
   *  personnelle. Silencieux en cas d'échec (rien ne doit apparaître à l'écran
   *  de l'étudiante). Désactivé pendant les tests et hors site web. */
  function notifyCellule(alert) {
    if (NS !== 'mimi_' || typeof location === 'undefined' || !/^https?:$/.test(location.protocol) || typeof fetch !== 'function') return;
    try {
      fetch('/api/notify', {
        method: 'POST', keepalive: true,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: alert.id, source: alert.source, priority: alert.priority })
      }).catch(() => {});
    } catch (e) { /* ignoré */ }
  }

  /** Envoie les alertes en attente quand le réseau revient. */
  function flushQueue() {
    const list = getAlerts();
    let changed = false;
    const sent = [];
    list.forEach((a) => {
      if (!a.delivered) {
        a.delivered = true; a.deliveredAt = Date.now(); changed = true; sent.push(a);
        a.log.push({ at: Date.now(), who: 'Système', what: 'Réseau rétabli — alerte transmise à la cellule' });
      }
    });
    if (changed) saveAlerts(list);
    sent.forEach(notifyCellule); // l'e-mail part aussi au retour du réseau
    return changed;
  }

  /** Annule l'alerte la plus récente de cette source si elle a moins de 30 s. */
  function cancelRecentAlert(source) {
    const a = getActiveAlert(source);
    if (!a || a.status !== 'a_qualifier' || Date.now() - a.createdAt > CANCEL_WINDOW_MS) return false;
    updateAlert(a.id, (x) => {
      x.status = 'annulee';
      x.log.push({ at: Date.now(), who: 'Étudiante', what: 'Alerte annulée (fausse manipulation)' });
    });
    return true;
  }

  function updateAlert(id, mutate) {
    const list = getAlerts();
    const a = list.find((x) => x.id === id);
    if (!a) return null;
    mutate(a);
    saveAlerts(list);
    return a;
  }

  /* ========================================================================
   * 8. HISTORIQUE DU CHAT + EFFACEMENT
   * ======================================================================*/
  function getChat() { return read('chat', []); }
  function saveChat(list) { write('chat', list.slice(-200)); }

  /** Efface tout ce qui est stocké sur le téléphone de l'étudiante. */
  function wipeDevice() { ['config', 'vault', 'chat'].forEach(remove); notify('wipe'); }
  /** Réinitialise toute la démo (téléphone + cellule). */
  function resetAll() { ['config', 'vault', 'chat', 'alerts', 'seq'].forEach(remove); notify('reset'); }

  /* ---------- Utilitaires d'affichage ------------------------------------ */
  function formatTime(ts) { return new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); }
  function formatTimeSec(ts) { return new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); }
  function formatDateTime(ts) {
    return new Date(ts).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  /** Empêche un message d'injecter du code dans la page (protection XSS). */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  return {
    STRUCTURE, SOURCES, SAFE_CHANNELS, TAP_DELAYS, CANCEL_WINDOW_MS,
    setNamespace, onChange, notify,
    normalize, containsSecret, isCancel, validateSecret, isDoubleTap,
    validateNpi, generateFakeNpi, maskNpi,
    getConfig, saveConfig, hasIdentity,
    getVault, addToVault, clearVault,
    getAlerts, getDeliveredAlerts, getActiveAlert, sendAlert, flushQueue, cancelRecentAlert, updateAlert,
    getChat, saveChat, wipeDevice, resetAll,
    formatTime, formatTimeSec, formatDateTime, escapeHtml
  };
})();
