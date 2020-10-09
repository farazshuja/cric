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
        this.series = await this.$store.dispatch('getSeriesGroup');
      } catch (e) {
        alert(e);
      }
      this.$store.commit('setIsLoading', false);
    },
    async onMatchClick(match) {
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
