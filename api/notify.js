/* ============================================================================
 * api/notify.js — Fonction serveur Vercel : e-mail de notification à la cellule
 * ----------------------------------------------------------------------------
 * Appelée par mimi / le carnet quand une alerte est transmise.
 *
 * SAFETY BY DESIGN :
 *  - L'e-mail PRÉVIENT seulement : aucun NPI, aucun pseudonyme, aucune preuve.
 *    Les détails restent dans le tableau de bord (accès contrôlé, journalisé).
 *  - Le contenu est construit ICI à partir de valeurs connues (listes fermées) :
 *    impossible d'injecter du texte libre dans l'e-mail.
 *  - La clé Resend est une variable d'environnement Vercel (RESEND_API_KEY),
 *    jamais visible dans le navigateur.
 *  - Destinataire fixe (NOTIFY_TO) : en mode test, Resend n'envoie qu'à
 *    l'adresse du compte → impossible d'écrire à une vraie structure.
 *  - Prototype : objet préfixé « [ALERTE FICTIVE – HACK4HER] ».
 * ==========================================================================*/

const SOURCES = {
  mimi:   { trigger: 'Mot de code',   type: 'Cyberharcèlement / surveillance d\'écran', app: 'mimi' },
  carnet: { trigger: 'Geste discret', type: 'Agression physique — danger immédiat',    app: 'Les petits riens' }
};
const PRIORITIES = { haute: 'HAUTE', urgente: 'URGENT' };

// Anti-abus simple : au plus 1 e-mail toutes les 3 s par instance
let lastSent = 0;

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'POST uniquement' });

  const { RESEND_API_KEY, NOTIFY_TO } = process.env;
  if (!RESEND_API_KEY || !NOTIFY_TO) return res.status(500).json({ ok: false, error: 'Variables RESEND_API_KEY / NOTIFY_TO manquantes' });

  // Le corps peut arriver en texte ou déjà décodé selon l'environnement
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  const { id, source, priority } = body || {};

  // Validation stricte : seules des valeurs attendues sont acceptées
  if (!/^SIM-\d{3,6}$/.test(String(id)) || !SOURCES[source] || !PRIORITIES[priority]) {
    return res.status(400).json({ ok: false, error: 'Données invalides' });
  }
  if (Date.now() - lastSent < 3000) return res.status(429).json({ ok: false, error: 'Trop de demandes' });
  lastSent = Date.now();

  const s = SOURCES[source];
  const p = PRIORITIES[priority];
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'petits-riens.vercel.app';
  const when = new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Porto-Novo', dateStyle: 'short', timeStyle: 'medium' });
  const red = priority === 'urgente';

  const subject = `[ALERTE FICTIVE – HACK4HER] ${id} · ${s.trigger} · ${p}`;
  const html = `
  <div style="font-family:Segoe UI,Arial,sans-serif;max-width:560px;margin:auto;color:#14243D">
    <div style="background:#FBF0D2;color:#8A6212;font-size:12px;font-weight:700;padding:8px 12px;border-radius:6px">
      PROTOTYPE HACK4HER 2026 — ALERTE FICTIVE — AUCUN SECOURS RÉEL
    </div>
    <h2 style="margin:18px 0 6px">🚨 Nouvelle alerte ${id}</h2>
    <p style="margin:0 0 14px;color:#58657A">Reçue le ${when}</p>
    <table style="border-collapse:collapse;width:100%;font-size:14px">
      <tr><td style="padding:8px;border-bottom:1px solid #E3E7EE;color:#58657A">Déclencheur</td><td style="padding:8px;border-bottom:1px solid #E3E7EE"><b>${s.trigger}</b> (${s.app})</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #E3E7EE;color:#58657A">Type</td><td style="padding:8px;border-bottom:1px solid #E3E7EE">${s.type}</td></tr>
      <tr><td style="padding:8px;color:#58657A">Priorité</td><td style="padding:8px"><b style="color:${red ? '#9B403F' : '#8A6212'}">${p}</b></td></tr>
    </table>
    <p style="margin:18px 0"><a href="https://${host}/dashboard.html" style="background:#14243D;color:#fff;text-decoration:none;padding:10px 16px;border-radius:8px;font-weight:600">Traiter l'alerte dans la cellule</a></p>
    <p style="font-size:13px;color:#58657A;line-height:1.5">
      ${red ? '⚠ <b>Danger immédiat possible : ne pas appeler ni écrire à l\'étudiante.</b> Suivre le protocole d\'urgence.<br>' : '⚠ <b>Ne pas appeler par défaut</b> : utiliser le canal sûr convenu.<br>'}
      Par sécurité, cet e-mail ne contient <b>aucune donnée personnelle</b> (ni identifiant, ni preuve) :
      les détails sont consultables uniquement dans la cellule, avec accès tracé.
    </p>
  </div>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'Cellule (démo) <onboarding@resend.dev>', to: [NOTIFY_TO], subject, html })
    });
    if (!r.ok) return res.status(502).json({ ok: false, error: 'Envoi refusé par Resend', status: r.status });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ ok: false, error: 'Service d\'e-mail injoignable' });
  }
};
