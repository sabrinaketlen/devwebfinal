<template>
  <div class="d-flex" id="wrapper">
    <!-- Sidebar -->
    <div v-if="isSidebarVisible" id="sidebar-wrapper">
      <!-- VOU PRECISAR ALTERAR PRA QUANDO ESTIVER LOGADO -->
      <div class="btn-group-vertical" role="group" aria-label="Vertical button group">
        <button type="button" class="btn btn-light">Fazer post</button>
        <button type="button" class="btn btn-light">Amigos</button>
        <RouterLink :to="`/estante/${username}`"><button type="button" class="btn btn-light">Estante</button></RouterLink>
        <RouterLink to='/'><button type="button" class="btn btn-light">Catálogo</button></RouterLink>
      </div>
    </div>

    <!-- Page Content -->
    <div id="page-content-wrapper">
      <nav class="navbar navbar-expand-lg border-bottom">
        <button @click="toggleSidebar" class="btn fs-1" id="menu-toggle">
          <i class="bi bi-list fs-1 text-white"></i>
        </button>
        <template v-if="userStore.username">
                <RouterLink to="/login">
                <a href="#" @click="userStore.logout" class="btn btn-outline-danger">Logout</a>
                </RouterLink>
        </template>
        <template v-else><RouterLink to="/login" class="btn btn-light">Login</RouterLink></template>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const username = userStore.user.username


const isSidebarVisible = ref(true)

function toggleSidebar() {
  isSidebarVisible.value = !isSidebarVisible.value

  const wrapper = document.getElementById('wrapper')
  if (wrapper) {
    wrapper.classList.toggle('sidebar-hidden', !isSidebarVisible.value)
    wrapper.classList.toggle('sidebar-visible', isSidebarVisible.value)
  }
}
</script>


<style scoped>
#wrapper {
  display: flex;
  flex-wrap: nowrap;
  transition: margin-left 0.3s; /* Transição suave para a margem esquerda */
}

#sidebar-wrapper {
  height: 75vh;
  border: none;
  background-color: var(--item-color);
  min-width: 250px; /* Ajuste a largura da sidebar */
  transition: transform 0.3s; /* Transição suave para a transformação */
  position: fixed; /* Fixa a sidebar no lado esquerdo */
  z-index: 1000; /* Garante que a sidebar fique sobre outros conteúdos */
  display: flex; /* Usa Flexbox */
  flex-direction: column; /* Organiza os itens em coluna */
  justify-content: center; 
}

#page-content-wrapper {
  flex: 1;
  transition: margin-left 0.3s; /* Transição suave para a margem esquerda */
  margin-left: 250px; /* Define a margem padrão para a largura da sidebar */
}

.sidebar-hidden #sidebar-wrapper {
  transform: translateX(-100%); /* Move a sidebar para fora da tela */
}

.sidebar-visible #sidebar-wrapper {
  transform: translateX(0); /* Move a sidebar para dentro da tela */
}

.sidebar-hidden #page-content-wrapper {
  margin-left: 0; /* Remove a margem quando a sidebar está oculta */
}

.sidebar-visible #page-content-wrapper {
  margin-left: 250px; /* Define a margem quando a sidebar está visível */
}

nav {
  display: flex;
  padding: 24px;
  background-color: var(--item-color);
  height: 100px;
  justify-content: space-between;
  align-items: center;
  z-index: 2000;/* Garante que o nav fique sobre outros conteúdos */
}

#sidebar-wrapper .list-group-item {
  margin-top: 10px;
  margin-bottom: 10px; /* Adiciona margem entre os itens da lista */
}

.btn-group-vertical .btn {
  margin-bottom: 10px; /* Espaço entre os botões */
}

</style>
