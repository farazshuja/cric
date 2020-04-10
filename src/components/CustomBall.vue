<template>
  <div class="text-center">
    <div class="flex flex-row mb-1">
      <label class="w-32">Ball:</label>
      <select class="flex-grow" v-model="custom.id">
        <option>Yes</option>
        <option>No</option>
      </select>
      <label class="w-32">Runs:</label>
      <select class="flex-grow" v-model="custom.runs">
        <option>0</option>
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
        <option>6</option>
      </select>
    </div>
    <div class="flex flex-row mb-1">
      <label class="w-32">Ball by:</label>
      <select class="flex-grow" v-model="custom.ballBy">
        <option
          v-for="country in countries"
          :key="country"
        >
          {{ country }}
        </option>
      </select>
      <label class="w-32">Played by:</label>
      <select class="flex-grow" v-model="custom.playedBy">
        <option
          v-for="pl in getAllPlayers"
          :key="pl"
        >
          {{ pl }}
        </option>
      </select>
    </div>
    <div class="flex flex-row mb-1">
      <label class="w-32">Out:</label>
      <select class="flex-grow" v-model="custom.out">
        <option>DNB</option>
        <option>not out</option>
        <option>R.O.</option>
        <option>B.O.</option>
        <option>C.O.</option>
      </select>
      <label class="w-32">Out By:</label>
      <select class="flex-grow" v-model="custom.outBy">
        <option></option>
        <option
          v-for="country in countries"
          :key="country"
        >
          {{ country }}
        </option>
      </select>
    </div>
    <div class="flex flex-row mb-1">
      <label class="w-32">Out Player:</label>
      <select class="flex-grow" v-model="custom.outPlayer">
        <option></option>
        <option
          v-for="pl in getAllPlayers"
          :key="pl"
        >
          {{ pl }}
        </option>
      </select>
    </div>
    <button
      class="border-2 border-gray text-gray py-1 px-5 font-semibold rounded mx-1"
      @click="addCustomBall"
    >Ok</button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    currentTab: {
      type: Number,
      default: 0,
    },
    players: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      custom: {
        id: 'Yes',
        runs: 0,
        ballBy: 'PAK',
        playedBy: 'PAK-P1',
        out: 'not out',
        outBy: '',
        outPlayer: '',
      },
    };
  },
  computed: {
    ...mapGetters({
      countries: 'getCountries',
      getAllPlayers: 'getAllPlayers',
    }),
  },
  methods: {
    addCustomBall() {
      const player = this.players.filter((pl) => pl.isFacing);
      if (!player[0]) {
        alert('Set the player first');
      }
      const ball = {
        runs: parseInt(this.custom.runs, 10),
        ballBy: this.custom.ballBy,
        playedBy: this.custom.playedBy,
        out: this.custom.out,
      };
      if (this.custom.id === 'No') {
        ball.id = '0.0';
      }
      if (this.custom.outBy) {
        ball.outBy = this.custom.outBy;
      }
      if (this.custom.outPlayer) {
        ball.outPlayer = this.custom.outPlayer;
      }
      this.$store.dispatch('addBall', {
        innsIndex: this.currentTab,
        ball,
      });
    },
  },
};
</script>

<style>
</style>
