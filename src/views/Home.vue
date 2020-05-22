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
    <span class="fixed bottom-0 right-0 text-sm p-1">v. 2.4</span>
  </div>
</template>

<script>
import firebase from 'firebase';
import CrButton from '@/components/CrButton.vue';

export default {
  name: 'Home',
  components: {
    CrButton,
  },
  methods: {
    deleteLastMatch() {
      localStorage.removeItem('match');
    },
    newMatch() {
      this.$router.push({ name: 'NewMatch' });
    },
    saveLastMatch() {
      const matches = firebase.firestore()
        .collection('matches');
      const lastMatch = localStorage.getItem('match');
      matches.add(JSON.parse(lastMatch))
        .then(() => {
          alert('Saved successfully');
        })
        .catch(() => alert('Save failed'));
    },
    getSeries() {
      this.$router.push({ name: 'Series' });
    },
    getHallOfFames() {
      this.$router.push({ name: 'BestPlayers' });
    },
  },
};
</script>
