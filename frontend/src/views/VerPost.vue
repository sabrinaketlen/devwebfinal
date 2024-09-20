<script>
import { ref, toRaw } from 'vue'
import { useUserStore } from '@/stores/userStore'

const posts = ref('')
const userStore = useUserStore()


async function getPosts() {
  try {
    const { data } = await api.get(`/posts?populate=livro,users_permissions_user`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`,
      },
    })
    posts.value = data.data
    console.log(posts._rawValue)
    const posts_sel = ref([])

    for(let i = 0; i < posts._rawValue.length; i++){
        if(posts._rawValue[i].attributes.livro.data.id == livro._rawValue.id)
          posts_sel.value.push(posts._rawValue[i])
      
    }

    posts_selecionados.value = toRaw(posts_sel._rawValue)

    console.log("a doidera dando certo")
    console.log(posts_selecionados)

    //console.log(livro._rawValue);
    
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      error.value = e.response?.data
    }
  } finally {
    loading.value = false
  }
  
}

getPosts()
</script>

<template>
<div>
    <Post
        v-for="posti in posts_selecionados"
        :key="posti.id"
        :conteudo = "posti.attributes.Conteudo"
        :dado= "posti.attributes.Dado"
        :tipo= "posti.attributes.Tipo"
        :livro= "posti.attributes.livro"
        :user= "posti.attributes.users_permissions_user.data.attributes.username"
        :id= "posti.id"
      />
    </div>
</template>

