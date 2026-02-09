<template>
  <div class="container ">

    <!-- DASHBOARD CONDUCTEUR -->
    <div v-if="isLoggedIn && user.role === 'conducteur'">
      <h1 class="mb-3">Bienvenue Conducteur, {{ user.prenom }} !</h1>

      <div class="row mb-4">
        <div class="col-md-4">
          <div class="card text-center p-3">
            <h5>Trajets publiés</h5>
            <p class="fs-3">{{ nbTrajetsConducteur }}</p>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card text-center p-3">
            <h5>Réservations totales</h5>
            <p class="fs-3">{{ nbReservationsConducteur }}</p>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card text-center p-3">
            <h5>Trajets actifs</h5>
            <p class="fs-3">{{ nbTrajetsActifsConducteur }}</p>
          </div>
        </div>
      </div>

      <div class="d-flex gap-2">
        <router-link to="/ajout-trajet" class="btn btn-primary">
          Publier un trajet
        </router-link>
        <router-link to="/mes-trajets" class="btn btn-success">
          Voir mes trajets
        </router-link>
        <router-link to="/historique" class="btn btn-secondary">
          Historique
        </router-link>
      </div>
    </div>

    <!-- DASHBOARD PASSAGER -->
    <div v-else-if="isLoggedIn && user.role === 'passager'">
      <h2 class="mb-3">Bienvenue Passager, {{ user.prenom }} !</h2>

      <div class="row mb-4">
        <div class="col-md-4">
          <div class="card text-center p-3">
            <h5>Trajets disponibles</h5>
            <p class="fs-3">{{ nbTrajetsActifs }}</p>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card text-center p-3">
            <h5>Mes réservations</h5>
            <p class="fs-3">{{ nbReservationsPassager }}</p>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card text-center p-3">
            <h5>Trajets effectués</h5>
            <p class="fs-3">{{ nbTrajetsPassesPassager }}</p>
          </div>
        </div>
      </div>

      <div class="d-flex gap-2">
        <router-link to="/trajets" class="btn btn-primary">
          Voir les trajets
        </router-link>
        <router-link to="/historique" class="btn btn-secondary">
          Historique
        </router-link>
        <router-link to="/profil" class="btn btn-outline-dark">
          Mon profil
        </router-link>
      </div>
    </div>

    <!-- USER NON CONNECTÉ -->
    <div v-else>
      <h2 class="mb-3">Bienvenue sur EFREI Covoiturage</h2>
      <p class="mb-4">
        Plateforme de covoiturage : conducteurs et passagers partagent leurs trajets.
      </p>

      <div class="d-flex gap-2">
        <router-link to="/auth" class="btn btn-primary">
          Se connecter / S'inscrire
        </router-link>
        <router-link to="/trajets" class="btn btn-outline-primary">
          Voir les trajets
        </router-link>
      </div>
    </div>

  </div>
</template>

<script>
import api from "../services/api";

export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user") || "null"),
      trajets: []
    };
  },

  computed: {
    isLoggedIn() {
      return !!this.user;
    },

    // Tous les trajets actifs du système (pas annulés, pas effectués)
    nbTrajetsActifs() {
      return this.trajets.filter(t => t.status === "actif").length;
    },

    // Conducteur — trajets publiés
    nbTrajetsConducteur() {
      if (!this.user || this.user.role !== "conducteur") return 0;
      return this.trajets.filter(t => t.conducteurId === this.user.id).length;
    },

    // Conducteur — trajets actifs
    nbTrajetsActifsConducteur() {
      if (!this.user || this.user.role !== "conducteur") return 0;
      return this.trajets.filter(
        t => t.conducteurId === this.user.id && t.status === "actif"
      ).length;
    },

    // Conducteur — total réservations
    nbReservationsConducteur() {
      if (!this.user || this.user.role !== "conducteur") return 0;
      return this.trajets
        .filter(t => t.conducteurId === this.user.id)
        .reduce((n, t) => n + (t.reservations?.length || 0), 0);
    },

    // Passager — nombre de ses réservations
    nbReservationsPassager() {
      if (!this.user || this.user.role !== "passager") return 0;
      return this.trajets.reduce((n, t) => {
        return (
          n +
          (t.reservations || []).filter(r => r.passagerId === this.user.id)
            .length
        );
      }, 0);
    },

    // Passager — trajets effectués
    nbTrajetsPassesPassager() {
      if (!this.user || this.user.role !== "passager") return 0;
      return this.trajets.filter(t =>
        t.status === "effectué" &&
        (t.reservations || []).some(
          r => r.passagerId === this.user.id && r.statut === "effectué"
        )
      ).length;
    }
  },

  async mounted() {
    const res = await api.get("/trajets");
    this.trajets = res.data;
  }
};
</script>

<style scoped>
/* Permet d’avoir du contenu bien centré sur la page */
.container {
  padding-bottom: 4rem; /* espace footer */
  max-width: 900px; /* centre et limite la largeur */
  margin: 0 auto;
  text-align: center; /* centre tout le texte */
  margin-top: 300px;
}

/* TITRES */
h1 {
  font-weight: bold;
  font-size: 40px; /* plus grand */
  color: #0c1a33;
  margin-bottom: 2rem;
}

/* Sous-titres des sections conducteur/passager */
h4 {
  font-size: 1.6rem;
  color: #122f57;
}

/* Paragraphe d’accueil */
p {
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 1.5rem;
}

/* CARTES DU DASHBOARD */
.card {
  border: none;
  border-radius: 14px;
  background: #ffffff;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.10);
  transition: 0.25s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 18px rgba(0,0,0,0.15);
}

.card h5 {
  color: #0f2d52;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.card p {
  font-size: 2rem;
  font-weight: 600;
  color: #083a74;
}

/* BOUTONS */
.btn {
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 1.05rem;
  font-weight: 500;
}

/* Espace entre les groupes de cards */
.row {
  margin-top: 1rem;
  margin-bottom: 2.5rem;
}

/* Section utilisateur non connecté */
.container > div:not(.row) {
  margin-top: 2rem;
}

</style>
