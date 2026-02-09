<template>
  <nav class="navbar navbar-expand-lg navbar-dark app-navbar">

<router-link to="/" class="navbar-brand d-flex align-items-center">
        <img
          :src="logo"
          alt="Logo"
          class="me-2"
          style="height: 100px; object-fit: contain;width:auto; margin-left:0px; padding-left:0px;"
        />
        <span class="brand-text">EFREI Covoiturage</span>
      </router-link>
    <div class="container-fluid">

      

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navBar"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navBar">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">

          <li class="nav-item">
            <router-link to="/" class="nav-link">Accueil</router-link>
          </li>

          <li class="nav-item">
            <router-link to="/a-propos" class="nav-link">À propos</router-link>
          </li>

          <li class="nav-item">
            <router-link to="/trajets" class="nav-link">Trajets</router-link>
          </li>

          <li v-if="isLoggedIn" class="nav-item">
            <router-link to="/historique" class="nav-link">Historique</router-link>
          </li>

          <li v-if="isLoggedIn" class="nav-item">
            <router-link to="/profil" class="nav-link">Profil</router-link>
          </li>

          <li v-if="isLoggedIn && user.role === 'conducteur'" class="nav-item">
            <router-link to="/mes-trajets" class="nav-link">Mes trajets</router-link>
          </li>

          <li v-if="isLoggedIn && user.role === 'conducteur'" class="nav-item">
            <router-link to="/ajout-trajet" class="nav-link">Publier un trajet</router-link>
          </li>
        </ul>

        <ul class="navbar-nav ms-auto">
          <li v-if="!isLoggedIn" class="nav-item">
            <router-link to="/auth" class="btn btn-outline-light btn-sm">
              Se connecter / S'inscrire
            </router-link>
          </li>

          <li v-else class="nav-item d-flex align-items-center gap-3 text-light">
            <span>{{ user.role === 'conducteur' ? 'Conducteur' : 'Passager' }} :
              {{ user.prenom }} {{ user.nom }}
            </span>
            <button class="btn btn-danger btn-sm" @click="logout">
              Déconnexion
            </button>
          </li>
        </ul>
      </div>

    </div>
  </nav>
</template>

<script>
import api from "../services/api";
import logo from "../assets/logo.png";

export default {
  data() {
    return {
      logo,
      user: JSON.parse(localStorage.getItem("user")) || null
    };
  },

  computed: {
    isLoggedIn() {
      return this.user !== null;
    }
  },

  watch: {
    //  Se met automatiquement à jour quand on change de page
    $route() {
      this.user = JSON.parse(localStorage.getItem("user")) || null;
    }
  },

  methods: {
    async logout() {
      try {
        await api.post("/auth/logout");
      } catch (_) {}

      // 🧹 Suppression user
      localStorage.removeItem("user");

      // 🔄 Mise à jour de Navbar sans reload
      this.user = null;

      //  Redirection instantanée
      this.$router.push("/auth");
    }
  }
};
</script>


<style scoped>
.app-navbar {
  background: linear-gradient(90deg, #0c1a33, #0f2d52, #083a74);
  box-shadow: 0 3px 10px rgba(0,0,0,0.2);
  height: 100px;
}

.nav-link {
  font-weight: 500;
  padding-left: 10px !important;
  padding-right: 10px !important;
}

.nav-link.router-link-active {
  color: #58a6ff !important;
}

.brand-text {
  font-size: 1.25rem;
  font-weight: 600;
}
</style>
