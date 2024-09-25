<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { ApplicationError, Estante } from "@/types";
import { api } from "@/api";
import { isAxiosError } from "axios";
import { isApplicationError } from "@/composables/useApplicationError";
import { useUserStore } from "@/stores/userStore";
import { useRouter, useRoute } from 'vue-router';
import Book from "@/components/Book.vue";

console.log("Componente renderizado");

const router = useRouter()
const route = useRoute()
const userStore = useUserStore();
const estante = ref({} as Estante);
const exception = ref<ApplicationError>();
const loading = ref(true);
const isEmpty = ref(false)

console.log(route.params.username)

async function getEstantes(){
  console.log("getEstantes chamada");
  try {
    if(route.params.username != userStore.user.username){
      throw new Error()
    }
    const { data } = await api.get(`/estantes?populate=livros.Capa, users_permissions_user&filters[users_permissions_user][username]=${route.params.username}`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`,
      },
    });

    console.log(data.data[0])
    if(data.data[0].livros.length == 0){
      isEmpty.value = true
    }
    console.log(isEmpty.value)
    estante.value = data.data[0]
    console.log(estante.value)
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data;
    }
    router.push('/NotFound')
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getEstantes();
});

</script>

<template>
  <div v-if="exception" class="alert alert-danger" role="alert">
    {{ exception.error.message }}
  </div>

  <div v-if="loading" class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>

  <div v-if="isEmpty" class="empty-shelf">
    <h1>😞</h1>
    <p>Sua estante está vazia, explore o catálogo para escolher qual livro adicionar.</p>
  </div>

  <div v-else class="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-8">
    <RouterLink 
      v-for="livro in estante.livros" 
      :to="`/livros/${livro.id}`" 
      class="text-decoration-none">
      <Book
        :key="livro.id"
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
.estante {
  display: flex;

  justify-content: space-around;
  align-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.empty-shelf {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  color: #333;
}

h1 {
  font-size: 6rem;
  margin: 0;
}

p {
  font-size: 1.2rem;
  margin: 10px 0;
}

</style>
