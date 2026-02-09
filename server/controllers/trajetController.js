const fs = require("fs");
const path = require("path");

const trajetsPath = path.join(__dirname, "..", "data", "trajets.json");

/*LECTURE / ÉCRITURE JSON */
function lireTrajets(cb) {
  fs.readFile(trajetsPath, "utf8", (err, data) => {
    if (err) return cb(err);
    let trajets = [];
    try {
      trajets = JSON.parse(data || "[]");
    } catch (e) {
      return cb(e);
    }
    cb(null, trajets);
  });
}

function ecrireTrajets(trajets, cb) {
  fs.writeFile(trajetsPath, JSON.stringify(trajets, null, 2), "utf8", cb);
}

/* MISE À JOUR STATUTS SELON RÈGLES MÉTIERS */

function mettreAJourStatutsEtNettoyer(trajets) {
  const now = new Date();
  let changed = false;
  const result = [];

  for (let t of trajets) {
    if (!t.date || !t.heure) {
      result.push(t);
      continue;
    }

    const dt = new Date(`${t.date}T${t.heure}:00`);
    if (isNaN(dt.getTime())) {
      result.push(t);
      continue;
    }

    // 🚫 ANNULÉ + date passée = SUPPRIMÉ
    if (t.status === "annulé") {
      if (dt <= now) {
        changed = true;
        continue;
      }
      result.push(t);
      continue;
    }

    // 🟢 TRAJET ACTIF
    if (t.status === "actif" || !t.status) {
      if (dt <= now) {
        // ✔ RÈGLE MÉTIER :
        // SI PERSONNE n’a RÉSERVÉ → effectué pour conducteur seulement
        if (!t.reservations || t.reservations.length === 0) {
          t.status = "effectué";
        } else {
          // ✔ des passagers avaient réservé => effectué aussi
          t.status = "effectué";
        }
        changed = true;
      }

      result.push(t);
      continue;
    }

    // 🔵 EFFECTUÉ OU AUTRES
    result.push(t);
  }

  return { trajets: result, changed };
}

/* GET /api/trajets */
exports.getAllTrajets = (req, res) => {
  lireTrajets((err, trajets) => {
    if (err) return res.status(500).json({ error: "Erreur lecture fichier" });

    const { trajets: maj, changed } = mettreAJourStatutsEtNettoyer(trajets);

    if (changed) {
      return ecrireTrajets(maj, () => res.json(maj));
    }

    res.json(maj);
  });
};

/*  POST /api/trajets */
exports.addTrajet = (req, res) => {
  const { conducteurId, depart, destination, date, heure, placesTotal } = req.body;

  if (!conducteurId || !depart || !destination || !date || !heure || !placesTotal) {
    return res.status(400).json({ error: "Champs manquants" });
  }

  const now = new Date();
  const dt = new Date(`${date}T${heure}:00`);

  if (dt <= now) {
    return res.status(400).json({
      error: "Impossible de créer un trajet avec une date/heure passée"
    });
  }

  lireTrajets((err, trajets) => {
    if (err) return res.status(500).json({ error: "Erreur lecture fichier" });

    const newId = trajets.length ? trajets[trajets.length - 1].id + 1 : 1;

    const trajet = {
      id: newId,
      conducteurId,
      depart,
      destination,
      date,
      heure,
      placesTotal: Number(placesTotal),
      placesRestantes: Number(placesTotal),
      status: "actif",
      reservations: []
    };

    trajets.push(trajet);
    ecrireTrajets(trajets, () => res.json({ message: "Trajet créé", trajet }));
  });
};

/* PUT /api/trajets/:id */
exports.updateTrajet = (req, res) => {
  const trajetId = parseInt(req.params.id);
  const { conducteurId, depart, destination, date, heure, placesTotal } = req.body;

  lireTrajets((err, trajets) => {
    if (err) return res.status(500).json({ error: "Erreur serveur" });

    const { trajets: maj } = mettreAJourStatutsEtNettoyer(trajets);
    const trajet = maj.find(t => t.id === trajetId);

    if (!trajet) return res.status(404).json({ error: "Trajet introuvable" });

    if (trajet.conducteurId !== conducteurId) {
      return res.status(403).json({ error: "Accès refusé" });
    }

    const dt = new Date(`${trajet.date}T${trajet.heure}:00`);
    if (dt <= new Date()) {
      return res.status(400).json({ error: "Impossible de modifier un trajet dépassé" });
    }

    if (trajet.reservations.length > 0) {
      return res
        .status(400)
        .json({ error: "Impossible de modifier : des passagers ont déjà réservé" });
    }

    trajet.depart = depart;
    trajet.destination = destination;
    trajet.date = date;
    trajet.heure = heure;
    trajet.placesTotal = Number(placesTotal);
    trajet.placesRestantes = Number(placesTotal);

    ecrireTrajets(maj, () => res.json({ message: "Trajet modifié", trajet }));
  });
};

/* DELETE /api/trajets/:id */
exports.deleteTrajet = (req, res) => {
  const trajetId = parseInt(req.params.id);
  const { conducteurId } = req.body;

  lireTrajets((err, trajets) => {
    if (err) return res.status(500).json({ error: "Erreur serveur" });

    const { trajets: maj } = mettreAJourStatutsEtNettoyer(trajets);
    const trajet = maj.find(t => t.id === trajetId);

    if (!trajet) return res.status(404).json({ error: "Trajet introuvable" });

    if (trajet.conducteurId !== conducteurId) {
      return res.status(403).json({ error: "Non autorisé" });
    }

    if (trajet.reservations.length > 0) {
      return res.status(400).json({
        error: "Impossible de supprimer : des passagers ont réservé. Annuler seulement."
      });
    }

    const dt = new Date(`${trajet.date}T${trajet.heure}:00`);

    if (dt <= new Date()) {
      trajet.status = "effectué";
      return ecrireTrajets(maj, () =>
        res.json({
          message: "Trajet marqué comme effectué et archivé",
          trajet
        })
      );
    }

    const nouveaux = maj.filter(t => t.id !== trajetId);
    ecrireTrajets(nouveaux, () => res.json({ message: "Trajet supprimé" }));
  });
};

/*ANNULER / BLOQUER un trajet par conducteur */
exports.bloquerTrajet = (req, res) => {
  const trajetId = parseInt(req.params.id);
  const { conducteurId } = req.body;

  lireTrajets((err, trajets) => {
    if (err) return res.status(500).json({ error: "Erreur serveur" });

    const { trajets: maj } = mettreAJourStatutsEtNettoyer(trajets);
    const trajet = maj.find(t => t.id === trajetId);

    if (!trajet) return res.status(404).json({ error: "Trajet introuvable" });

    if (trajet.conducteurId !== conducteurId) {
      return res.status(403).json({ error: "Non autorisé" });
    }

    const dt = new Date(`${trajet.date}T${trajet.heure}:00`);
    if (dt <= new Date()) {
      return res.status(400).json({
        error: "Impossible d’annuler : le trajet a démarré ou est terminé"
      });
    }

    if (trajet.reservations.length === 0) {
      return res.status(400).json({
        error: "Vous ne pouvez annuler que si des passagers ont réservé"
      });
    }

    trajet.status = "annulé";

    ecrireTrajets(maj, () => res.json({ message: "Trajet annulé", trajet }));
  });
};
module.exports.mettreAJourStatutsEtNettoyer = mettreAJourStatutsEtNettoyer;

