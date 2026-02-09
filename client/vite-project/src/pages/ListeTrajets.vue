<template>
  <div class="container mt-4">
    <h2>Liste des trajets</h2>

    <div v-if="trajetsFiltres.length === 0" class="alert alert-info">
      Aucun trajet disponible.
    </div>

    <div
      v-for="t in trajetsFiltres"
      :key="t.id"
      class="card mb-3 p-3 shadow-sm"
    >
      <h5>{{ t.depart }} → {{ t.destination }}</h5>
      <p>Date : {{ t.date }} | Heure : {{ t.heure }}</p>
      <p>Places : {{ t.placesRestantes }} / {{ t.placesTotal }}</p>

      <p>
        Statut :
        <span
          class="badge"
          :class="t.status === 'annulé' ? 'bg-danger' : 'bg-success'"
        >
          {{ t.status }}
        </span>
      </p>

      <div>
        <!-- Non connecté -->
        <router-link
          v-if="!isLoggedIn"
          to="/auth"
          class="btn btn-outline-primary btn-sm"
        >
          Se connecter pour réserver
        </router-link>

        <!-- Passager -->
        <div v-else-if="user.role === 'passager'">
          <!-- Si déjà réservé -->
          <button
            v-if="aReserve(t)"
            class="btn btn-warning btn-sm"
            @click="annulerReservation(t)"
          >
            Annuler ma réservation
          </button>

          <!-- Sinon : réserver -->
          <button
            v-else
            class="btn btn-primary btn-sm"
            :disabled="t.placesRestantes <= 0 || t.status !== 'actif'"
            @click="reserver(t)"
          >
            Réserver
          </button>
        </div>

        <!-- Conducteur -->
        <span v-else-if="user.role === 'conducteur'" class="text-muted">
          (Vue passager, vous ne pouvez pas réserver vos trajets)
        </span>
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

    // Afficher uniquement : actif + annulé
    trajetsFiltres() {
      return this.trajets.filter(t =>
        t.status === "actif" || t.status === "annulé"
      );
    }
  },

  async mounted() {
    const res = await api.get("/trajets");
    this.trajets = res.data;
  },

  methods: {
  aReserve(trajet) {
    if (!this.user || this.user.role !== "passager") return false;
    return (trajet.reservations || []).some(
      r => r.passagerId === this.user.id
    );
  },

  async reserver(trajet) {
    try {
      await api.post(`/reservations/${trajet.id}`, {
        passagerId: this.user.id
      });
      alert("Réservation effectuée.");
      const res = await api.get("/trajets");
      this.trajets = res.data;
    } catch (err) {
      alert(err.response?.data?.error || "Erreur lors de la réservation");
    }
  },

  async annulerReservation(trajet) {
    if (!confirm("Annuler cette réservation ?")) return;

    try {
      await api.delete(`/reservations/${trajet.id}`, {
        data: { passagerId: this.user.id }
      });
      alert("Réservation annulée.");
      const res = await api.get("/trajets");
      this.trajets = res.data;
    } catch (err) {
      alert(err.response?.data?.error || "Erreur lors de l'annulation");
    }
  }
}

};
</script>

<style scoped>
.container {
  max-width: 900px;
  padding-bottom: 40px;
}

h2 {
  font-weight: 700;
  color: #0056D2;
  margin-bottom: 1.5rem;
}

/* --- Carte trajet --- */
.card {
  border-radius: 14px;
  border: none;
  background: #ffffff;
  box-shadow: 0 4px 14px rgba(0,0,0,0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(0,0,0,0.15);
}

.card h5 {
  font-weight: 700;
  color: #0056D2;
}

p {
  margin: 0.4rem 0;
  font-size: 1rem;
  color: #444;
}

/* --- badges statut --- */
.badge {
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.85rem;
}

.bg-success {
  background-color: #0ABF48 !important;
}

.bg-danger {
  background-color: #D90429 !important;
}

/* --- boutons --- */
.btn-primary {
  background-color: #0056D2 !important;
  border-color: #0056D2 !important;
  border-radius: 8px !important;
  padding: 6px 14px;
  font-weight: 600;
}

.btn-warning {
  background-color: #F6A800 !important;
  border-radius: 8px !important;
  color: black !important;
}

.btn-outline-primary {
  border-radius: 8px !important;
  padding: 6px 14px;
  font-weight: 600;
}

.btn-danger {
  border-radius: 8px !important;
}

/* --- alert info --- */
.alert-info {
  background-color: #e9f2ff;
  color: #0056D2;
  border-radius: 10px;
  font-weight: 500;
  padding: 12px;
}
</style>
