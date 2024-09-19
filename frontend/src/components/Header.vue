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
import { useRouter } from 'vue-router';

const loading = ref(true)
const error = ref<ApplicationError>()
const id = ref('')
const router = useRouter();

const livro = ref([] as Livro[])

const searchQuery = ref('');
    // Função para logar o valor do input no console
async function logSearchQuery(){
      console.log(searchQuery.value); // Exibe o valor atual do input no console quando "Enter" é pressionado
      searchQuery.value = '';
    }

async function getLivro() {
      try {
        const { data } = await api.get(`/livros?populate=Capa`)
        livro.value = data.data

        const livro_objeto = toRaw(livro._rawValue)

        let achado = false
        for (let i = 0; i < livro_objeto.length; i++) {
          if (livro_objeto[i].attributes.Nome === searchQuery._rawValue) {
            id.value = livro_objeto[i].id
            console.log(id._rawValue);
            router.push(`/livros/${id._rawValue}`);
            achado = true
            break;
          }
        }

        if(achado == false){
          router.push({ path: '/:pathMatch(.*)*' });
        }
        
        
        
      } catch (e) {
        if (isAxiosError(e) && isApplicationError(e.response?.data)) {
          error.value = e.response?.data
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
  padding: 20px 50px;
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
  border: none;
  height: 45px;
  border-radius: 20px;
  padding: 5px;
}

header img {
  width: 220px;
}
</style>