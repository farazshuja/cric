<template>
  <div
    class="fixed top-0 left-0 w-full h-full bg-beige text-center"
    style="z-index: 2"
  >
    <div class="flex flex-row mb-2 mt-10 h-10">
      <label class="w-32">Ball:</label>
      <select class="flex-grow" v-model="custom.id">
        <option>Yes</option>
        <option>No</option>
      </select>
    </div>
    <div class="flex flex-row mb-2 h10">
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
    <div class="flex flex-row mb-2 h-10">
      <label class="w-32">Ball by:</label>
      <select class="flex-grow" v-model="custom.ballBy">
        <option
          v-for="country in getBallCountries"
          :key="country"
        >
          {{ country }}
        </option>
      </select>
    </div>
    <div class="flex flex-row mb-2 h-10">
      <label class="w-32">Played by:</label>
      <select class="flex-grow" v-model="custom.playedBy">
        <option
          v-for="pl in getBatsmen"
          :key="pl"
        >
          {{ pl }}
        </option>
      </select>
    </div>
    <div class="flex flex-row mb-2 h-10">
      <label class="w-32">Out:</label>
      <select class="flex-grow" v-model="custom.out">
        <option>DNB</option>
        <option>not out</option>
        <option>R.O.</option>
        <option>B.O.</option>
        <option>C.O.</option>
      </select>
    </div>
    <div class="flex flex-row mb-2 h-10">
      <label class="w-32">Out By:</label>
      <select class="flex-grow" v-model="custom.outBy">
        <option></option>
        <option
          v-for="country in getBallCountries"
          :key="country"
        >
          {{ country }}
        </option>
      </select>
    </div>
    <div class="flex flex-row mb-2 h-10">
      <label class="w-32">Out Player:</label>
      <select class="flex-grow" v-model="custom.outPlayer">
        <option></option>
        <option
          v-for="pl in getBatsmen"
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
    <button
      class="border-2 border-gray text-gray py-1 px-5 font-semibold rounded mx-1"
      @click="$emit('cancel')"
    >Cancel</button>
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
    getBatsmen() {
      return this.getBats(this.currentTab).map((b) => b.player).filter((b) => b !== '---');
    },
    getBallCountries() {
      return this.getBallers(this.currentTab).map((b) => b.country);
    },
    ...mapGetters({
      getBats: 'getBats',
      getBallers: 'getBallers',
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

      this.$emit('cancel');
    },
  },
};
</script>

<style>
</style>
