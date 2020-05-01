<template>
  <nav class="fixed top-0 left-0 w-full p-2 flex bg-liver items-center justify-between flex-wrap">
    <div class="block">
      <button
        class="flex items-center px-3 py-2 border-2 rounded text-white"
        @click="showMenu = !showMenu"
      >
        <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
      </button>
    </div>
    <div
      v-if="showMenu"
      class="w-full block flex-grow flex items-center w-auto"
    >
      <div class="text-sm flex-grow">
        <div
          v-for="link in links"
          :key="link"
          class="block cursor-pointer mt-4 mt-0 text-white mr-4"
          @click="$emit('linkClick', link)"
        >
          {{ link }}
        </div>
        <div
          class="block cursor-pointer mt-4 mt-0 text-white"
          @click="$router.push({ name: 'Home' })"
        >
          Home
        </div>
      </div>
    </div>
</nav>
</template>

<script>
// @ is an alias to /src
// import CrButton from '@/components/CrButton.vue';

export default {
  name: 'CrNav',
  // components: {
  //   CrButton,
  // },
  props: {
    links: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      showMenu: false,
    };
  },
};
</script>
