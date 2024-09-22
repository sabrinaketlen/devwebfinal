import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

import VerPost from '../views/VerPost.vue'
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'
import BookProfile from '../views/BookProfile.vue'
import Estante from '../views/Estante.vue'
import NotFound from '../views/NotFound.vue'
import Cadastro from '../views/Cadastro.vue'
import FazerPost from '../views/FazerPost.vue'
import adminHome from '@/views/admin/adminHome.vue'
import BookProfile4admin from '@/views/admin/BookProfile4admin.vue'
import ManageBook from '@/views/admin/ManageBook.vue'

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
      path: '/cadastro',
      name: 'cadastro',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: Cadastro
    },
    {
      path: '/livros/:id',
      name: 'livro',
      component: BookProfile,

    },
    {
      path: '/estante/:username',
      name: 'estante',
      component: Estante,
      meta: {
        requiresAuth: true
      }

    },
    {
      path: '/posts/:username',
      name: 'posts',
      component: FazerPost,
      meta: {
        requiresAuth: true
      }

    },
    {
      path: '/post/:id',
      name: 'post',
      component: VerPost,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/posts/editar/:id',
      name: 'editar posts',
      component: FazerPost,
      meta: {
        requiresAuth: true
      }
    },

    {
      path: '/admin',
      name: 'CRIAR',
      component: adminHome,
      meta: {
        requiresAuth: true,
        role: 'Organizador',
      },
    },
    {
      path: '/admin/livros/:id',
      name: 'LIVROS ADMIN',
      component: BookProfile4admin,
      meta: {
        requiresAuth: true,
        role: 'Organizador',
      },
    },
    {
      path: '/admin/editarlivro/:id',
      name: 'EDITAR LIVRO',
      component: ManageBook,
      meta: {
        requiresAuth: true,
        role: 'Organizador',
      },
    },
    {
      path: '/admin/criarlivro/:username',
      name: 'CRIAR LIVRO',
      component: ManageBook,
      meta: {
        requiresAuth: true,
        role: 'Organizador',
      },
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
  if (to.meta.role && userStore.user.role.name !== to.meta.role) {
    return '/unauthorized'
  }
})
