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
const estante = ref({} as Estante)

const feedback = ref('')
const userStore = useUserStore()
const user_id = userStore.user.id

const isBookInEstante = ref(false)

async function deletePosts() {
  try {
    const { data } = await api.get(`/posts?populate=livro`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`,
      },
    })

    posts.value = data.data
    console.log(posts)
    for (let i = 0; i < posts._rawValue.length; i++){
      if(posts._rawValue[i].attributes.livro.data.id == route.params.id){
        posts_selecionados.value.push(posts._rawValue[i])
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
    livro.value = data.data
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
              v-if="livro.attributes.Capa" 
              :src="uploadHelper(livro.attributes.Capa.data.attributes.url)"
              class="w-100 rounded-start"
              :alt="livro.nome"
            />
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">{{ livro.attributes.Nome }}</h5>
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
                <p class="card-text">Autor(a): {{ livro.attributes.Autor }}</p>
                <p class="card-text">
                  <strong>
                    Gênero: <small class="text-danger">{{ livro.attributes.Genero }}</small>
                  </strong>
                </p>
                <p class="card-text">
                  Sinopse: {{ livro.attributes.Sinopse }}
                </p>
                <p class="card-text">
                  Nota: {{ livro.attributes.Nota }}/5
                </p>
                <p class="card-text">
                  Capítulos: {{ livro.attributes.nCapitulos }}
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