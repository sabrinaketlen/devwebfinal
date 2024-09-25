import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

import VerPost from '../pages/VerPost.vue'
import HomeView from '../pages/HomeView.vue'
import Login from '../pages/Login.vue'
import BookProfile from '../pages/BookProfile.vue'
import Estante from '../pages/Estante.vue'
import NotFound from '../pages/NotFound.vue'
import Cadastro from '../pages/Cadastro.vue'
import FazerPost from '../pages/FazerPost.vue'
import adminHome from '@/pages/Admin/adminHome.vue'
import BookProfile4admin from '@/pages/Admin/BookProfile4admin.vue'
import ManageBook from '@/pages/Admin/ManageBook.vue'
import Unauthorized from '@/pages/Unauthorized.vue'

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
      path: '/fazerpost',
      name: 'fazer posts',
      component: FazerPost,
      meta: {
        requiresAuth: true
      }

    },
    {
      path: '/editarpost/:id',
      name: 'editar posts',
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
      path: '/admin/criarlivro',
      name: 'CRIAR LIVRO',
      component: ManageBook,
      meta: {
        requiresAuth: true,
        role: 'Organizador',
      },
    },
    {
      path: '/NotFound',
      name: "NOT FOUND",
      component: NotFound
    },
    {
      path: '/unauthorized',
      name: "unauthorized",
      component: Unauthorized
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
