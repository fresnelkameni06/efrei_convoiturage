const mysql = require("mysql2");

const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "",              // XAMPP par défaut : pas de mot de passe
  database: "efrei_covoiturage",
  port: 3306
});

module.exports = db;
