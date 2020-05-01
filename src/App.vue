<template>
  <div
    id="app"
    class="h-screen bg-opal p-2"
  >
    <router-view/>
    <div v-if="getIsLoading" class="fixed w-full h-full top-0 left-0 text-center bg-gray05">
        <img class="absolute top-0 bottom-0 left-0 right-0 m-auto" width="75px" src="@/assets/pulse.gif" alt="loader">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'App',
  computed: {
    ...mapGetters(['getIsLoading']),
  },
};
</script>

<style src="./assets/tailwind.css"/>
<style src="vue-good-table/dist/vue-good-table.css" />
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
label {
  font-weight: bold;
}
.w-18 { width: 4.5rem; }
</style>
