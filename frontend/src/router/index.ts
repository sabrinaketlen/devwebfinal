import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'
import BookProfile from '../views/BookProfile.vue'
import Estante from '../views/Estante.vue'
import NotFound from '../views/NotFound.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: Login
    },
    {
      path: '/livros/:id',
      name: 'livro',
      component: BookProfile, // Componente que mostrará os detalhes do livro
      // Habilita a passagem do parâmetro `id` como propriedade
    },
    {
      path: '/estante/:id',
      name: 'estante',
      component: Estante, // Componente que mostrará os detalhes do livro
      meta: {
        requiresAuth: true
      }
      // Habilita a passagem do parâmetro `id` como propriedade
    },
    { path: '/:pathMatch(.*)*', component: NotFound },
  ]
})

export default router

router.beforeEach((to, from) => {
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return '/login'
  }
})
