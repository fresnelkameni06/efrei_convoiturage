<template>
  <div class="container mt-4">
    <h2>Liste des trajets</h2>

    <div v-if="trajetsVisibles.length === 0" class="alert alert-info">
      Aucun trajet disponible pour le moment.
    </div>

    <div
      v-for="t in trajetsVisibles"
      :key="t.id"
      class="card mb-3 p-3 shadow-sm"
    >
      <h5>{{ t.depart }} → {{ t.destination }}</h5>
      <p>Date : {{ t.date }} | Heure : {{ t.heure }}</p>
      <p>Places restantes : {{ t.placesRestantes }} / {{ t.placesTotal }}</p>

      <p>
        Statut :
        <span
          class="badge"
          :class="t.status === 'annulé'
                    ? 'bg-danger'
                    : 'bg-success'"
        >
          {{ t.status }}
        </span>
      </p>

      <!--  NON CONNECTÉ -->
      <div v-if="!user" class="mt-2">
        <small class="text-muted">
          Connectez-vous pour réserver un trajet.
        </small>
      </div>

      <!--  CONDUCTEUR -->
      <div v-else-if="user.role === 'conducteur'" class="mt-2">
        <small class="text-muted">
          Vous êtes conducteur. Cette liste est destinée aux passagers.
        </small>
      </div>

      <!--  PASSAGER -->
      <div v-else class="mt-2">

        <!-- Trajet annulé -->
        <div v-if="t.status === 'annulé'">
          <span class="text-danger">
            Ce trajet a été annulé par le conducteur.
          </span>
        </div>

        <!-- Passager a déjà réservé -->
        <div v-else-if="reservationPourMoi(t)">
          <p class="text-success mb-1">
            Vous avez réservé ce trajet.
          </p>
          <button
            class="btn btn-outline-danger btn-sm"
            @click="annulerReservation(t)"
          >
            Annuler ma réservation
          </button>
        </div>

        <!-- Réserver -->
        <div v-else>
          <button
            class="btn btn-primary btn-sm"
            :disabled="
              t.placesRestantes <= 0 ||
              t.status !== 'actif' ||
              estPasse(t)
            "
            @click="reserver(t)"
          >
            Réserver
          </button>
          <span v-if="t.placesRestantes <= 0" class="text-danger ms-2">
            Plus de places disponibles
          </span>
        </div>
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
    // Affiche uniquement les trajets autorisés
    trajetsVisibles() {
      return this.trajets.filter(t =>
        (t.status === "actif" || t.status === "annulé") && !this.estPasse(t)
      );
    }
  },

  async mounted() {
    await this.charger();
    // 🔄 Rafraîchissement automatique toutes les 5 secondes
  this.interval = setInterval(() => {
    this.charger();
  }, 5000);
  },

  methods: {
  estPasse(trajet) {
    const dt = new Date(`${trajet.date}T${trajet.heure}:00`);
    return dt <= new Date();
  },

  async charger() {
    const res = await api.get("/trajets");
    this.trajets = res.data;
  },

  reservationPourMoi(trajet) {
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
      alert("Réservation effectuée !");
      await this.charger();
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
      await this.charger();
    } catch (err) {
      alert(err.response?.data?.error || "Erreur lors de l'annulation");
    }
  }
}

};
</script>

<style scoped>
/* ----------------------------
   TITRE PRINCIPAL
----------------------------- */
h2 {
  font-weight: 700;
  color: #0057D9;
  text-align: center;
  margin-bottom: 2rem;
}

/* ----------------------------
   CARTE TRAJET
----------------------------- */
.card {
  border-radius: 14px;
  border: none;
  background: #ffffff;
  padding: 1.8rem !important;
  transition: 0.2s ease-in-out;
  box-shadow: 0 4px 14px rgba(0,0,0,0.08);
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
}

/* ----------------------------
   TEXTE DES TRAJETS
----------------------------- */
.card h5 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #003A91;
  margin-bottom: 0.6rem;
}

.card p {
  margin-bottom: 0.4rem;
  font-size: 1.05rem;
  color: #333;
}

/* ----------------------------
   BADGES (statut)
----------------------------- */
.badge {
  font-size: 0.9rem;
  padding: 6px 10px;
  border-radius: 6px;
  text-transform: capitalize;
}

/* ----------------------------
   BOUTONS
----------------------------- */
.btn {
  border-radius: 8px !important;
  padding: 7px 14px;
  font-weight: 600;
}

/* Réserver */
.btn-primary {
  background-color: #0057D9 !important;
  border-color: #0057D9 !important;
}

/* Annuler réservation */
.btn-outline-danger {
  font-weight: 600;
  border-width: 2px;
}

/* ----------------------------
   TEXTES SPÉCIAUX
----------------------------- */
.text-danger {
  font-weight: 600;
}

.text-success {
  font-weight: 600;
}

/* ----------------------------
   ALERTES
----------------------------- */
.alert-info {
  margin-top: 1rem;
  font-size: 1.05rem;
  border-radius: 12px;
  background-color: #e8f1ff;
  color: #004A99;
  border: none;
  text-align: center;
}

/* ----------------------------
   ESPACEMENT DE LA PAGE
----------------------------- */
.container {
  max-width: 900px;
  padding-bottom: 60px;
}
</style>
