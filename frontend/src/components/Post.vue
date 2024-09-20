<script setup lang="ts">
import type { Poste } from '@/types';
import { useUpload } from '@/composables/useUpload';
const props = defineProps<Poste>();

const nota = true
</script>

<template>
    <div class="row justify-content-center">
      <div class="col-lg-8 col-sm-12">
        <div class="card mb-3">
          
              <div class="card-body">
                <div class="d-flex justify-content-left align-items-center">
                    <h5 class="card-title mb-0 me-2">{{ props.user }}</h5> <!-- Adicionando a classe 'me-2' -->
                    <p class="card-text mb-0"> <!-- Removendo a margem inferior para melhor alinhamento -->
                        <a v-if="nota">
                        <strong>
                        <small>{{ props.tipo }}</small> <span class="badge bg-secondary">oii</span>
                        </strong>
                        </a>
                    </p>
                </div>
                
                <a>
                    <strong>
                    <small>Tipo:</small> <div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                                            <div class="progress-bar" style="width: 70%"></div>
                                        </div>
                    </strong>
                </a>
                    
                
                <div class="text-start">
                    
                  <p class="card-text">ADHJKSDHAJKDHJKASDHJKADHJKDHAJKHDAJKSDHJKASDHASJKDHAJKDHAJKSDHAJKSDHAJKSDHAKJSDHAJKSDHAKSJDHAKSJDHASKDJHASDJKAHDAJKD</p>
                  
                </div>
            </div>
          
        </div>
      </div> 
    </div>

  </template>
  