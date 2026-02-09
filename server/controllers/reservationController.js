const fs = require("fs");
const path = require("path");

const trajetsPath = path.join(__dirname, "..", "data", "trajets.json");
const { mettreAJourStatutsEtNettoyer } = require("./trajetController");

/* LECTURE / ÉCRITURE JSON */
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

/* RESERVER UN TRAJET (PASSAGER)*/
exports.reserverTrajet = (req, res) => {
  const trajetId = parseInt(req.params.id);
  const { passagerId } = req.body;

  lireTrajets((err, trajets) => {
    if (err) return res.status(500).json({ error: "Erreur serveur" });

    const { trajets: maj } = mettreAJourStatutsEtNettoyer(trajets);
    const trajet = maj.find(t => t.id === trajetId);

    if (!trajet) return res.status(404).json({ error: "Trajet introuvable" });

    const dt = new Date(`${trajet.date}T${trajet.heure}:00`);
    const now = new Date();

    // Date/heure passée  impossible de réserver
    if (dt <= now) {
      trajet.status = "effectué";
      return ecrireTrajets(maj, () =>
        res.status(400).json({
          error: "Impossible de réserver : la date/heure sont dépassées"
        })
      );
    }

    if (trajet.status === "annulé") {
      return res.status(400).json({ error: "Trajet annulé, réservation impossible" });
    }
    if (trajet.status === "effectué") {
      return res.status(400).json({ error: "Trajet déjà effectué" });
    }
    if (trajet.placesRestantes <= 0) {
      return res.status(400).json({ error: "Plus de places disponibles" });
    }

    const existe = (trajet.reservations || []).find(r => r.passagerId === passagerId);
    if (existe) {
      return res.status(400).json({ error: "Vous avez déjà réservé ce trajet" });
    }

    if (!trajet.reservations) trajet.reservations = [];

    trajet.reservations.push({
      passagerId,
      dateReservation: new Date().toISOString(),
      statut: "réservé"
    });

    trajet.placesRestantes--;

    ecrireTrajets(maj, () => res.json({ message: "Réservation effectuée", trajet }));
  });
};

/* ANNULER UNE RÉSERVATION (PASSAGER) */
exports.annulerReservation = (req, res) => {
  const trajetId = parseInt(req.params.id);
  const { passagerId } = req.body;

  lireTrajets((err, trajets) => {
    if (err) return res.status(500).json({ error: "Erreur serveur" });

    const { trajets: maj } = mettreAJourStatutsEtNettoyer(trajets);
    const trajet = maj.find(t => t.id === trajetId);

    if (!trajet) return res.status(404).json({ error: "Trajet introuvable" });

    const dt = new Date(`${trajet.date}T${trajet.heure}:00`);
    const now = new Date();

    const reservations = trajet.reservations || [];
    const index = reservations.findIndex(r => r.passagerId === passagerId);

    if (index === -1) {
      return res.status(400).json({ error: "Aucune réservation trouvée" });
    }

    // Si date passée → plus d'annulation, trajet effectué
    if (dt <= now) {
      reservations[index].statut = "effectué";
      trajet.status = "effectué";
      return ecrireTrajets(maj, () =>
        res.json({
          message: "Vous ne pouvez plus annuler, le trajet est considéré comme effectué.",
          trajet
        })
      );
    }

    // Annulation dans les délais
    reservations.splice(index, 1);
    trajet.placesRestantes++;

    if (reservations.length === 0 && trajet.status !== "annulé") {
      trajet.status = "actif";
    }

    ecrireTrajets(maj, () => res.json({ message: "Réservation annulée", trajet }));
  });
};
