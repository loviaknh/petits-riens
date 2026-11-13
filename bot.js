/* ============================================================================
 * bot.js — Le "cerveau" de mimi (faux chatbot à règles, SANS IA)
 * ----------------------------------------------------------------------------
 * mimi se présente comme "ton petit coin de douceur" : un chat de bien-être
 * banal. Choix délibéré de ne pas utiliser d'IA :
 *  - aucun message ne quitte le téléphone (vie privée)
 *  - fonctionne hors connexion
 *  - la phrase secrète déclenche l'alerte à 100 %
 * ==========================================================================*/

const MimiBot = (() => {
  /** Phrase convenue : SEULE l'étudiante sait qu'elle veut dire "alerte partie". */
  const CONFIRMATION_PHRASE = 'Super ! Fais attention à toi 🌸';
  const CANCEL_REPLY = 'D\'accord, on oublie ça ! 🌈';

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  function fakeWeather() {
    const temp = 26 + Math.floor(Math.random() * 8);
    const ciel = pick(['ensoleillé ☀️', 'quelques nuages ⛅', 'un peu de pluie 🌦️', 'grand ciel bleu 🌤️']);
    return `Il paraît qu'il fait ${temp}°C, ${ciel} Pense à boire un peu d'eau 💧`;
  }

  /* Règles testées dans l'ordre. Mots-clés déjà normalisés (sans accents). */
  const RULES = [
    { name: 'salutation', keys: ['bonjour', 'salut', 'coucou', 'bonsoir', 'hello', 'yo'],
      replies: ['Coucou toi ! 🌷 Tu as pu prendre une petite pause aujourd\'hui ?', 'Hello ! Contente de te lire ☁️', 'Coucou ! Comment se passe ta journée ?'] },
    { name: 'cours', keys: ['cours', 'examen', 'partiel', 'td', 'fac', 'universite', 'ecole', 'reviser', 'devoir'],
      replies: ['Ça fait du bien de souffler. Quoi de prévu maintenant ?', 'Courage pour tes cours 📚 Une petite pause de 5 minutes, ça aide !', 'Tu gères ! N\'oublie pas de manger quelque chose 🍊'] },
    { name: 'humeur', keys: ['ca va', 'comment vas tu', 'tu vas bien', 'la forme', 'fatigue', 'fatiguee', 'stress', 'stressee'],
      replies: ['Prends une grande respiration avec moi… inspire… expire 🌬️', 'Moi ça va, je fais la sieste sur mon coussin 🐱 Et toi ?', 'Ça arrive d\'être fatiguée. Tu mérites une pause douce ☁️'] },
    { name: 'meteo', keys: ['meteo', 'temps', 'pluie', 'pleuvoir', 'soleil', 'chaud', 'froid', 'nuage'],
      replies: [fakeWeather] },
    { name: 'merci', keys: ['merci', 'thanks'],
      replies: ['Avec plaisir 💜', 'De rien, toi ! 🌸'] },
    { name: 'blague', keys: ['blague', 'drole', 'rigoler', 'ennuie', 'raconte'],
      replies: ['Que fait un chat qui a froid ? Il met son pull-chat 🐱🧶', 'Pourquoi les nuages ne se disputent jamais ? Parce qu\'ils restent toujours zen ☁️😌'] },
    { name: 'partage', keys: ['regarde', 'lis ca', 'message', 'il m a ecrit', 'elle m a ecrit'],
      replies: ['Oh… 🙈 Les gens écrivent parfois n\'importe quoi. Et toi, ça va ?', 'Hmm, je vois. Tu veux qu\'on parle d\'autre chose ? 🌷'] },
    { name: 'aurevoir', keys: ['bye', 'a plus', 'au revoir', 'bonne nuit', 'a demain'],
      replies: ['À bientôt ! 🌙 Prends soin de toi.', 'Bye bye ! 🐱💜'] }
  ];

  const DEFAULT_REPLIES = ['Je t\'écoute 🌷', 'Raconte-moi ! ☁️', 'Oh, c\'est chouette ✨', 'Les petits riens font du bien 💜', 'Hihi 😊 Et ensuite ?'];

  function classify(message) {
    const m = ' ' + Mimi.normalize(message) + ' ';
    for (const rule of RULES) if (rule.keys.some((k) => m.includes(' ' + k + ' '))) return rule;
    return null;
  }

  function reply(message) {
    const rule = classify(message);
    const r = pick(rule ? rule.replies : DEFAULT_REPLIES);
    return typeof r === 'function' ? r() : r;
  }

  return { reply, classify, CONFIRMATION_PHRASE, CANCEL_REPLY };
})();
