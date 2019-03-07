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