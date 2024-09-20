
<script setup lang="ts">
import { ref, toRaw } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { ApplicationError, Poste } from '@/types'
import { isAxiosError } from 'axios';
import { isApplicationError } from '@/composables/useApplicationError';
import { useUserStore } from '@/stores/userStore'
import { api } from '@/api';


import Post from '../components/Post.vue';

const userStore = useUserStore()
const loading = ref(true)
const error = ref<ApplicationError>()

const route = useRoute()
const post = ref({} as Poste)

//parei aqui, JA ESTA PEGANDO O POST

async function getPost() {
  try {
    const { data } = await api.get(`/posts/${route.params.id}?populate=livro,users_permissions_user`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`,
      },
    })
    post.value = data.data
    console.log(post._rawValue)

    

    console.log("a doidera dando certo")

    //console.log(livro._rawValue);
    
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      error.value = e.response?.data
    }
  } finally {
    loading.value = false
  }
  
}

getPost()

</script>

<template>
    <Post
    :key="post.id"
    :conteudo = "post.attributes.Conteudo"
    :dado= "post.attributes.Dado"
    :tipo= "post.attributes.Tipo"
    :livro= "post.attributes.livro"
    :user= "post.attributes.users_permissions_user.data.attributes.username"
    :id= "post.id"
    />
</template>

