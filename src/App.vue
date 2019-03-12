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
    height: calc(100vh - 50px);
  }

  /* width */
  ::-webkit-scrollbar {
    width: 5px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #cccccc;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #888;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
</style>