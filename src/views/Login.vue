<template>
  <div class="flex flex-col items-center h-full justify-center">
    <div class="flex flex-row mb-5">
      <input placeholder="Password" v-model="password" class="flex-grow text-2xl px-2 py-2" type="text" />
    </div>
    <div>
      <button
        class="border-2 border-gray text-gray py-1 px-5 font-semibold rounded"
        @click="login()"
      >
        Login
      </button>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase';
import { mapGetters } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      password: '',
    };
  },
  computed: {
    ...mapGetters(['getIsLoading']),
  },
  methods: {
    login() {
      this.$store.commit('setIsLoading', true);
      firebase.auth().signInWithEmailAndPassword('farazshuja@gmail.com', this.password).then(
        () => {
          this.$store.commit('setIsLoading', false);
          this.$router.replace({ name: 'Home' });
        },
        (err) => {
          this.$store.commit('setIsLoading', false);
          alert(`Oops. ${err.message}`);
        },
      );
    },
  },
};
</script>
