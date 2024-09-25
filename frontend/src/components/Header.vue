<template>
  <header>
    <RouterLink to='/'><img src="../assets/logo.png" alt="" /></RouterLink>
    
    <!-- v-model para armazenar o valor do input -->
    <input v-model="searchQuery" type="text" required placeholder="Buscar no catálogo..." @keyup.enter="getLivro" />

  </header>
</template>

<script setup lang="ts">
import { api } from '@/api'
import { ref, toRaw } from 'vue';
import { RouterLink } from 'vue-router';
import type { ApplicationError, Livro } from '@/types'
import { isAxiosError } from 'axios'
import { isApplicationError } from '@/composables/useApplicationError'
import { useRouter, useRoute } from 'vue-router';

const loading = ref(true)
const error = ref<ApplicationError>()
const router = useRouter();
const route = useRoute();
const errorMessage = ref<string | null>(null);

const livro = ref({} as Livro)

const searchQuery = ref('');

async function getLivro() {
      try {
        const { data } = await api.get(`/livros?populate=Capa&filters[Nome][$eqi]=${searchQuery.value}`);
        console.log(data.data)

        let achado = false
        errorMessage.value = null

        if(data.data.length == 0){
          errorMessage.value = "Livro não existe";
          throw new Error(errorMessage.value);
        }else{
          achado = true
          console.log("tem livro")
          livro.value = data.data[0]
        }

        if(route.path!= '/'){
          await router.push('/')
        }
        
          router.push( { path: `/livros/${livro.value.id}`});
  
        searchQuery.value = ''
        
      } catch (e) {
        if (isAxiosError(e) && isApplicationError(e.response?.data)) {
          error.value = e.response?.data;
          console.error("Erro de aplicação:", error.value);
          router.push('/NotFound');
        } else {
          console.error("Erro:", (e as Error).message || e);
          router.push('/NotFound');
        }
      } finally {
        loading.value = false
      }
    }
</script>

<!-- digo que o estilo só vai ser adicionado a esse escopo -->
<style scoped>
header {
  display: flex;
  width: 100%;
  gap: 20px;
  height: 25vh;
  padding: 5% 50px;
  justify-content: start;
  align-items: center;
  background-color: var(--white-color);
  transition: 0.2s;
  border-bottom: 3px solid var(--border-base-color);
}

header input {
  background-color: var(--base-input-color);
  font-size: 24px;
  text-align: center;
  width: 80%;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.8);
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  border: none;
  height: 45px;
  border-radius: 20px;
  padding: 5px;
}

header img {
  width: 100%;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  transition: 0.3s;
  height: auto;
}

header img:hover {
  transform: scale(1.1);
  rotate: 360deg;
  transition: 0.8s;
}
</style>
