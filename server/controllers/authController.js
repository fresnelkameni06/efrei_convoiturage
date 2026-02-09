const db = require("../config/db");
const bcrypt = require("bcryptjs");

// INSCRIPTION
exports.registerUser = (req, res) => {
  const { nom, prenom, email, password, telephone, role } = req.body;

  if (!nom || !prenom || !email || !password || !role) {
    return res.status(400).json({ error: "Champs obligatoires manquants" });
  }

  const password_hash = bcrypt.hashSync(password, 10);

  const sql = `
    INSERT INTO Users (nom, prenom, email, password_hash, telephone, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [nom, prenom, email, password_hash, telephone || null, role],
    (err) => {
      if (err) {
        console.error("Erreur SQL inscription :", err);
        return res.status(500).json({ error: "Erreur lors de l'inscription" });
      }

      return res.json({ message: "Inscription réussie" });
    }
  );
};

// CONNEXION
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email et mot de passe requis" });

  const sql = "SELECT * FROM Users WHERE email = ?";

  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("Erreur SQL connexion :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    const user = results[0];

    const ok = bcrypt.compareSync(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    const userSession = {
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role
    };

    req.session.user = userSession;

    return res.json({
      message: "Connexion réussie",
      user: userSession
    });
  });
};

// DECONNEXION
exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Déconnecté" });
  });
};
