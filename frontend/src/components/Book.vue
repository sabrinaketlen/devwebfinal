<script setup lang="ts">
import type { Livro } from '@/types';
import { useUpload } from '@/composables/useUpload';
import { useUserStore } from '@/stores/userStore';
import { useRoute } from 'vue-router'
import { markRaw, toRaw } from 'vue';


const route = useRoute()
const userStore = useUserStore()
defineProps<Livro>();
const uploadHelper = useUpload();


</script>

<template>
    <div class="col card-style">
      <div class="card shadow-sm">
        <img :src="uploadHelper(Capa.url)" :alt="`Capa do Livro ${Nome}`" class="cover">
        <div class="card-body">
          <h5 class="card-title">{{ Nome }}</h5>
          <p class="card-text">{{ Autor }}</p>
        </div>
      </div>
    </div>
</template>

<style scoped>
.cover:hover {
  filter: sepia(0.8);
}

.card-style {
  padding: 10px;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
  transition: 0.5s;
}

.card-style:hover {
  transform: scale(1.12);
  transition: 0.5s;
  padding-bottom: 20px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
}
</style>
