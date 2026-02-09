<template>
  <div class="container mt-4">
    <h2>Historique de mes trajets</h2>

    
          //HISTORIQUE CONDUCTEUR
   
    <div v-if="user.role === 'conducteur'">
      <h4 class="mt-3">En tant que conducteur</h4>

      <div v-if="historiqueConducteur.length === 0" class="alert alert-info">
        Aucun trajet effectué.
      </div>

      <div
        v-for="t in historiqueConducteur"
        :key="t.id"
        class="card mb-3 p-3 shadow-sm"
      >
        <h5>{{ t.depart }} → {{ t.destination }}</h5>
        <p>Date : {{ t.date }} | Heure : {{ t.heure }}</p>
        <p>Réservations : {{ (t.reservations || []).length }}</p>
      </div>
    </div>

    <!--HISTORIQUE PASSAGER-->
    <div v-else>
      <h4 class="mt-3">En tant que passager</h4>

      <div v-if="historiquePassager.length === 0" class="alert alert-info">
        Aucun trajet effectué.
      </div>

      <div
        v-for="t in historiquePassager"
        :key="t.id"
        class="card mb-3 p-3 shadow-sm"
      >
        <h5>{{ t.depart }} → {{ t.destination }}</h5>
        <p>Date : {{ t.date }} | Heure : {{ t.heure }}</p>
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
    historiqueConducteur() {
      if (!this.user || this.user.role !== "conducteur") return [];

      return this.trajets.filter(
        t =>
          Number(t.conducteurId) === Number(this.user.id) &&
          t.status === "effectué"
      );
    },

    historiquePassager() {
      if (!this.user || this.user.role !== "passager") return [];

      return this.trajets.filter(
        t =>
          t.status === "effectué" &&
          (t.reservations || []).some(r => r.passagerId === this.user.id)
      );
    }
  },

  async mounted() {
    const res = await api.get("/trajets");
    this.trajets = res.data;
  },

  watch: {
    async $route() {
      const res = await api.get("/trajets");
      this.trajets = res.data;
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

h4 {
  font-weight: 600;
  color: #003A91;
  margin-top: 1.8rem;
  margin-bottom: 1rem;
}

.card {
  border-radius: 12px;
  border: none;
  background: white;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.12);
}

.card h5 {
  font-weight: 700;
  color: #0056D2;
}

p {
  margin: 0.3rem 0;
  color: #444;
  font-size: 1rem;
}

.alert-info {
  border-radius: 10px;
  background-color: #e9f2ff;
  color: #0056D2;
  font-weight: 500;
}
</style>
