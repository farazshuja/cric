<template>
  <div class="flex flex-col items-center h-full justify-center">
    <button
      :class="btnClass"
      @click="newMatch()"
    >Match</button>
    <button
      :class="btnClass"
      @click="getSeries"
    >Series</button>
    <button
      :class="btnClass"
      @click="getHallOfFames"
    >Hall of Fames</button>
    <button
      :class="btnClass"
      @click="logout"
    >Logout</button>
  </div>
</template>

<script>
import firebase from 'firebase';

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
    logout() {
      firebase.auth().signOut().then(() => {
        this.$router.replace({ name: 'Login' });
      });
    },
  },
};
</script>
