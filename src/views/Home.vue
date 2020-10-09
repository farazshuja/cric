<template>
  <div class="flex flex-col items-center h-full justify-center">
    <cr-button
      size="lg"
      @click.native="newMatch"
    >Match</cr-button>
    <cr-button
      size="lg"
      @click.native="getSeries"
    >Series</cr-button>
    <span class="fixed bottom-0 right-0 text-sm p-1">v. 3.0</span>
  </div>
</template>

<script>
import CrButton from '@/components/CrButton.vue';

export default {
  name: 'Home',
  components: {
    CrButton,
  },
  methods: {
    newMatch() {
      this.$router.push({ name: 'NewMatch' });
    },
    getSeries() {
      this.$router.push({ name: 'Series' });
    },
  },
};
</script>
