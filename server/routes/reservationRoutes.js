const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const {
  reserverTrajet,
  annulerReservation
} = require("../controllers/reservationController");

// Réserver un trajet (passager)
router.post("/:id", auth, reserverTrajet);

// Annuler une réservation (passager)
router.delete("/:id", auth, annulerReservation);

module.exports = router;
