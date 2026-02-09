const express = require("express");
const cors = require("cors");
const session = require("express-session");

const authRoutes = require("./routes/authRoutes");
const trajetRoutes = require("./routes/trajetRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

const app = express();
const port = 3000;

// CORS + Credentials
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

app.use(express.json());

// Session utilisateur
app.use(
  session({
    secret: "EFREI_SUPER_SECRET_KEY",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/trajets", trajetRoutes);
app.use("/api/reservations", reservationRoutes);

app.listen(port, () => {
  console.log(` Backend lancé : http://localhost:${port}`);
});
