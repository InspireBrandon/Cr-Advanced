<template>

</template>

<script>
export default {
  data() {
    return {
    };
  },
  methods: {
    goTo(key) {
      this.$router.push({ name: key });
    }
  },
  computed: {}
};
</script>