<template>
  <div class="container mt-4">
    <h2>Publier un trajet</h2>

    <!-- Vérification rôle -->
    <div v-if="!user || user.role !== 'conducteur'" class="alert alert-danger">
      Accès refusé — seuls les conducteurs peuvent publier un trajet.
    </div>

    <form v-else @submit.prevent="publier">
      <div class="mb-3">
        <label>Départ</label>
        <input v-model="form.depart" class="form-control" required />
      </div>

      <div class="mb-3">
        <label>Destination</label>
        <input v-model="form.destination" class="form-control" required />
      </div>

      <div class="mb-3">
        <label>Date</label>
        <input type="date" v-model="form.date" class="form-control" required />
      </div>

      <div class="mb-3">
        <label>Heure</label>
        <input type="time" v-model="form.heure" class="form-control" required />
      </div>

      <div class="mb-3">
        <label>Places disponibles</label>
        <input
          type="number"
          min="1"
          v-model.number="form.placesTotal"
          class="form-control"
          required
        />
      </div>

      <button class="btn btn-primary">Publier</button>
    </form>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user") || "null"),
      form: {
        depart: "",
        destination: "",
        date: "",
        heure: "",
        placesTotal: 1,
      },
    };
  },
  methods: {
    async publier() {
      // Vérif date/heure dans le futur (UX)
      const now = new Date();
      const dt = new Date(`${this.form.date}T${this.form.heure}:00`);
      if (dt <= now) {
        alert("La date et l’heure doivent être dans le futur.");
        return;
      }

      try {
        await api.post(
          "/trajets",
          {
            conducteurId: this.user.id,
            ...this.form,
          },
          { withCredentials: true }
        );

        alert("Trajet publié !");
        this.$router.push("/mes-trajets");
      } catch (err) {
        alert(err.response?.data?.error || "Erreur lors de la publication");
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 750px;
  margin-top: 3rem;
  padding: 2.5rem 2.5rem;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
}

/* Titre principal */
h2 {
  font-weight: 700;
  font-size: 1.9rem;
  color: #0056D2;
  margin-bottom: 1.5rem;
}

/* Labels */
label {
  font-weight: 600;
  color: #333;
}

/* Inputs */
.form-control {
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ced4da;
  font-size: 1rem;
}

.form-control:focus {
  border-color: #0056D2;
  box-shadow: 0 0 0 0.15rem rgba(0, 86, 210, 0.25);
}

/* Le bouton publier */
button.btn-primary {
  margin-top: 5px;
  padding: 0.65rem 1.5rem;
  font-size: 1.1rem;
  border-radius: 8px;
}

/* Message d'accès refusé */
.alert-danger {
  font-size: 1.1rem;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
}

/* Transition douce */
* {
  transition: all 0.2s ease-in-out;
}
</style>
