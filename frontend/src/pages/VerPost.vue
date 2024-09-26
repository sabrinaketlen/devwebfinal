
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { ApplicationError, Poste } from '@/types'
import { isAxiosError } from 'axios';
import { isApplicationError } from '@/composables/useApplicationError';
import { useUserStore } from '@/stores/userStore'
import { api } from '@/api';


import Post from '../components/Post.vue';

const exception = ref<ApplicationError>()
const userStore = useUserStore()
const loading = ref(true)
const error = ref<ApplicationError>()

const user_id = userStore.user.id
const router = useRouter()
const route = useRoute()
const post = ref({} as Poste)
const post_owner = ref(false)

async function getPost() {
  try {
    const { data } = await api.get(`/posts/${route.params.id}?populate=livro.Capa,users_permissions_user`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`,
      },
    })
    console.log(data.data)
    
    post.value = data.data
    
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      error.value = e.response?.data
      router.push('/NotFound');
    }

  } finally {
    loading.value = false
  }
  
}

async function apagarPost() {
    try {
    const { data } = await api.delete(`/posts/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`
      }
    })
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data
    }
  } finally {
    loading.value = false
  }
  
  router.push(`/livros/${post.value.livro.id}`);
}
getPost()

</script>

<template>
    <div class="position-relative">
      <span v-if="post.livro" class="badge text-bg-warning">Post sobre {{ post.livro.Nome }}</span>
      
      <!-- Post component -->
      <div class="post-content">
        <Post
          :key="post.id"
          :id="post.id"
          :Conteudo="post.Conteudo"
          :Dado="post.Dado"
          :Tipo="post.Tipo"
          :livro="post.livro"
          :users_permissions_user="post.users_permissions_user"
        />
      </div>
      
      <!-- Ícones com v-if para mostrar apenas se o usuário for o dono do post -->
      <div v-if="post_owner" class="icon-container">
        <RouterLink :to="`/editarpost/${post.id}`">
        <button class="btn btn-info" title="Editar Post">
          <i class="bi bi-pencil-square"></i>
        </button>
        </RouterLink>
        <button class="btn btn-danger" @click="apagarPost()" title="Apagar Post">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>
  </template>

<style scoped>
.position-relative {
  position: relative;
}

.icon-container {
  position: absolute;
  top: 10px; 
  right: 10px; 
  display: flex;
  flex-direction: column;
}

.icon-container button {
  margin-bottom: 10px; 
}
</style>
