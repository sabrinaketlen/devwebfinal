<script setup lang="ts">
import { ref, toRaw } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/api'
import { useUpload } from '@/composables/useUpload'
import type { ApplicationError, Estante, Livro, Poste } from '@/types'
import { useUserStore } from '@/stores/userStore'
import { isAxiosError } from 'axios'
import { isApplicationError } from '@/composables/useApplicationError'

const id = ref(0)
const nome = ref('')
const autor = ref('')
const genero = ref('')
const sinopse = ref('')

const cover = ref<File>()
const coverURL = ref('')
const nota = ref<number>()
const caps = ref<number>()

const userStore = useUserStore()
const loading = ref(false)
const feedback = ref('')
const error = ref<ApplicationError>()
const criando = ref(false)
const route = useRoute()

console.log(route.params)


function handleUpload(event: Event) {
  const inputEvent = event as InputEvent
  const target = inputEvent.target as HTMLInputElement
  cover.value = target.files?.item(0) as File
}


if(route.fullPath == `/admin/criarlivro/${route.params.username}`){
    criando.value = true
}

async function createLivro() {
  console.log(cover.value)
  try {
    loading.value = true
    const formData = new FormData()
    formData.append('files.Capa', cover.value as File)
    formData.append(
      'data',
      JSON.stringify({
        Nome: nome.value,
        Autor: autor.value,
        Genero: genero.value,
        Sinopse: sinopse.value,
        Nota: nota.value,
        nCapitulos: caps.value,
    })
    )

    const { data } = await api.post('/livros', formData, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`
      }
    })

    console.log(data.data)
    feedback.value = 'Livro criado com sucesso.'
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      error.value = e.response?.data
      feedback.value = error.value.error.message
    }
  } finally {
    loading.value = false
  }
}


async function editLivro() {
    console.log("editei foi nada kkkkk")
}

</script>

<template>
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  
    <div
      v-if="feedback"
      class="col-12 alert alert-dismissible fade show"
      :class="{ 'alert-danger': error, 'alert-success': !error }"
      role="alert"
    >
      {{ feedback }}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    <form @submit.prevent="criando ? createLivro() : editLivro()">
      <img class="col-auto" v-if="coverURL" :src="useUpload()(coverURL)" />
      <div class="row text-start">
        <div class="col-12 mb-3">
          <label for="coverInput" class="form-label">Capa</label>
          <input
            @change="handleUpload"
            type="file"
            id="coverInput"
            accept="image/*"
            class="form-control"
          />
        </div>
        <div class="col-12 mb-3">
          <label for="nomeInput" class="form-label">Nome</label>
          <input
            v-model="nome"
            type="text"
            id="nomeInput"
            class="form-control"
            placeholder="Campo obrigatório"
          />
        </div>
        <div class="col-12 mb-3">
          <label for="autorInput" class="form-label">Autor(a)</label>
          <input
            v-model="autor"
            type="text"
            id="autorInput"
            class="form-control"
            placeholder="Campo obrigatório"
          />
        </div>
        <div class="col-12 mb-3">
          <label for="generoInput" class="form-label">Genero</label>
          <input
            v-model="genero"
            type="text"
            id="generoInput"
            class="form-control"
            placeholder="Campo obrigatório"
          />
        </div>
        <div class="col-12 mb-3">
          <label for="sinopseInput" class="form-label">Sinopse</label>
          <input
            v-model="sinopse"
            type="text"
            id="sinopseInput"
            class="form-control"
            placeholder="Campo obrigatório"
          />
        </div>
        <div class="col-3 mb-3">
          <label for="notaInput" class="form-label">Nota do Livro</label>
          <input
            v-model="nota"
            type="number"
            id="notaInput"
            class="form-control"
            placeholder="Campo obrigatório"
          />
        </div>
        <div class="col-2 mb-3">
          <label for="capsInput" class="form-label">Número de Capítulos</label>
          <input
            v-model="caps"
            type="text"
            id="capsInput"
            class="form-control"
            placeholder="Campo obrigatório"
          />
        </div>
      </div>
      <RouterLink to="/admin" class="btn btn-danger">Cancel</RouterLink>
      <input v-if="criando" type="submit" class="btn btn-primary" value="Criar" />
      <input v-else type="submit" class="btn btn-success" value="Editar" />
    </form>
  </template>