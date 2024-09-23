
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
const post_owner = ref(0)

//parei aqui, JA ESTA PEGANDO O POST
//preciso sinalizar qual o livro na pagina do post
//preciso botar botao de editar ou excluir post

async function getPost() {
  try {
    const { data } = await api.get(`/posts/${route.params.id}?populate=livro.Capa,users_permissions_user.role`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`,
      },
    })
    console.log(data.data)
    post.value = {
      id: data.data.id,
      Conteudo: data.data.attributes.Conteudo,
      Dado: data.data.attributes.Dado,
      Tipo: data.data.attributes.Tipo,
      livro: {
        id: data.data.attributes.livro.data.id,
        Nome: data.data.attributes.livro.data.attributes.Nome,
        Autor: data.data.attributes.livro.data.attributes.Autor,
        Genero: data.data.attributes.livro.data.attributes.Genero,
        Sinopse: data.data.attributes.livro.data.attributes.Sinopse,
        Capa: 
           {
              id: data.data.attributes.livro.data.attributes.Capa.data.id,
              url: data.data.attributes.livro.data.attributes.Capa.data.attributes.url,
            },
        Nota: data.data.attributes.livro.data.attributes.Nota,
        nCapitulos: data.data.attributes.livro.data.attributes.nCapitulos,
      },
      users_permissions_user: {
        id: data.data.attributes.users_permissions_user.data.id,
        username: data.data.attributes.users_permissions_user.data.attributes.username,
        role: data.data.attributes.users_permissions_user.data.attributes.role,
        email: data.data.attributes.users_permissions_user.data.attributes.email,
      }
    }

    console.log(post)
    post_owner.value = post.value.users_permissions_user.id

    console.log(post_owner.value)
    console.log(user_id)
    if(post_owner.value != user_id){
        console.log("NAO EH MEU POST")
    }
    console.log("a doidera dando certo")

    //console.log(livro._rawValue);
    
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      error.value = e.response?.data
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
      <div v-if="post_owner == user_id" class="icon-container">
        <RouterLink :to="`/posts/editar/${post.id}`">
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
