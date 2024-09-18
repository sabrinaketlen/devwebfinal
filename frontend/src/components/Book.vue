<script setup lang="ts">
import type { Livro } from '@/types';
import { useUpload } from '@/composables/useUpload';
const props = defineProps<Livro>();
const uploadHelper = useUpload();
</script>

<template>
  <RouterLink :to="`/livros/${props.id}`" class="text-decoration-none">
    <div class="col">
      <div class="card shadow-sm">
        <img 
          v-if="props.capa" 
          :src="uploadHelper(props.capa.data.attributes.url)" 
          :alt="`Capa do Livro ${props.nome}`" 
          class="cover"
        />
        <div class="card-body">
          <h5 class="card-title">{{ props.nome }} - {{ props.autor }}</h5>
          <p class="card-text">{{ props.genero }}</p>
          <p class="card-text">{{ props.sinopse }}</p>
          <div class="d-flex justify-content-between align-items-center">
            <small class="text-danger">Nota: {{ props.nota }}/5</small>
            <small class="text-muted">Capítulos: {{ props.caps }}</small>
          </div>
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.cover:hover {
  filter: sepia(0.8);
}
</style>