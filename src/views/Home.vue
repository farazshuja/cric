<template>
  <div class="flex flex-col items-center h-full justify-center">
    <button
      :class="btnClass"
      @click="newMatch()"
    >New Match</button>
    <button :class="btnClass">Edit Match</button>
    <button :class="btnClass">View Match</button>
  </div>
</template>

<script>

export default {
  name: 'Home',
  components: {
  },
  computed: {
    btnClass() {
      return ['w-48', 'font-bold', 'border-2', 'border-red', 'text-red', 'rounded', 'm-3', 'p-5'];
    },
  },
  methods: {
    newMatch() {
      this.$router.push({ name: 'NewMatch' });
    },
  },
};
</script>
