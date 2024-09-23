<script setup lang="ts">
import { ref, toRaw, onMounted } from 'vue';
import { isApplicationError } from '@/composables/useApplicationError';
import { isAxiosError } from 'axios'; // Certifique-se de ter axios importado
import type { ApplicationError, Estante, Livro } from '@/types';
import { useUserStore } from '@/stores/userStore'
import { api } from '@/api';
import { useRouter, useRoute } from 'vue-router';



const estante = ref({} as Estante)
const estantes = ref([] as Estante[])
const livros = ref([] as Livro[])
const livro_selecionado = ref({} as Livro);
const tipo = ref('');
const dado = ref(0);
const dado_edit = ref(0);
const edit = ref(false);

const route = useRoute()
const router = useRouter()
const conteudo = ref('');
const loading = ref(false);
const exception = ref<ApplicationError>()
const errorMessage = ref<string | null>(null);
const userStore = useUserStore()
const user_id = userStore.user.id
const user = userStore.user


    if (route.fullPath == `/posts/editar/${route.params.id}`){
        edit.value = true 
        console.log(edit.value)
    }


const getEstante = async () => {
  try {
    const { data } = await api.get(`/estantes?populate=livros.Capa, users_permissions_user`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`,
      },
    });
    console.log(data.data)
    estantes.value = data.data.map((estante: any) => ({
      id: estante.id,
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
        Capa:
           {
              id: livro.attributes.Capa.data.id,
              url: livro.attributes.Capa.data.attributes.url,
            },
        Nota: livro.attributes.Nota,
        nCapitulos: livro.attributes.nCapitulos,
        
      })),
    }));
    console.log(estantes.value);
    for(let i = 0; i < estantes.value.length ; i++){
      if(estantes.value[i].user.id == userStore.user.id){
        console.log(estantes.value[i])
      estante.value = estantes.value[i]
      }
    }
    console.log(estante.value)
        if (data.data.length === 0) {
          throw new Error('Estante não encontrada para o usuário')
        }
      } catch (e) {
        if (isAxiosError(e) && isApplicationError(e.response?.data)) {
          exception.value = e.response?.data
        }
      } finally {
        loading.value = false
      }
    }

getEstante()

async function getLivro() {
    const { data } = await api.get(`/posts/${route.params.id}?populate=livro`, {
        headers: {
                Authorization: `Bearer ${userStore.jwt}`,
            }
    });
    console.log(data.data)
    livro_selecionado.value = data.data.attributes.livro.data
    console.log(livro_selecionado)
    tipo.value = data.data.attributes.Tipo
    console.log(data.data)
    dado_edit.value = data.data.attributes.Dado
    //for (let i = 0; i < livros.value.length; i++){
    // if(livros.value[i].id == )    
    //}
}
getLivro()

async function Postar() {
  try {
    loading.value = true;
    exception.value = undefined;
    errorMessage.value = null; 
    //console.log(livro_selecionado);

    if ((tipo.value == 'Nota') && (dado.value > 5 || dado.value < 1)) {
      errorMessage.value = "Postagem do tipo 'Nota' deve ter 'Dado' entre 1 e 5";
      throw new Error(errorMessage.value);
    }
    else if ((tipo.value == 'Progresso') && (dado.value > livro_selecionado.value.nCapitulos || dado.value < 1)) {
      errorMessage.value = `Postagem do tipo 'Progresso' pro livro ${livro_selecionado.value.Nome} deve ter 'Dado' entre 1 e ${livro_selecionado.value.nCapitulos}`;
      throw new Error(errorMessage.value);
    }
    console.log("CREATE")


    //console.log(conteudo._rawValue);
    //console.log(livro_selecionado._rawValue.attributes.nCapitulos);
   // console.log(dado._rawValue);
    //console.log(tipo._rawValue);
    //console.log(livro_selecionado);
    //console.log(toRaw(user));
    //console.log(user_id);

    const newdata = {
      data: {
        Conteudo: conteudo.value,
        Dado: dado.value,
        Tipo: tipo.value,
        livro: livro_selecionado.value.id,
        users_permissions_user: user_id,
      }
    };

    //console.log('Payload enviado:', newdata)
    

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

async function Editar() {
  console.log("Método Editar chamado");
  try {
    loading.value = true;
    exception.value = undefined;
    errorMessage.value = null; 
    //console.log(livro_selecionado);
    await getLivro()
    console.log(livro_selecionado.value)

    if(tipo.value == 'Nota'){
        console.log("dado inserido foi maior que 5")        
    }

    if ((tipo.value == 'Nota') && (((dado_edit.value > 5) || (dado_edit.value < 1)) || ((dado.value > 5) || (dado.value < 1)) )) {
      errorMessage.value = "Postagem do tipo 'Nota' deve ter 'Dado' entre 1 e 5";
      throw new Error(errorMessage.value);
    }
    if ((tipo.value == 'Progresso') && (((dado.value > livro_selecionado.value.nCapitulos || dado.value < 1)) || ((dado_edit.value > livro_selecionado.value.nCapitulos ) || (dado_edit.value < 1)))) {
      errorMessage.value = `Postagem do tipo 'Progresso' pro livro ${livro_selecionado.value.Nome} deve ter 'Dado' entre 1 e ${livro_selecionado.value.nCapitulos}`;
      throw new Error(errorMessage.value);
    }
    
    //console.log(conteudo._rawValue);
    //console.log(livro_selecionado._rawValue.attributes.nCapitulos);
   // console.log(dado._rawValue);
    //console.log(tipo._rawValue);
    //console.log(livro_selecionado);
    //console.log(toRaw(user));
    //console.log(user_id);

    const newdata = {
      data: {
        Conteudo: conteudo.value,
        Dado: dado.value,
      }
    };

    console.log('Payload enviado:', newdata)
    

    const { data } = await api.put(`/posts/${route.params.id}`, newdata, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`,
      },
    });
    console.log("UPDATE")

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
            <div class="mb-3">
              <label for="dadoInput" class="form-label">Dado (Nota ou Capitulo Lido)</label>
              <input type="number" class="form-control" id="dadoInput" v-model="dado" required />
              <div v-if="errorMessage" class="invalid-feedback" style="display: block;">{{ errorMessage }}</div>
            </div>
            <div class="mb-3">
              <label for="conteudoInput" class="form-label">Conteúdo</label>
              <input type="text" class="form-control" id="conteudoInput" v-model="conteudo"/>
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
