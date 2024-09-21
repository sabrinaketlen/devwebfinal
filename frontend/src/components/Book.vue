<script setup lang="ts">
import type { Livro } from '@/types';
import { useUpload } from '@/composables/useUpload';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore()
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
          <h5 class="card-title">{{ props.nome }} </h5>
          <p class="card-text"> {{ props.autor }}</p>
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