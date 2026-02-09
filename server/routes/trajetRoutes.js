//  TRAJET ROUTES (VERSION CORRIGÉE) 

const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  getAllTrajets,
  addTrajet,
  updateTrajet,
  deleteTrajet,
  bloquerTrajet
} = require("../controllers/trajetController");

 
//         ROUTES TRAJETS
 

// Récupérer tous les trajets (public + mise à jour auto)
router.get("/", getAllTrajets);

// Ajouter un trajet (conducteur)
router.post("/", auth, addTrajet);

// Modifier un trajet (conducteur)
router.put("/:id", auth, updateTrajet);

// Supprimer un trajet (conducteur)
router.delete("/:id", auth, deleteTrajet);

// Annuler un trajet (conducteur)
router.put("/bloquer/:id", auth, bloquerTrajet);

module.exports = router;
