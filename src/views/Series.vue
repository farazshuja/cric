<template>
  <div class="series">
    <cr-nav
      :links="['New Match', 'Back']"
      @linkClick="onNavClick"
    />
    <div
      v-if="series"
      class="mt-12 flex flex-col"
    >
      <div
        v-for="(s, i) in series"
        :key="i"
        class="bg-white shadow-md rounded-lg px-3 py-2 mb-2"
      >
        <div
          @click="onSeriesClick(s)"
          class="block cursor-pointer hover:text-silver text-liver text-lg font-semibold py-2 px-2"
        >
            {{ s.series }}
        </div>
        <div
          v-for="(m, j) in s.matches"
          :key="j"
          class="text-sm"
          @click="onMatchClick(m)"
        >
            <div class="flex justify-start cursor-pointer text-gray hover:text-white hover:bg-opal rounded-md px-2 py-2">
                <span class="bold text-silver">Match {{ s.matches.length - j}}.</span>
                <div class="flex-grow font-medium px-2">{{ m.team1.join('-') }} vs {{m.team2.join('-') }}</div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import CrNav from '@/components/CrNav.vue';

export default {
  name: 'Series',
  components: {
    CrNav,
  },
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
        const data = await this.$store.dispatch('getSeries');
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

        Object.keys(series).sort((a, b) => {
          const a1 = Number(a.split('-'));
          const b1 = Number(b.split('-'));
          return b1 - a1;
        }).forEach((key) => {
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
    onNavClick(e) {
      if (e === 'Back') {
        this.$router.push({ name: 'Home' });
      } else if (e === 'New Match') {
        this.$router.push({ name: 'NewMatch' });
      }
    },
    ...mapMutations(['setMatch']),
  },
};
</script>
