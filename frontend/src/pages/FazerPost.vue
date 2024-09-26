<script setup lang="ts">
import { ref, toRaw, onMounted } from 'vue';
import { isApplicationError } from '@/composables/useApplicationError';
import { isAxiosError } from 'axios'; // Certifique-se de ter axios importado
import type { ApplicationError, Estante, Livro } from '@/types';
import { useUserStore } from '@/stores/userStore'
import { api } from '@/api';
import { useRouter, useRoute } from 'vue-router';

const estante = ref({} as Estante)
const livro_selecionado = ref({} as Livro);
const tipo = ref('');
const dado = ref(0);
const dado_edit = ref(0);
const edit = ref(false);
const error = ref<ApplicationError>()
const route = useRoute()
const router = useRouter()
const conteudo = ref('');
const conteudo_edit  = ref('');
const loading = ref(false);
const exception = ref<ApplicationError>()
const errorMessage = ref<string | null>(null);
const userStore = useUserStore()
const user_id = userStore.user.id

onMounted(() => {
  if (route.fullPath === `/editarpost/${route.params.id}`) {
    edit.value = true; 
    console.log(edit.value);
    isTherePost(); 
  }
});


async function getEstante(){
  console.log("getEstantes chamada");
  try {
    const { data } = await api.get(`/estantes?populate=livros.Capa, users_permissions_user&filters[users_permissions_user][id]=${user_id}`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`,
      },
    });

    console.log(data.data[0])
    estante.value = data.data[0]
    console.log(estante.value)
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data;
    }
  } finally {
    loading.value = false;
  }
}

getEstante()


async function validacao() {
  const currentDado = edit.value ? dado_edit.value : dado.value;

  if ((tipo.value === 'Nota') && (currentDado > 5 || currentDado < 1)) {
    errorMessage.value = "Postagem do tipo 'Nota' deve ter 'Dado' entre 1 e 5";
    return false;
  } else if ((tipo.value === 'Progresso') && (currentDado > livro_selecionado.value.nCapitulos || currentDado < 1)) {
    errorMessage.value = `Postagem do tipo 'Progresso' para o livro ${livro_selecionado.value.Nome} deve ter 'Dado' entre 1 e ${livro_selecionado.value.nCapitulos}`;
    return false;
  }
  
  errorMessage.value = null; 
  return true; 
}

async function Postar() {
  try {
    loading.value = true;
    exception.value = undefined;
    errorMessage.value = null; 

    const isValid = await validacao();
    if (!isValid) {
      throw new Error(errorMessage.value || "Erro de validação"); 
    }
    console.log("CREATE")


    const newdata = {
      data: {
        Conteudo: conteudo.value,
        Dado: dado.value,
        Tipo: tipo.value,
        livro: livro_selecionado.value.id,
        users_permissions_user: user_id,
      }
    };    

    const { data } = await api.post(`/posts`, newdata, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`,
      },
    });

    router.push( { path: `/livros/${livro_selecionado.value.id}`});

  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data;
    }
  } finally {
    loading.value = false;
  }
}

async function isTherePost() {
  try{
    const { data } = await api.get(`/posts/${route.params.id}?populate=livro`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`,
      },
    });
    console.log(data.data)
    livro_selecionado.value = data.data.livro
    tipo.value = data.data.Tipo
  
    console.log(livro_selecionado)
  }
  catch(e){
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      error.value = e.response?.data
    }
    router.push('/NotFound')
  }
  finally{

  }

}


async function Editar() {
  console.log("Método Editar chamado");
  
  try {
    loading.value = true;
    exception.value = undefined;
    errorMessage.value = null; 
    console.log(livro_selecionado.value)

    const isValid = await validacao();
    if (!isValid) {
      throw new Error(errorMessage.value || "Erro de validação"); 
    }
  
    const newdata = {
      data: {
        Conteudo: conteudo_edit.value,
        Dado: dado_edit.value,
      }
    };

    console.log('Payload enviado:', newdata)
    

    const { data } = await api.put(`/posts/${route.params.id}`, newdata, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`,
      },
    });
    console.log("UPDATE")
    console.log(livro_selecionado)
    router.push( { path: `/livros/${livro_selecionado.value.id}`});

  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data;
    }
  } finally {
    loading.value = false;
  }
}

</script>

<template>
  <div class="row justify-content-center">
    <div class="col-lg-8 col-sm-12">
      <div class="card mb-3">
        <div class="card-body">
            <h5 class="card-title">{{ edit ? 'Editar Postagem' : 'Nova Postagem' }}</h5>
          <form @submit.prevent=" edit? Editar(): Postar()">
            <div v-if="!edit" class="mb-3">
                <label for="livroInput" class="form-label">Selecione o livro da sua estante: </label>
                <select class="form-select form-select-sm" aria-label="Small select example" id="livroInput" v-model="livro_selecionado" required>
                <option v-for="livro in estante.livros" :key="livro.Nome" :value="livro">
                    {{ livro.Nome }}
                </option>
            </select>
            </div>
            <div v-if="!edit" class="mb-3">
              <label for="tipoInput" class="form-label">Tipo de postagem: </label>
              <select class="form-select form-select-sm" aria-label="Small select example" id="tipoInput" v-model="tipo" required>
                <option value="Nota">Nota</option>
                <option value="Progresso">Progresso</option>
              </select>
            </div>
            <div v-if="!edit" class="mb-3">
              <label for="dadoInput" class="form-label">Dado (Nota ou Capitulo Lido)</label>
              <input type="number" class="form-control" id="dadoInput" v-model="dado" required />
              <div v-if="errorMessage" class="invalid-feedback" style="display: block;">{{ errorMessage }}</div>
            </div>
            <div v-else class="mb-3">
              <label for="dadoInput" class="form-label">Dado (Nota ou Capitulo Lido)</label>
              <input type="number" class="form-control" id="dadoInput" v-model="dado_edit" required />
              <div v-if="errorMessage" class="invalid-feedback" style="display: block;">{{ errorMessage }}</div>
            </div>
            <div  v-if="!edit" class="mb-3">
              <label for="conteudoInput" class="form-label">Conteúdo</label>
              <input type="text" class="form-control" id="conteudoInput" v-model="conteudo"/>
            </div>
            <div v-else>
              <label for="conteudoInput" class="form-label">Conteúdo</label>
              <input type="text" class="form-control" id="conteudoInput" v-model="conteudo_edit"/>
            </div>

            <div v-if="!edit" class="mb-3">
              <input type="submit" class="float-end btn btn-primary" value="Enviar" :disabled="loading" />
            </div>
            <div v-else>
             <input type="submit" class="float-end btn btn-primary" value="Editar" :disabled="loading" />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
