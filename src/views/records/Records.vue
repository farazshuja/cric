<template>
  <div class="flex flex-col items-center h-full justify-center">
    <h1 class="text-2xl">Worst Overs</h1>
    <vue-good-table
      :sort-options="{
        enabled: true,
      }"
      :columns="columns"
      :rows="rows"/>
  </div>
</template>

<script>
import { VueGoodTable } from 'vue-good-table';
import { isScoreCount } from '@/utils.js';

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

// const ballers = {};

export default {
  name: 'Records',
  components: {
    VueGoodTable,
  },
  data() {
    return {
      columns: [
        { label: 'Baller', field: 'baller' },
        { label: 'Runs', field: 'runs', type: 'number' },
        { label: '0\'s', field: 'zeros', type: 'number' },
        { label: '4\'s', field: 'fours', type: 'number' },
        { label: '6\'s', field: 'sixes', type: 'number' },
        { label: 'vsTeam', field: 'vsTeam' },
      ],
      rows: [],
    };
  },
  async created() {
    await this.calculateWorstOver();
  },
  methods: {
    async calculateWorstOver() {
      this.$store.commit('setIsLoading', true);
      const data = await this.$store.dispatch('getAllMatches');
      const overs = [];
      data.forEach((d) => {
        d.inns.forEach((inn) => {
          let rec = {
            runs: 0,
            zeros: 0,
            fours: 0,
            sixes: 0,
          };
          inn.balls.forEach((b) => {
            rec.runs += b.runs;
            rec.zeros += isScoreCount(b, 0);
            rec.fours += isScoreCount(b, 4);
            rec.sixes += isScoreCount(b, 6);
            if (b.id.indexOf('.0') > -1) { // last ball
              overs.push({
                baller: b.ballBy,
                vsTeam: d.team1.includes(b.ballBy) ? d.team2.join('-') : d.team1.join('-'),
                ...rec,
              });
              rec = {
                runs: 0,
                zeros: 0,
                fours: 0,
                sixes: 0,
              };
            }
          });
        });
      });
      const worstOvers = overs
        .sort((a, b) => b.runs - a.runs || b.sixes - a.sixes || b.fours - a.fours);
      this.rows = worstOvers.slice(0, 10);
      this.$store.commit('setIsLoading', false);
    },
  },
};
</script>
