

<template>
  <!-- <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header> -->
  <div class="conteiner">
    <myHeader></myHeader>
    <SideBar></SideBar>
  </div>

<router-view/>
  
</template>

<script>
import { RouterView } from 'vue-router';
import myHeader from './components/Header.vue'
import SideBar from './components/SideBar.vue';


export default {
  name: 'App',
  components: { myHeader, SideBar }
  
}

</script>

<style>
.conteiner {
  display: flex;
  flex-direction: column;
}
</style>
