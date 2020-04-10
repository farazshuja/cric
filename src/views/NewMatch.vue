<template>
  <div class="h-100">
    <div class="flex flex-row mb-5">
      <label class="w-32">Series:</label>
      <input v-model="series" class="flex-grow" type="text" list="series" />
      <datalist id="series">
        <option>Series-1</option>
        <option>Series-2</option>
        <option>Series-3</option>
      </datalist>
    </div>
    <div class="flex flex-row mb-5">
      <label class="w-32">Team1:</label>
      <select v-model="country1" class="flex-grow">
        <option
          v-for="country in countries"
          :key="country"
        >
          {{ country }}
        </option>
      </select>
      <span class="px-2 text-gray-500">and</span>
      <select v-model="country2" class="flex-grow">
        <option
          v-for="country in countries"
          :key="country"
        >
          {{ country }}
        </option>
      </select>
    </div>
    <div class="flex flex-row mb-5">
      <label class="w-32">Team2:</label>
      <select v-model="country3" class="flex-grow">
        <option
          v-for="country in countries"
          :key="country"
        >
          {{ country }}
        </option>
      </select>
      <span class="px-2 text-gray-500">and</span>
      <select v-model="country4" class="flex-grow">
        <option
          v-for="country in countries"
          :key="country"
        >
          {{ country }}
        </option>
      </select>
    </div>
    <div class="flex flex-row mb-5">
      <label class="w-32">Bat:</label>
      <select v-model="toBat" class="flex-grow">
        <option
          v-for="team in teams"
          :key="team"
        >
          {{ team }}
        </option>
      </select>
    </div>
    <div class="flex flex-row mb-5">
      <label class="w-32">Ball:</label>
      <select v-model="toBall" class="flex-grow">
        <option
          v-for="team in teams"
          :key="team"
        >
          {{ team }}
        </option>
      </select>
    </div>
    <p class="text-center">
      <button
        class="border-2 border-gray text-gray py-1 px-5 font-semibold rounded"
        @click="startMatch()"
      >
        Start
      </button>
      <button
        class="border-2 border-gray text-gray py-1 px-5 font-semibold rounded ml-1"
        @click="$router.push({ name: 'Home' })"
      >
        Cancel
      </button>
    </p>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return {
      country1: 'PAK',
      country2: 'SA',
      country3: 'SL',
      country4: 'WI',
      series: 'Series-1',
      toBat: 'Team1',
      toBall: 'Team2',
    };
  },
  computed: {
    ...mapGetters({
      countries: 'getCountries',
      teams: 'getTeams',
    }),
  },
  async created() {
    // redirect to last match if there is some match in LocalStorage
    const match = localStorage.getItem('match');
    if (match) {
      await this.setMatch(JSON.parse(match));
      this.$router.push({ name: 'LastMatch' });
    }
  },
  methods: {
    isNewMatchValid() {
      if (this.toBat === this.toBall || !this.series) {
        return false;
      }
      const teams = [this.country1, this.country2, this.country3, this.country4];
      const set = new Set(teams);
      return teams.length === set.size;
    },
    startMatch() {
      if (this.isNewMatchValid()) {
        const data = {
          series: this.series,
          team1: [this.country1, this.country2].sort(),
          team2: [this.country3, this.country4].sort(),
          toBat: this.toBat,
          toBall: this.toBall,
        };
        this.setMatch(data);
        this.$router.push({ name: 'LastMatch' });
      }
    },
    ...mapMutations(['setMatch']),
  },
};
</script>
