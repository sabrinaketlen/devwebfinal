<script setup lang="ts">
import { ref, toRaw } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/api'
import { useUpload } from '@/composables/useUpload'
import type { ApplicationError, Estante, Livro, Poste } from '@/types'
import { useUserStore } from '../stores/userStore'
import { isAxiosError } from 'axios'
import { isApplicationError } from '@/composables/useApplicationError'
import Post from '../components/Post.vue';

const estantes = ref([] as Estante[])
const posts = ref([] as Poste[])
const posts_selecionados = ref([] as Poste[])
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

async function getEstante() {
  const { data } = await api.get(`/estantes?populate=livros.Capa, users_permissions_user`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`,
      },
    });
    console.log(data.data)
    estantes.value = data.data.map((estante: any) => ({
      id: estante.id,
      user: {
        id: estante.attributes.users_permissions_user.data.id,
        username: estante.attributes.users_permissions_user.data.attributes.username,
        role: estante.attributes.users_permissions_user.data.attributes.role,
        email: estante.attributes.users_permissions_user.data.attributes.email,
      },
      livros: estante.attributes.livros.data.map((livro: any) => ({
        id: livro.id,
        Nome: livro.attributes.Nome,
        Autor: livro.attributes.Autor,
        Genero: livro.attributes.Genero,
        Sinopse: livro.attributes.Sinopse,
        Capa:
           {
              id: livro.attributes.Capa.data.id,
              url: livro.attributes.Capa.data.attributes.url,
            },
        Nota: livro.attributes.Nota,
        nCapitulos: livro.attributes.nCapitulos,
        
      })),
    }));
    console.log(estantes.value);
    for(let i = 0; i < estantes.value.length ; i++){
      if(estantes.value[i].user.id == userStore.user.id){
        console.log(estantes.value[i])
      estante.value = estantes.value[i]
      }
    }
    console.log(estante.value)
}

async function getPosts() {
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

    for(let i = 0; i < posts.value.length; i++){
        if(posts.value[i].id == livro.value.id)
          posts_selecionados.value.push(posts.value[i])
    }

    //console.log(posts_selecionados)

    //console.log(livro._rawValue);
    
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      error.value = e.response?.data
    }
  } finally {
    loading.value = false
  }
  
}

async function checkIfBookInEstante() {
  getLivro()
  try {
    getEstante()
    getPosts()

    let achado = false
    const idParam = Number(route.params.id);
    console.log(estante.value.livros)
    // ERRO ESTA AQUI
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
  checkIfBookInEstante()
  const action = isBookInEstante.value ? 'remove' : 'add'

  try {
    loading.value = true
    
    //console.log(estante._rawValue);
    
    console.log(estante.value)
    //console.log("currentLivros:");

    let currentLivros_id: number[] = [];

    for (let i = 0; i < estante.value.livros.length; i++) {
      currentLivros_id.push(estante.value.livros[i].id)
    }
    console.log(currentLivros_id)
    console.log(livro.value.id)
    
    //console.log(currentLivros);
    //console.log("livro raw value");

    //console.log(livro._rawValue);
    
    //console.log("livro_objeto");

    //console.log(livro_objeto);
    

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
  