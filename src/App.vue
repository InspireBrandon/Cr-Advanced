<template>
  <div id="app">
    <v-app dark>
      <router-view></router-view>
    </v-app>
  </div>
</template>

<script>
  export default {
    created() {
      if (sessionStorage.accessToken == undefined) {
        this.$router.push('/Login');
      }
    }
  }
</script>

<style>
  html {
    overflow: hidden;
  }

  .main-main {
    overflow: auto;
    height: calc(100vh - 60px);
  }
</style>