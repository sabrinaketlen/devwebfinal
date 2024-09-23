<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { ApplicationError, Estante } from "@/types";
import { api } from "@/api";
import { isAxiosError } from "axios";
import { isApplicationError } from "@/composables/useApplicationError";
import { useUserStore } from "@/stores/userStore";
import Book from "@/components/Book.vue";

console.log("Componente renderizado");

const userStore = useUserStore();
const estante = ref({} as Estante);
const estantes = ref([] as Estante[]);
const exception = ref<ApplicationError>();
const loading = ref(true);
const user_id = userStore.user.id;
console.log("Token JWT:", userStore.jwt);


async function getEstantes(){
  console.log("getEstantes chamada");
  try {
    const { data } = await api.get(`/estantes?populate=livros.Capa, users_permissions_user`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`,
      },
    });
    console.log(data.data)
    estantes.value = data.data.map((estante: any) => ({
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
        Capa: livro.attributes.Capa?.data
          ? {
              id: livro.attributes.Capa.data.id,
              url: livro.attributes.Capa.data.attributes.url,
            }
          : undefined,
        Nota: livro.attributes.Nota,
        nCapitulos: livro.attributes.nCapitulos,
      })),
    }));
    console.log(estantes.value.length);

    console.log(estantes.value)
    for(let i = 0; i < estantes.value.length; i++){
      if(estantes.value[i].user.id == user_id){
        estante.value = estantes.value[i]
      }
    }

    console.log(estante);
    //estante.value = data.data.attributes.livros.data
    //console.log(data.data.attributes.livros.data);

    if (data.data.length === 0) {
      throw new Error("Estante não encontrada para o usuário");
    }
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data;
    }
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
</style>
