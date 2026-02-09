<template>
  <div class="container mt-4">
    <h2>Mes trajets</h2>

    <div v-if="mesTrajets.length === 0" class="alert alert-info">
      Aucun trajet publié pour le moment.
    </div>

    <!-- LISTE DES TRAJETS -->
    <div
      v-for="t in mesTrajets"
      :key="t.id"
      class="card mb-3 p-3 shadow-sm"
    >
      <h5>{{ t.depart }} → {{ t.destination }}</h5>
      <p>Date : {{ t.date }} | Heure : {{ t.heure }}</p>

      <p>
        Places : {{ t.placesRestantes }} / {{ t.placesTotal }} |
        Réservations : {{ (t.reservations || []).length }}
      </p>

      <p>
        Statut :
        <span
          class="badge"
          :class="t.status === 'annulé'
                    ? 'bg-danger'
                    : (t.status === 'effectué'
                        ? 'bg-secondary'
                        : 'bg-success')"
        >
          {{ t.status }}
        </span>
      </p>

      <div class="d-flex gap-2">

        <!-- MODIFIER : possible seulement si :
             - statut actif
             - 0 réservation
             - date/heure PAS dépassées -->
        <button
          class="btn btn-primary btn-sm"
          :disabled="
            t.status !== 'actif' ||
            (t.reservations && t.reservations.length > 0) ||
            estPasse(t)
          "
          @click="ouvrirModal(t)"
        >
          Modifier
        </button>

        <!-- SUPPRIMER : possible seulement si :
             - 0 réservation
             - date/heure pas dépassées -->
        <button
          class="btn btn-danger btn-sm"
          :disabled="
            (t.reservations && t.reservations.length > 0) ||
            estPasse(t)
          "
          @click="supprimer(t.id)"
        >
          Supprimer
        </button>

        <!-- ANNULER : possible seulement si :
             - 1 ou + réservations
             - date/heure pas dépassées
             - statut actif -->
        <button
          class="btn btn-warning btn-sm"
          :disabled="
            t.status !== 'actif' ||
            !t.reservations ||
            !t.reservations.length ||
            estPasse(t)
          "
          @click="annuler(t.id)"
        >
          Annuler le trajet
        </button>
      </div>
    </div>

    <!-- MODAL MODIFICATION -->
    <div
      class="modal fade"
      id="editTrajetModal"
      tabindex="-1"
      aria-hidden="true"
      ref="editModal"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="modifierTrajet">
            <div class="modal-header">
              <h5 class="modal-title">Modifier le trajet</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                @click="fermerModal"
              ></button>
            </div>

            <div class="modal-body">
              <div class="mb-3">
                <label>Départ</label>
                <input v-model="editTrajet.depart" class="form-control" required />
              </div>

              <div class="mb-3">
                <label>Destination</label>
                <input v-model="editTrajet.destination" class="form-control" required />
              </div>

              <div class="mb-3">
                <label>Date</label>
                <input
                  type="date"
                  v-model="editTrajet.date"
                  class="form-control"
                  required
                />
              </div>

              <div class="mb-3">
                <label>Heure</label>
                <input
                  type="time"
                  v-model="editTrajet.heure"
                  class="form-control"
                  required
                />
              </div>

              <div class="mb-3">
                <label>Places totales</label>
                <input
                  type="number"
                  min="1"
                  v-model.number="editTrajet.placesTotal"
                  class="form-control"
                  required
                />
              </div>
            </div>

            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                @click="fermerModal"
              >
                Fermer
              </button>

              <button type="submit" class="btn btn-success">
                Enregistrer
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import api from "../services/api";
import * as bootstrap from "bootstrap";

export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user") || "null"),
      trajets: [],
      editTrajet: {},
      modalInstance: null
    };
  },

  computed: {
    mesTrajets() {
      if (!this.user) return [];
      return this.trajets.filter(
        t => t.conducteurId === this.user.id && t.status !== "effectué"
      );
    }
  },

  async mounted() {
    await this.charger();
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

    async supprimer(id) {
      if (!confirm("Supprimer ce trajet ?")) return;
      try {
        await api.delete(`/trajets/${id}`, {
          data: { conducteurId: this.user.id }
        });
        await this.charger();
      } catch (err) {
        alert(err.response?.data?.error || "Erreur lors de la suppression");
      }
    },

    async annuler(id) {
      if (!confirm("Annuler ce trajet ?")) return;
      try {
        await api.put(`/trajets/bloquer/${id}`, {
          conducteurId: this.user.id
        });
        await this.charger();
      } catch (err) {
        alert(err.response?.data?.error || "Erreur lors de l'annulation");
      }
    },

    ouvrirModal(trajet) {
      this.editTrajet = { ...trajet };
      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal(this.$refs.editModal);
      }
      this.modalInstance.show();
    },

    fermerModal() {
      if (this.modalInstance) {
        this.modalInstance.hide();
      }
      this.editTrajet = {};
    },

    async modifierTrajet() {
      try {
        await api.put(`/trajets/${this.editTrajet.id}`, {
          conducteurId: this.user.id,
          ...this.editTrajet
        });
        alert("Trajet modifié !");
        this.fermerModal();
        await this.charger();
      } catch (err) {
        alert(err.response?.data?.error || "Erreur lors de la modification");
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

/* --- Carte des trajets --- */
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
  margin: 0.35rem 0;
  color: #444;
  font-size: 1rem;
}

/* --- Badges statut --- */
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

.bg-secondary {
  background-color: #6c757d !important;
}

/* --- Boutons --- */
button {
  border-radius: 8px !important;
  font-weight: 600;
  padding: 6px 14px;
}

.btn-primary {
  background-color: #0056D2 !important;
  border-color: #0056D2 !important;
}

.btn-danger {
  background-color: #D90429 !important;
  border-color: #D90429 !important;
}

.btn-warning {
  background-color: #F6A800 !important;
  border-color: #F6A800 !important;
  color: black !important;
}

/* --- Alerte info --- */
.alert-info {
  background-color: #e9f2ff;
  color: #0056D2;
  border-radius: 10px;
  font-weight: 500;
}

/* --- Modal --- */
.modal-content {
  border-radius: 14px !important;
  border: none !important;
  box-shadow: 0 4px 14px rgba(0,0,0,0.15);
}

.modal-title {
  font-weight: 700;
  color: #0056D2;
}

.modal-header,
.modal-footer {
  border: none !important;
}

.modal-body label {
  font-weight: 600;
  color: #333;
}

.modal-body input {
  border-radius: 8px !important;
  padding: 10px !important;
}
</style>
