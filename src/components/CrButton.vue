<template>
  <button
    class="bg-transparent hover:bg-liver text-liver font-semibold my-2 mx-1 hover:text-white border border-liver hover:border-transparent rounded"
    :class="btnSize"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'CrButton',
  props: {
    size: {
      type: String,
      default: 'md', // 'sm', 'md', 'lg', 'xl'
    },
  },
  computed: {
    btnSize() {
      if (this.size === 'lg') {
        return {
          'py-4': true,
          'px-10': true,
          'w-40': true,
        };
      }
      if (this.size === 'r') {
        return {
          'py-2': true,
          'px-8': true,
          'text-4xl': true,
        };
      }
      // md case
      return {
        'py-2': true,
        'px-4': true,
      };
    },
  },
};
</script>
