<template>
  <div class="flex flex-col items-center h-full justify-center">
    <h1 class="text-2xl">Best Ballers</h1>
    <vue-good-table
      :sort-options="{
        enabled: true,
        initialSortBy: {field: 'tenWicketsInBalls', type: 'asc'}
      }"
      :columns="columns"
      :rows="rows"/>
  </div>
</template>

<script>
import { VueGoodTable } from 'vue-good-table';
// import { mapGetters } from 'vuex';
import data from '@/data/allMatches.json';
import ballToOvers from '@/utils.js';

export const getBestBallerScore = (prevBest, baller) => {
  const newBest = {
    outs: baller.outs,
    runs: baller.runs,
    balls: baller.balls,
  };
  if (prevBest.outs < newBest.outs) {
    return newBest;
  }
  if (prevBest.outs === newBest.outs) {
    if (prevBest.runs < newBest.runs) {
      return prevBest;
    }
    if (prevBest.runs === newBest.runs) {
      if (prevBest.balls < newBest.balls) {
        return prevBest;
      }
      return newBest;
    }
    return newBest;
  }
  return prevBest;
};

const ballers = {};

export default {
  name: 'BestPlayers',
  components: {
    VueGoodTable,
  },
  data() {
    return {
      columns: [
        { label: 'Baller', field: 'baller' },
        { label: 'Inns', field: 'inns', type: 'number' },
        { label: 'Runs', field: 'runs', type: 'number' },
        { label: 'Balls', field: 'balls', type: 'number' },
        { label: 'Wickets', field: 'wickets', type: 'number' },
        { label: '10 wickets in balls', field: 'tenWicketsInBalls', type: 'number' },
        { label: 'Runs per over', field: 'eco', type: 'number' },
        { label: 'Maiden', field: 'maiden', type: 'number' },
        { label: 'Best', field: 'best' },
        { label: '4\'s', field: 'fours', type: 'number' },
        { label: '6\'s', field: 'sixes', type: 'number' },
      ],
      rows: [],
    };
  },
  computed: {
    // ...mapGetters({
    // }),
  },
  created() {
    this.calculateBestPlayers();
    const rows = [];
    Object.keys(ballers).forEach((key, i) => {
      rows[i] = ballers[key];
      rows[i].baller = key;
      rows[i].id = i + 1;
      rows[i].best = `${ballToOvers(rows[i].best.balls)}-${rows[i].best.runs}-${rows[i].best.outs}W`;
    });
    this.rows = rows;
  },
  methods: {
    async calculateBestPlayers() {
      this.$store.commit('setIsLoading', true);
      this.$store.getters.getCountries.forEach((country) => {
        ballers[country] = {
          inns: 0,
          runs: 0,
          balls: 0,
          overs: 0,
          wickets: 0,
          tenWicketsInBalls: 0,
          maiden: 0,
          eco: 0,
          highestScoreInOver: 0,
          fours: 0,
          sixes: 0,
          best: {
            runs: 0,
            balls: 0,
            outs: 0,
          },
        };
      });
      // const response = await fetch('https://us-central1-cric-bdc72.cloudfunctions.net/allMatches');
      // const data = await response.json();
      // console.log(data);
      data.forEach((d) => {
        d.inns.forEach((inn) => {
          if (inn.balls.length === 0) {
            return;
          }
          inn.ballers.forEach((baller) => {
            if (baller.balls > 0) {
              ballers[baller.country].inns += 1;
              ballers[baller.country].best = getBestBallerScore(ballers[baller.country].best, baller);
            }
          });

          let overScore = 0;
          let firstBall = false;
          inn.balls.forEach((b, i) => {
            firstBall = ((i + 1) % 6) === 1;
            if (firstBall) {
              overScore = b.runs;
              ballers[b.ballBy].overs += 1;
            } else {
              overScore += b.runs;
            }

            const lastBall = ((i + 1) % 6) === 0;
            if (lastBall) {
              ballers[b.ballBy].maiden += overScore === 0 ? 1 : 0;
            }

            ballers[b.ballBy].runs += b.runs;
            ballers[b.ballBy].balls += 1;
            if (b.outBy) {
              ballers[b.outBy].wickets += b.out !== 'not out' && b.out !== 'DNB';
            }
            ballers[b.ballBy].fours += b.runs === 4 ? 1 : 0;
            ballers[b.ballBy].sixes += b.runs === 6 ? 1 : 0;
          });
        });
      });

      Object.keys(ballers).forEach((key) => {
        const baller = ballers[key];
        const tenWicketsInBalls = parseInt((baller.balls / baller.wickets) * 10, 10);
        baller.tenWicketsInBalls = tenWicketsInBalls;
        baller.eco = ((baller.runs / baller.balls) * 6).toFixed(2);
      });
      this.$store.commit('setIsLoading', false);
    },
  },
};
</script>
