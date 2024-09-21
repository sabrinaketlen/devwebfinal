<script setup lang="ts">

import { ref, toRaw } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/api'
import { useUpload } from '@/composables/useUpload'
import type { ApplicationError, Estante, Livro, Poste } from '@/types'
import { useUserStore } from '@/stores/userStore'
import { isAxiosError } from 'axios'
import { isApplicationError } from '@/composables/useApplicationError'
import Post from '@/components/Post.vue';


const posts = ref('')
const posts_selecionados = ref([])
const route = useRoute()
const livro = ref({} as Livro)
const loading = ref(true)
const error = ref<ApplicationError>()
const uploadHelper = useUpload()
const estante = ref({} as Estante)

const feedback = ref('')
const userStore = useUserStore()
const user_id = userStore.user.id

const isBookInEstante = ref(false)

async function getLivro() {
  try {
    const { data } = await api.get(`/livros/${route.params.id}?populate=Capa`)
    livro.value = data.data
    //console.log("getlivro")
    //console.log(livro._rawValue);
    
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
                  <template v-if="userStore.user.role.name != 'Organizador'">
                    <button class="btn fs-1" @click="toggleBookInEstante">
                      <span v-if="isBookInEstante" class="bi bi-bookmark-check-fill"></span>
                      <span v-else class="bi bi-bookmark-plus"></span>
                    </button>
                  </template>
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
      <template v-if="userStore.user.role.name != 'Organizador'">
        <div v-for="posti in posts_selecionados">
          <RouterLink :to="`/post/${posti.id}`" class="text-decoration-none">
            <div>
              <Post
      
                :key="posti.id"
                :conteudo = "posti.attributes.Conteudo"
                :dado= "posti.attributes.Dado"
                :tipo= "posti.attributes.Tipo"
                :livro= "posti.attributes.livro"
                :user= "posti.attributes.users_permissions_user.data.attributes.username"
                :id= "posti.id"
              />
            </div>
          </RouterLink>
        </div>
    </template>
      
    </div>
  </template>
</template>