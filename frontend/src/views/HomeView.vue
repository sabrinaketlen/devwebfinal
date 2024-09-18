<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { ApplicationError, Livro } from '@/types';
import { api } from '@/api';
import { isAxiosError } from 'axios';
import { isApplicationError } from '@/composables/useApplicationError';
import { useRouter } from 'vue-router';
import Book from '@/components/Book.vue';

// Referência ao livro e a flag de carregamento
const livros = ref([] as Livro[])
const router = useRouter();
const exception = ref<ApplicationError>()
const loading = ref(true)

// Função para buscar o livro
const fetchLivro = async () => {
  try {
    const { data } = await api.get(`/livros`);
    console.log(data); // Adicione isso para inspecionar a resposta
    livros.value = data.data; 
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data
    }
  } finally {
    loading.value = false
  }
};

// Função para limpar o livro
const clearLivro = () => {
  livros.value = [];
};

// Requisição ao montar o componente e limpar ao sair
onMounted(() => {
  fetchLivro();
  router.beforeEach(() => {
    clearLivro();
  });
});

onUnmounted(() => {
  clearLivro();
});
</script>

<template>
  <div v-if="exception" class="alert alert-danger" role="alert">
    {{ exception.error.message }}
  </div>

  <div v-if="loading" class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
  <div v-else>
    <Book
      v-for="livro in livros"
      :id="livro.id"
      :nome="livro.nome"
      :autor="livro.autor"
      :genero="livro.genero"
      :sinopse="livro.sinopse"
      :capa="livro.capa"
      :nota="livro.nota"
      :caps="livro.caps"
    />
  </div>
</template>