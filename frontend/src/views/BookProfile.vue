<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/api'
import { useUpload } from '@/composables/useUpload'
import type { ApplicationError, Livro } from '@/types'
import { isAxiosError } from 'axios'
import { isApplicationError } from '@/composables/useApplicationError'

const route = useRoute()
const livro = ref({} as Livro)
const loading = ref(true)
const error = ref<ApplicationError>()
const uploadHelper = useUpload()

async function getLivro() {
  try {
    const { data } = await api.get(`/livros/${route.params.id}?populate=Capa`)
    livro.value = data.data.attributes
    console.log(data.data.attributes);
    
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
    <div v-else class="row justify-content-center">
      <div class="col-lg-8 col-sm-12">
        <div class="card mb-3">
          <div class="row g-0">
            <div class="col-md-4">
              <!-- Descomente se a imagem estiver disponível -->
              <img
                v-if="livro.capa" 
                :src="uploadHelper(livro.capa.data.attributes.url)"
                class="w-100 rounded-start"
                :alt="livro.nome"
              />
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">{{ livro.Nome }}</h5>
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
  