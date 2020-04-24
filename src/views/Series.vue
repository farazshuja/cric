<template>
  <div class="flex flex-col h-full">
    <p class="mt-3 text-center">
      <button
        class="border-2 border-gray text-gray py-1 px-5 font-semibold rounded mx-1"
        @click="$router.push({ name: 'Home' })"
      >
        HOME
      </button>
      <button
        class="border-2 border-gray text-gray py-1 px-5 font-semibold rounded mx-1"
        @click="$router.push({ name: 'NewMatch' })"
      >
        NEW MATCH
      </button>
    </p>
    <ul
      v-for="s in series"
      :key="s.series"
      class="mb-4"
    >
      <li
        class="text-2xl"
        @click="onSeriesClick(s)"
      >
        {{ s.series }}
      </li>
      <li
        v-for="(match, i) in s.matches"
        :key="i"
        class="pl-8 py-2"
        @click="onMatchClick(match)"
      >
        Match-{{ s.matches.length - i }}
        <span class="text-sm">{{ match.team1 }} vs {{ match.team2 }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'Series',
  data() {
    return {
      series: [],
    };
  },
  created() {
    this.loadSeries();
  },
  methods: {
    async loadSeries() {
      this.$store.commit('setIsLoading', true);
      try {
        const response = await fetch('https://us-central1-cric-bdc72.cloudfunctions.net/getSeries');
        const data = await response.json();
        const series = {};
        data.forEach((d) => {
          const match = {
            id: d.id,
            team1: d.team1,
            team2: d.team2,
          };
          if (series[d.series]) {
            series[d.series].push(match);
          } else {
            series[d.series] = [match];
          }
        });

        Object.keys(series).sort().reverse().forEach((key) => {
          this.series.push({
            series: key,
            matches: series[key],
          });
        });
      // eslint-disable-next-line
      } catch (e) {}
      this.$store.commit('setIsLoading', false);
    },
    onMatchClick(match) {
      const localMatch = localStorage.getItem('match');
      if (localMatch) {
        const matchData = JSON.parse(localMatch);
        if (matchData.id === match.id) {
          this.setMatch(JSON.parse(localMatch));
          this.$router.push({ name: 'LastMatch' });
          return;
        }
      }
      this.$router.push({ name: 'ViewMatch', params: { id: match.id } });
    },
    onSeriesClick(s) {
      this.$router.push({ name: 'SeriesPoints', params: { series: s.series } });
    },
    ...mapMutations(['setMatch']),
  },
};
</script>
