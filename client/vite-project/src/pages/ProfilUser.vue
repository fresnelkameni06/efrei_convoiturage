<template>
  <div class="container mt-4">
    <h2>Mon profil</h2>

    <div class="card p-3 shadow-sm" v-if="user">
      <p><strong>Nom :</strong> {{ user.nom }}</p>
      <p><strong>Prénom :</strong> {{ user.prenom }}</p>
      <p><strong>Email :</strong> {{ user.email }}</p>
      <p><strong>Rôle :</strong> {{ user.role }}</p>

      <button class="btn btn-danger mt-3" @click="logout">
        Se déconnecter
      </button>
    </div>

    <div v-else class="alert alert-warning">
      Vous devez être connecté pour voir votre profil.
    </div>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user") || "null")
    };
  },
  methods: {
    async logout() {
      try {
        await api.post("/auth/logout");
      } catch (_) {}

      localStorage.removeItem("user");
      this.$router.push("/");
   
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 700px;
  padding-bottom: 40px;
}

h2 {
  font-weight: 700;
  color: #0056D2;
  margin-bottom: 1.5rem;
}

/* --- Carte profil --- */
.card {
  border-radius: 14px;
  border: none;
  background: #ffffff;
  box-shadow: 0 4px 14px rgba(0,0,0,0.08);
  padding: 2rem !important;
}

.card p {
  font-size: 1.1rem;
  color: #444;
  margin-bottom: 0.8rem;
}

.card strong {
  color: #003A91;
}

.btn-danger {
  border-radius: 8px !important;
  padding: 10px 18px;
  font-weight: 600;
  background-color: #D90429 !important;
  border-color: #D90429 !important;
}

/* --- Alerte non connecté --- */
.alert-warning {
  border-radius: 10px;
  font-weight: 500;
  background-color: #fff8e1;
  color: #7a5a00;
}
</style>
