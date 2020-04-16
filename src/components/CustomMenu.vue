<template>
  <div
    class="fixed top-0 left-0 w-full h-full bg-beige text-center"
    style="z-index: 2"
  >
    <button
        v-for="btn in btns"
        :key="btn"
        class="border-2 border-gray text-gray py-1 px-5 font-semibold rounded mx-1"
        @click="btnClick(btn)"
      >
        {{ btn }}
      </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      btns: ['Declare', 'Save', 'Delete', 'Close'],
    };
  },
  methods: {
    btnClick(e) {
      this.$emit('customMenu', e);
      this.$emit('cancel');
    },
  },
};
</script>

<style>
</style>
