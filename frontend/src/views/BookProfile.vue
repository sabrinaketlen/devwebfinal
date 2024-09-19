<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/api'
import { useUpload } from '@/composables/useUpload'
import type { ApplicationError, Estante, Livro } from '@/types'
import { useUserStore } from '../stores/userStore'
import { isAxiosError } from 'axios'
import { isApplicationError } from '@/composables/useApplicationError'

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

async function checkIfBookInEstante() {
  try {
    const { data } = await api.get(`/estantes/${user_id}?populate=livros`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`,
      },
    })

    // Verifica se o livro está na estante
    let found = false
    for (let i = 0; i < data.data.attributes.livros.data.length; i++) {
    
        if (data.data.attributes.livros.data[i].id == route.params.id) {
            found = true
            break
        }
    }

    isBookInEstante.value = found
  } catch (e) {
    console.error('Erro ao checar estante', e)
  }
}

checkIfBookInEstante()

async function toggleBookInEstante() {
  const action = isBookInEstante.value ? 'remove' : 'add'

  try {
    loading.value = true

    const { data } = await api.get(`/estantes/${user_id}?populate=livros`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`,
      },
    })

    const currentLivros = data.data.attributes.livros.data.map((livro: any) => livro.id)

    if (action === 'add') {
      currentLivros.push(livro.value.id)
    } else if (action === 'remove') {
      const index = currentLivros.indexOf(livro.value.id)
      if (index > -1) {
        currentLivros.splice(index, 1)
      }
    }

    const payload = {
      livros: currentLivros, 
    }
    console.log('Payload enviado:', payload)
    

    const response = await api.put(`/estantes/${user_id}`, payload, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`,
        'Content-Type': 'application/json', 
      },
    })

    console.log('Resposta da API:', response.data)

    isBookInEstante.value = action === 'add'
    feedback.value = action === 'add'
      ? 'Livro adicionado à estante com sucesso.'
      : 'Livro removido da estante com sucesso.'
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
    livro.value = data.data.attributes
    //console.log(data.data.attributes);
    
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
              <!-- DANDO PROBLEMA -->
              <img
                v-if="livro.capa" 
                :src="uploadHelper(livro.capa.data.attributes.url)"
                class="w-100 rounded-start"
                :alt="livro.nome"
              />
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <h5 class="card-title mb-0">{{ livro.Nome }}</h5>
                  <button class="btn fs-1" @click="toggleBookInEstante">
                    <i v-if="isBookInEstante" class="bi bi-bookmark-check-fill"></i>
                    <i v-else class="bi bi-bookmark-plus"></i>
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
    </div>
  </template>
  