<script setup lang="ts">
import { ref, toRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/api'
import { useUpload } from '@/composables/useUpload'
import type { ApplicationError, Estante, Livro, Poste } from '@/types'
import { useUserStore } from '../stores/userStore'
import { isAxiosError } from 'axios'
import { isApplicationError } from '@/composables/useApplicationError'
import Post from '../components/Post.vue';

const router = useRouter()
const posts = ref([] as Poste[])
const route = useRoute()
const livro = ref({} as Livro)
const loading = ref(true)
const error = ref<ApplicationError>()
const uploadHelper = useUpload()
const estante = ref({} as Estante)

const feedback = ref('')
const userStore = useUserStore()
const isAuthenticated = userStore.isAuthenticated;
const user_id = userStore.user.id

const isBookInEstante = ref(false)

async function getEstante() {
  const { data } = await api.get(`/estantes?populate=livros.Capa, users_permissions_user&filters[users_permissions_user][id]=${user_id}`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`,
      },
    });
    console.log(data.data)
    estante.value = data.data[0]
    console.log(estante.value.livros)
}

async function getPosts() {
  try {
    const { data } = await api.get(`/livros?populate=posts.livro, posts.users_permissions_user&filters[id][$eq]=${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`,
      },
    })
    console.log(data.data[0])
    if(data.data[0] == undefined){
      throw new Error();
    }
    posts.value = data.data[0].posts
    
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      error.value = e.response?.data
    }
    router.push('/NotFound')
  } finally {
    loading.value = false
  }
  
}

async function checkIfBookInEstante() {
  await getLivro()
  try {
    await getEstante()
    await getPosts()

    let achado = false
    const idParam = Number(route.params.id);
    console.log(estante.value.livros)

    for (const livro of estante.value.livros) {
        if (livro.id == idParam ) {
            achado = true
            break
        }
    }

    isBookInEstante.value = achado
  } catch (e) {
    console.error('Erro ao checar estante', e)
  }
}

async function toggleBookInEstante() {
  if (!isAuthenticated) {
    router.push('/login');
    return; 
  }

  checkIfBookInEstante()
  const action = isBookInEstante.value ? 'remove' : 'add'

  try {
    loading.value = true
    
    
    console.log(estante.value)

    let currentLivros_id: number[] = [];

    for (let i = 0; i < estante.value.livros.length; i++) {
      currentLivros_id.push(estante.value.livros[i].id)
    }
    console.log(currentLivros_id)
    console.log(livro.value.id)
  

    if (action == 'add') {
      //console.log("tentei add");
      currentLivros_id.push(livro.value.id)
      console.log(currentLivros_id);
    } else if (action == 'remove') {
      //console.log("tentei remover");
      let indexToRemove = -1; 
      for (let i = 0; i < currentLivros_id.length; i++) {
        if (currentLivros_id[i] === livro.value.id) {
          indexToRemove = i; 
          break;
        }
      }
      if (indexToRemove > -1) {
        currentLivros_id.splice(indexToRemove, 1);
        console.log(currentLivros_id);
      }
    }
    const newdata = {
      data: {
        livros: currentLivros_id
      }
    };

    console.log('Payload enviado:', newdata)
    

    const { data } = await api.put(`/estantes/${estante.value.id}`, newdata, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`,
      },
    });
    checkIfBookInEstante()
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      error.value = e.response?.data
      feedback.value = error.value.error.message
    } else {
      console.error('Erro inesperado:', e)
    }
  } finally {
    loading.value = false
  }
}

async function getLivro() {
  try {
    const { data } = await api.get(`/livros/${route.params.id}?populate=Capa`)
    livro.value = data.data
    console.log(livro.value)
    
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      error.value = e.response?.data
    }
  } finally {
    loading.value = false
  }
}



checkIfBookInEstante()

</script>

<template>
    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error.error.message }}
    </div>
    
    <div v-if="loading" class="spinner-grow" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    
    <div v-else class="row justify-content-center">
      <div class="col-lg-8 col-sm-12">
        <div class="card mb-3">
          <div class="row g-0">
            <div class="col-md-4">
              <!-- DANDO PROBLEMA -->
              <img
                v-if="livro.Capa.url" 
                :src="uploadHelper(livro.Capa.url)"
                class="w-100 rounded-start"
                :alt="livro.Nome"
              />
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <h5 class="card-title mb-0">{{ livro.Nome }}</h5>
                    <button class="btn fs-1" @click="toggleBookInEstante">
                      <span v-if="isBookInEstante" class="bi bi-bookmark-check-fill"></span>
                      <span v-else class="bi bi-bookmark-plus"></span>
                    </button>
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
      <RouterLink 
      v-for="post in posts" 
      :to="`/post/${post.id}`" 
      class="text-decoration-none">
        <Post
        :key="post.id"
        :id="post.id"
        :Conteudo="post.Conteudo"
        :Dado="post.Dado"
        :Tipo="post.Tipo"
        :livro="post.livro"
        :users_permissions_user="post.users_permissions_user"
        />
    </RouterLink>
    </div>
  </template>
  