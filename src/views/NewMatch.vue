<template>
  <div class="h-100">
    <div class="flex flex-row mb-5">
      <label class="w-32">Tournament:</label>
      <input class="w-48" type="text" list="series" />
      <datalist id="series">
        <option>Series-1</option>
      </datalist>
    </div>
    <div class="flex flex-row mb-5">
      <label class="w-32">Team1:</label>
      <select v-model="country1" class="w-48">
        <option
          v-for="country in countries"
          :key="country"
        >
          {{ country }}
        </option>
      </select>
      <span class="ml-5 mr-5 text-gray-500">-and-</span>
      <select v-model="country2" class="w-48">
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
      <select v-model="country3" class="w-48">
        <option
          v-for="country in countries"
          :key="country"
        >
          {{ country }}
        </option>
      </select>
      <span class="ml-5 mr-5 text-gray-500">-and-</span>
      <select v-model="country4" class="w-48">
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
      <select v-model="bat" class="w-48">
        <option
          v-for="team in teams"
          :key="team"
        >
          {{ team }}
        </option>
      </select>
    </div>
    <div class="flex flex-row mb-5">
      <label class="w-32">Bowl:</label>
      <select v-model="bowl" class="w-48">
        <option
          v-for="team in teams"
          :key="team"
        >
          {{ team }}
        </option>
      </select>
    </div>
    <p class="text-center">
      <button class="border-2 border-blue-500 text-blue-600 py-2 px-4 font-semibold rounded">
        Start
      </button>
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      country1: 'PAK',
      country2: 'SA',
      country3: 'SL',
      country4: 'WI',
      teams: ['Team1', 'Team2'],
      bat: 'Team1',
      bowl: 'Team2',
    };
  },
  computed: {
    ...mapGetters({
      countries: 'getCountries',
      teams: 'getTeams',
    }),
  },
};
</script>
