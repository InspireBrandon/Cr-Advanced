<template>
  <div id="app">
    <v-app>
      <router-view></router-view>
    </v-app>
  </div>
</template>

<script>
  export default {
    created() {
      localStorage.ServerAddress = process.env.VUE_APP_API;

      // if (process.env.VUE_APP_MAINT) {
      //   this.$router.push('/Maint');
      // } else {
      //   if (sessionStorage.accessToken == undefined) {
      //     this.$router.push('/Login');
      //   }
      // }

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