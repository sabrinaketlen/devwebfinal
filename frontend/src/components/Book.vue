<script setup lang="ts">


import type { Livro } from '@/types';
import { useUpload } from '@/composables/useUpload';
defineProps<Livro>()

const uploadHelper = useUpload()
</script>

<template>
    <RouterLink :to="`/livros/${id}`" class="text-decoration-none">
      <div class="col">
        <div class="card shadow-sm">
          <img :src="uploadHelper(capa.url)" :alt="`Capa do Livro ${nome}`" class="cover">
          <div class="card-body">
            <h5 class="card-title">{{ nome }} - {{ autor }}</h5>
            <p class="card-text">{{ genero }}</p>
            <p class="card-text">{{ sinopse }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <small class="text-danger">Nota: {{ nota }}/10</small>
              <small class="text-muted">Capítulos: {{ caps }}</small>
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