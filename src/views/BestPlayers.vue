<template>
  <div class="flex flex-col items-center h-full justify-center">
    <h1 class="text-2xl">Best players</h1>
    <vue-good-table
      :sort-options="{
        enabled: true,
        initialSortBy: {field: 'average', type: 'desc'}
      }"
      :columns="columns"
      :rows="rows"/>
  </div>
</template>

<script>
import { VueGoodTable } from 'vue-good-table';
import { mapGetters } from 'vuex';

const players = {};

export default {
  name: 'BestPlayers',
  components: {
    VueGoodTable,
  },
  data() {
    return {
      columns: [
        { label: 'Player', field: 'player' },
        { label: 'Inns', field: 'inns', type: 'number' },
        { label: 'Runs', field: 'runs', type: 'number' },
        { label: 'Balls', field: 'balls', type: 'number' },
        { label: 'Average', field: 'average', type: 'number' },
        { label: 'S/R', field: 'strikeRate', type: 'number' },
        { label: 'Highest', field: 'highestScore', type: 'number' },
        { label: 'Not outs', field: 'notOuts', type: 'number' },
        { label: 'Dots', field: 'dots', type: 'number' },
        { label: 'Dots %', field: 'dotsPer100Balls', type: 'number' },
        { label: 'Ducks', field: 'ducks', type: 'number' },
        { label: '4\'s', field: 'fours', type: 'number' },
        { label: '6\'s', field: 'sixes', type: 'number' },
        { label: '20\'s', field: 'twenties', type: 'number' },
      ],
      rows: [],
    };
  },
  computed: {
    ...mapGetters({
      getAllPlayers: 'getAllPlayers',
    }),
  },
  created() {
    this.calculateBestPlayers();
    const rows = [];
    Object.keys(players).forEach((key, i) => {
      rows[i] = players[key];
      rows[i].player = key;
      rows[i].id = i + 1;
    });
    this.rows = rows;
  },
  methods: {
    async calculateBestPlayers() {
      this.$store.commit('setIsLoading', true);
      this.$store.getters.getAllPlayers.forEach((player) => {
        players[player] = {
          matches: 0,
          inns: 0,
          runs: 0,
          balls: 0,
          average: 0,
          strikeRate: 0,
          highestScore: 0,
          notOuts: 0,
          dots: 0,
          dotsPer100Balls: 0,
          ducks: 0,
          fours: 0,
          sixes: 0,
          twenties: 0,
          thirtyFives: 0,
        };
      });
      const response = await fetch('https://us-central1-cric-bdc72.cloudfunctions.net/allMatches');
      const data = await response.json();
      console.log(data);

      data.forEach((d) => {
        d.inns.forEach((inn) => {
          if (inn.balls.length === 0) {
            return;
          }
          inn.bats.forEach((bat) => {
            if (bat.player !== '---') {
              players[bat.player].inns += 1;
              players[bat.player].ducks += bat.runs === 0;
              players[bat.player].notOuts += bat.out === 'not out';
              players[bat.player].twenties += bat.runs >= 20;
              players[bat.player].thirtyFives += bat.runs >= 35;
              players[bat.player].thirtyFives -= players[bat.player].twenties;
              players[bat.player].highestScore = bat.runs > players[bat.player].highestScore ? bat.runs : players[bat.player].highestScore;
              players[bat.player].matches += 1;
            }
          });

          inn.balls.forEach((b) => {
            players[b.playedBy].dots += b.runs === 0;
            players[b.playedBy].runs += b.runs;
            players[b.playedBy].balls += 1;
            players[b.playedBy].fours += b.runs === 4 ? 1 : 0;
            players[b.playedBy].sixes += b.runs === 6 ? 1 : 0;
          });
        });
      });

      Object.keys(players).forEach((key) => {
        const outs = players[key].inns - players[key].notOuts;
        players[key].average = outs ? (players[key].runs / outs).toFixed(2) : 'N/A';
        players[key].strikeRate = (100 * (players[key].runs / players[key].balls)).toFixed(2);
        players[key].dotsPer100Balls = parseInt(100 * (players[key].dots / players[key].balls), 10);
      });
      this.$store.commit('setIsLoading', false);
    },
  },
};
</script>
