import { createRouter, createWebHistory } from "vue-router";
// import des différents URL (chemin)
import Home from "../pages/Home.vue";
import About from "../pages/About.vue";
import AuthUser from "../pages/AuthUser.vue";
import ListeTrajets from "../pages/ListeTrajets.vue";
import MesTrajets from "../pages/MesTrajets.vue";
import AjoutTrajet from "../pages/AjoutTrajet.vue";
import Historique from "../pages/Historique.vue";
import ProfilUser from "../pages/ProfilUser.vue";
import Trajets from "../pages/Trajets.vue";
// path : URL ; les autres sont composants
const routes = [
  { path: "/", component: Home },
  { path: "/a-propos", component: About },
  { path: "/auth", component: AuthUser },

  // LISTE DES TRAJETS (version passager)
  { path: "/trajets", component: ListeTrajets },

  // VERSION FILTRÉE (Trajets.vue)
  { path: "/trajets-public", component: Trajets },

  // CONDUCTEUR
  {
    path: "/mes-trajets",
    component: MesTrajets,
    meta: { requiresAuth: true, role: "conducteur" }
    //requiresAuth :LA page necessite un connexion 
    //role : seulement pour les conducteurs 
  },
  {
    path: "/ajout-trajet",
    component: AjoutTrajet,
    meta: { requiresAuth: true, role: "conducteur" }
  },

  // HISTORIQUE / PROFIL (passager ou conducteur)
  {
    path: "/historique",
    component: Historique,
    meta: { requiresAuth: true }
  },
  {
    path: "/profil",
    component: ProfilUser,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});


// Middleware de sécurité

router.beforeEach((to, from, next) => {// fonction exécutée avant chaque chargement de la page (to la page où on va et from la page actuelle)
  const raw = localStorage.getItem("user");// récupère l'utilisateur connecté
  const user = raw ? JSON.parse(raw) : null;// s'il existe on le convertit en objet dans le cas contraire en null

  //  Vérifie si la page est protégée
  if (to.meta.requiresAuth && !user) {//Si la page nécessite une connexion (meta.requiresAuth)

                                         // Et que l’utilisateur n’est pas connecté

                                        //→ on redirige vers /auth.
    return next("/auth");
  }

  // Vérifie le rôle requis
  if (to.meta.role && user && user.role !== to.meta.role) {
    return next("/");
  }

  next();
});

export default router;
