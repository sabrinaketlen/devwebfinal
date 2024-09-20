<script setup lang="ts">
import type { Poste } from '@/types';
import { ref, toRaw } from 'vue'


console.log("TO AQUIIII")
const props = defineProps<Poste>();
let nota = true

if(props.tipo != "Nota"){
  nota = false
}

</script>

<template>
    <div class="row justify-content-center">
      <div class="col-lg-8 col-sm-12">
        <div class="card mb-3">
          
              <div class="card-body">
                <div class="d-flex justify-content-left align-items-center">
                    <h5 class="card-title mb-0 me-2">{{ user }}</h5>
                    <p class="card-text mb-0"> 
                        <a v-if="nota">
                        <strong>
                        <small>{{tipo}}</small> <span class="badge text-bg-warning">oii</span>
                        </strong>
                        </a>
                    </p>
                </div>
                
                <a v-if="!nota">
                    <strong>
                    <small>{{tipo}}:</small> <div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                                            <div class="progress-bar" style="width: 70%"></div>
                                        </div>
                    </strong>
                </a>
                <div class="text-start">
                    
                  <p class="card-text">{{ conteudo }}</p>
                  
                </div>
            </div>
          
        </div>
      </div> 
    </div>

  </template>
  