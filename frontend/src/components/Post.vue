<script setup lang="ts">
import type { Post } from '@/types';
import { useUpload } from '@/composables/useUpload';
const props = defineProps<Post>();
const uploadHelper = useUpload();
</script>

<template>
    <div class="row justify-content-center">
      <div class="col-lg-8 col-sm-12">
        <div class="card mb-3">
          
              <div class="card-body">
                <div class="d-flex justify-content-left align-items-center">
                    <h5 class="card-title mb-0 me-2">username</h5> <!-- Adicionando a classe 'me-2' -->
                    <p class="card-text mb-0"> <!-- Removendo a margem inferior para melhor alinhamento -->
                        <strong>
                        <small>Tipo:</small> <span class="badge bg-secondary">oii</span>
                        </strong>
                    </p>
                </div>
                
                <div class="text-start">
                    
                  <p class="card-text">ADHJKSDHAJKDHJKASDHJKADHJKDHAJKHDAJKSDHJKASDHASJKDHAJKDHAJKSDHAJKSDHAJKSDHAKJSDHAJKSDHAKSJDHAKSJDHASKDJHASDJKAHDAJKD</p>
                  
                </div>
            </div>
          
        </div>
      </div> 
    </div>

  </template>
  