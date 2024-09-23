<script setup lang="ts">
import { ref, toRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/api'
import { useUpload } from '@/composables/useUpload'
import type { ApplicationError, Estante, Livro, Poste } from '@/types'
import { useUserStore } from '@/stores/userStore'
import { isAxiosError } from 'axios'
import { isApplicationError } from '@/composables/useApplicationError'


const posts = ref([] as Poste[])
const posts_selecionados = ref([] as Poste[])
const route = useRoute()
const router = useRouter()
const livro = ref({} as Livro)
const loading = ref(true)
const error = ref<ApplicationError>()
const uploadHelper = useUpload()
const exception = ref<ApplicationError>()

const userStore = useUserStore()


async function deletePosts() {
  try {
    const { data } = await api.get(`/posts?populate=livro.Capa,users_permissions_user.role`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`,
      },
    })
    console.log(data.data)
    posts.value = data.data.map((post: any) => ({
      id: post.id,
      Conteudo: post.attributes.Conteudo,
      Dado: post.attributes.Dado,
      Tipo: post.attributes.Tipo,
      livro: {
        id: post.attributes.livro.data.id,
        Nome: post.attributes.livro.data.attributes.Nome,
        Autor: post.attributes.livro.data.attributes.Autor,
        Genero: post.attributes.livro.data.attributes.Genero,
        Sinopse: post.attributes.livro.data.attributes.Sinopse,
        Capa: 
           {
              id: post.attributes.livro.data.attributes.Capa.data.id,
              url: post.attributes.livro.data.attributes.Capa.data.attributes.url,
            },
        Nota: post.attributes.livro.data.attributes.Nota,
        nCapitulos: post.attributes.livro.data.attributes.nCapitulos,
      },
      users_permissions_user: {
        id: post.attributes.users_permissions_user.data.id,
        username: post.attributes.users_permissions_user.data.attributes.username,
        role: post.attributes.users_permissions_user.data.attributes.role,
        email: post.attributes.users_permissions_user.data.attributes.email,
      }
    }));
    console.log(posts)
    const idParam = Number(route.params.id)
    for (let i = 0; i < posts.value.length; i++){
      if(posts.value[i].livro.id == idParam){
        posts_selecionados.value.push(posts.value[i])
      }
    }
    console.log(posts_selecionados)

    for (let item of posts_selecionados.value) {
    await api.delete(`/posts/${item.id}`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`,
      },
    });
  }

  } catch (error) {
    console.error('Erro ao deletar itens:', error);
  }
}


async function apagarLivro() {
    try {
    await deletePosts()

    const { data } = await api.delete(`/livros/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`
      }
    })

    
    router.replace('/admin');
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data
    }
  } finally {
    loading.value = false
  }
  
  
}

async function getLivro() {
  
  try {
    const { data } = await api.get(`/livros/${route.params.id}?populate=Capa`)
    livro.value = {
      id: data.data.id,
      Nome: data.data.attributes.Nome, // Certifique-se de que a chave esteja correta
      Autor: data.data.attributes.Autor,
      Genero: data.data.attributes.Genero,
      Sinopse: data.data.attributes.Sinopse,
      Nota: data.data.attributes.Nota,
      Capa: data.data.attributes.Capa, // Certifique-se de que a estrutura da Capa esteja correta
      nCapitulos: data.data.attributes.nCapitulos,
    };
    //console.log("getlivro")
    //console.log(livro);
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      error.value = e.response?.data
    }
  } finally {
    loading.value = false
  }
}


getLivro()
</script>

<template>
  <div v-if="error" class="alert alert-danger" role="alert">
    {{ error.error.message }}
  </div>
  
  <div v-if="loading" class="spinner-grow" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
  
  <div v-else class="row justify-content-center main-container">
    <div class="col-lg-8 col-sm-12">
      <div class="card mb-3">
        <div class="row g-0">
          <div class="col-md-4">
            <img
              v-if="livro.Capa" 
              :src="uploadHelper(livro.Capa.url)"
              class="w-100 rounded-start"
              :alt="livro.Nome"
            />
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">{{ livro.Nome }}</h5>
                <button class="btn fs-1" @click="apagarLivro">
                  <i class="bi bi-trash"></i>
                </button>
                <RouterLink :to="`/admin/editarlivro/${route.params.id}`"> 
                  <button class="btn fs-1">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                </RouterLink>
              </div>
              <hr />
              
              <div class="text-start">
                <p class="card-text">Autor(a): {{ livro.Autor }}</p>
                <p class="card-text">
                  <strong>
                    Gênero: <small class="text-danger">{{ livro.Genero }}</small>
                  </strong>
                </p>
                <p class="card-text">
                  Sinopse: {{ livro.Sinopse }}
                </p>
                <p class="card-text">
                  Nota: {{ livro.Nota }}/5
                </p>
                <p class="card-text">
                  Capítulos: {{ livro.nCapitulos }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  background-color: purple;
  min-height: 100vh;
  padding: 20px; 
}

.btn {
  font-size: 16px; /* Diminui o tamanho da fonte */
  width: 30px; /* Ajusta a largura dos botões */
  height: 30px; /* Ajusta a altura dos botões */
  margin-left: 5px; /* Espaçamento entre os botões */
  padding: 0; /* Remove o padding padrão */
  display: flex; /* Flex para centralizar o ícone */
  align-items: center;
  justify-content: center;
}
</style>