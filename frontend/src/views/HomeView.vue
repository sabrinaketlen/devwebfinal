<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import type { ApplicationError, Livro } from "@/types";
import { api } from "@/api";
import { isAxiosError } from "axios";
import { isApplicationError } from "@/composables/useApplicationError";
import { useRouter } from "vue-router";
import Book from "@/components/Book.vue";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();
const livros = ref([] as Livro[]);
const router = useRouter();
const exception = ref<ApplicationError>();
const loading = ref(true);

console.log(userStore.user.role.name);

const fetchLivro = async () => {
  
};

const clearLivro = () => {
  livros.value = [];
};

onMounted(async () => {
  try {
    const { data } = await api.get(`/livros?populate=Capa`);
    livros.value = data.data.map((livro: any) => ({
    id: livro.id,
    ...livro.attributes,
    Capa: {
          id: livro.attributes.Capa.data.id,
          url: livro.attributes.Capa.data.attributes.url,
        }
    }));
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data;
    }
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div v-if="exception" class="alert alert-danger" role="alert">
    {{ exception.error.message }}
  </div>

  <div v-if="loading" class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>

  <div v-else class="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
    <RouterLink 
      v-for="livro in livros" 
      :key="livro.id" 
      :to="`/livros/${livro.id}`" 
      class="text-decoration-none">
      <Book
        :id="livro.id"
        :Nome="livro.Nome"
        :Autor="livro.Autor"
        :Genero="livro.Genero"
        :Sinopse="livro.Sinopse"
        :Nota="livro.Nota"
        :Capa="livro.Capa"
        :nCapitulos="livro.nCapitulos"
      />
    </RouterLink>
  </div>
</template>

<style scoped>
.books {
  display: flex;
  justify-content: space-around;
  align-content: center;
  gap: 30px;
  flex-wrap: wrap;
}
</style>
