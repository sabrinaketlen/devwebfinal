<template>
  <div class="d-flex" id="wrapper">
    <!-- Sidebar -->
    <div v-if="isSidebarVisible" id="sidebar-wrapper">
      <!-- VOU PRECISAR ALTERAR PRA QUANDO ESTIVER LOGADO -->
      <div class="btn-group-vertical" role="group" aria-label="Vertical button group">
        <RouterLink :to="`/post/${userStore.username}`"><button type="button" class="btn btn-light">Fazer post</button></RouterLink>
        <RouterLink :to="`/estante/${userStore.username}`"><button type="button" class="btn btn-light">Estante</button></RouterLink>
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
          <div>
            <!-- Exibir o nome do usuário -->
            <span>Logged as {{ userStore.username }}</span>
          </div>
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
  transition: margin-left 0.3s; 
}

#sidebar-wrapper {
  height: 75vh;
  border: none;
  background-color: var(--item-color);
  min-width: 250px; 
  transition: transform 0.3s;
  position: fixed;
  z-index: 1000;
  display: flex; 
  flex-direction: column; 
  justify-content: center; 
}

#page-content-wrapper {
  flex: 1;
  transition: margin-left 0.3s; 
  margin-left: 250px;
}

.sidebar-hidden #sidebar-wrapper {
  transform: translateX(-100%); 
}

.sidebar-visible #sidebar-wrapper {
  transform: translateX(0); 
}

.sidebar-hidden #page-content-wrapper {
  margin-left: 0; 
}

.sidebar-visible #page-content-wrapper {
  margin-left: 250px;
}

nav {
  display: flex;
  padding: 24px;
  background-color: var(--item-color);
  height: 100px;
  justify-content: space-between;
  align-items: center;
  z-index: 2000;
}

#sidebar-wrapper .list-group-item {
  margin-top: 10px;
  margin-bottom: 10px; 
}

.btn-group-vertical .btn {
  margin-bottom: 10px; 
}

</style>
