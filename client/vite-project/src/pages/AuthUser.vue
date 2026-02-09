<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">Connexion / Inscription</h2>

    <div class="card p-4 shadow-sm">

      <ul class="nav nav-tabs mb-3">
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{ active: mode === 'login' }"
            @click="setMode('login')"
          >
            Connexion
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{ active: mode === 'register' }"
            @click="setMode('register')"
          >
            Inscription
          </button>
        </li>
      </ul>

      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <div v-if="success" class="alert alert-success">{{ success }}</div>

      <!-- LOGIN -->
      <div v-if="mode === 'login'">

        <div class="mb-3">
          <label>Email</label>
          <input v-model="login.email" type="email" class="form-control">
        </div>
        <div class="mb-3">
          <label>Mot de passe</label>
          <input v-model="login.password" type="password" class="form-control">
        </div>
        <button class="btn btn-primary w-100" @click="doLogin">
          Se connecter
        </button>

      </div>

      <!-- REGISTER -->
      <div v-else>
        <div class="mb-3">
          <label>Nom</label>
          <input v-model="register.nom" class="form-control">
        </div>
        <div class="mb-3">
          <label>Prénom</label>
          <input v-model="register.prenom" class="form-control">
        </div>
        <div class="mb-3">
          <label>Email</label>
          <input v-model="register.email" type="email" class="form-control">
        </div>
        <div class="mb-3">
          <label>Téléphone</label>
          <input v-model="register.telephone" class="form-control">
        </div>
        <div class="mb-3">
          <label>Mot de passe</label>
          <input v-model="register.password" type="password" class="form-control">
        </div>
        <div class="mb-3">
          <label>Rôle</label>
          <select v-model="register.role" class="form-control">
            <option disabled value="">Choisissez un rôle</option>
            <option value="passager">Passager</option>
            <option value="conducteur">Conducteur</option>
          </select>
        </div>
        <button class="btn btn-success w-100" @click="doRegister">
          S'inscrire
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  data() {
    return {
      mode: "login",
      login: {
        email: "",
        password: ""
      },
      register: {
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        password: "",
        role: ""
      },
      error: "",
      success: ""
    };
  },
  methods: {
    setMode(m) {
      this.mode = m;
      this.error = "";
      this.success = "";
    },

    async doLogin() {
      this.error = "";
      this.success = "";
      try {
        const res = await api.post("/auth/login", this.login);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        //  Redirection automatique selon le rôle
        if (res.data.user.role === "conducteur") {
          this.$router.push("/");
        } else {
          this.$router.push("/");
        }

        // Recharge pour mettre Navbar à jour
        

      } catch (err) {
        this.error = err.response?.data?.error || "Erreur lors de la connexion";
      }
    },

    async doRegister() {
      this.error = "";
      this.success = "";
      try {
        await api.post("/auth/register", this.register);
        this.success = "Inscription réussie, vous pouvez vous connecter.";
        this.mode = "login";
      } catch (err) {
        this.error = err.response?.data?.error || "Erreur lors de l'inscription";
      }
    }
  }
};
</script>

<style scoped>
/* 🟦 Container centré et large */
.container {
  max-width: 650px; /* plus large */
  margin: 0 auto;
  padding-bottom: 4rem; /* pour le footer */
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 🟦 Titre */
h2 {
  font-weight: 700;
  color: #0056D2;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
}

/* 🟦 Carte du formulaire */
.card {
  width: 100%;
  border-radius: 14px;
  border: none;
  background: #ffffff;
  padding: 2rem !important;
  box-shadow: 0 4px 14px rgba(0,0,0,0.08);
}

/* 🟦 Onglets */
.nav-tabs {
  display: flex;
  justify-content: center;
}

.nav-tabs .nav-link {
  font-weight: 600;
  color: #666;
  border-radius: 6px 6px 0 0;
  padding: 10px 20px;
}

.nav-tabs .nav-link.active {
  background: #0056D2;
  color: white !important;
}

/* 🟦 Labels */
label {
  font-weight: 600;
  color: #222;
  margin-bottom: 4px;
}

/* 🟦 Inputs */
input,
select {
  padding: 12px !important;
  font-size: 1.05rem;
  border-radius: 10px !important;
  border: 1px solid #bbb !important;
}

/* 🟦 Boutons */
button {
  padding: 12px;
  border-radius: 10px !important;
  font-size: 1rem;
  font-weight: 600 !important;
}

/* Couleurs boutons */
.btn-primary {
  background-color: #0056D2 !important;
  border-color: #0056D2 !important;
}

.btn-success {
  background-color: #0ABF48 !important;
  border-color: #0ABF48 !important;
}

/* 🟦 Messages alertes */
.alert {
  border-radius: 10px;
  font-size: 0.95rem;
}

/* 🟦 Amélioration responsive */
@media (max-width: 576px) {
  .container {
    max-width: 95%;
    padding: 0 10px;
  }

  .card {
    padding: 1.5rem !important;
  }

  h2 {
    font-size: 1.7rem;
  }
}
</style>

