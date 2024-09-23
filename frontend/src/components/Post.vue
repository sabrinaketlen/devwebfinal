<script setup lang="ts">
import type { Livro, Poste, User } from '@/types';
import { ref, toRaw, watch } from 'vue'
const props = defineProps<Poste>();
const username = props.users_permissions_user.username
let nota = true

if(props.Tipo != "Nota"){
  nota = false
}

console.log(props)


let progresso = ( props.Dado / props.livro.nCapitulos ) * 100

const progressWidth = `${progresso}%`;

</script>

<template>
  <div class="row justify-content-center">
    <div class="col-lg-8 col-sm-12">
      <div class="card mb-3">
            <div class="card-body">
              <div class="d-flex justify-content-left align-items-center">
                  <h5 v-if="props.users_permissions_user" class="card-title mb-0 me-2">{{ props.users_permissions_user.username }}</h5>
                  <p class="card-text mb-0"> 
                      <div v-if="nota">
                      <strong>
                      <small>{{props.Tipo}}</small> <span class="badge text-bg-warning">{{ props.Dado }}</span>
                      </strong>
                    </div>
                  </p>
              </div>
              
              <div v-if="!nota">
                  <strong>
                  <small>{{props.Tipo}}:</small> <div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="value" aria-valuemin="0" aria-valuemax="100">
                                                <div class="progress-bar" :style="{ width: progressWidth }"></div>
                                            </div>
                  </strong>
                </div>
              <div class="text-start">
                  
                <p class="card-text">{{ props.Conteudo }}</p>
                
              </div>
          </div>
        
      </div>
    </div> 
  </div>
</template>
  