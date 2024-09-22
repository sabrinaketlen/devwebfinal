<script setup lang="ts">
import { ref, toRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/api'
import { useUpload } from '@/composables/useUpload'
import type { ApplicationError, Estante, Livro, Poste } from '@/types'
import { useUserStore } from '@/stores/userStore'
import { isAxiosError } from 'axios'
import { isApplicationError } from '@/composables/useApplicationError'

const route = useRoute()
console.log(route.params)
</script>
<template>
    <h1>
        oiee
    </h1>
</template>