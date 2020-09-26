<template>
  <div
    class="mb-5"
  >
    <div
      v-for="(s, i) in score"
      :key="i"
    >
      <div class="total">
        <label class="inline-block w-18">{{ s.team }}:</label>
        <span
          v-for="(inn, j) in s.inns"
          :key="j"
        >
          {{ inn.runs}}/{{inn.outs}} ({{ ballToOvers(inn.balls) }} overs)
          <span class="text-sm px-1" v-if="j===0">&#9882;</span>
        </span>
      </div>
    </div>
    <div>
      <label class="inline-block mt-2 mr-2">Remaining:</label>
      <span>{{ remainingOvers }} ov / {{ leading.team }} lead: {{ leading.runs }}</span>
    </div>
    <hr class="mt-5" />
    <table
      v-if="points"
      class="w-full"
    >
      <tr>
          <th class="text-left">Country</th>
          <th class="text-right">B</th>
          <th class="text-right">W</th>
          <th class="text-right">TB</th>
          <th class="text-right">WLD</th>
          <th class="text-right">Total</th>
      </tr>
      <tr
        v-for="(point, i) in points"
        :key="i"
      >
        <td><label>{{ point.country }}</label></td>
        <td class="text-right">{{ point.batPoints }}</td>
        <td class="text-right">{{ point.ballerPoints }}</td>
        <td class="text-right">{{ point.batTeamPoints }}</td>
        <td class="text-right">{{ point.WLD }}</td>
        <td class="text-right">{{ point.total }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import ballToOvers, { calculateAllPoints, matchToScoreCard } from '../utils';


export default {
  props: {
    match: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      score: null,
      points: null,
      remaingBalls: 150,
      leading: {
        team: '',
        runs: '',
      },
      scoreCard: {},
    };
  },
  computed: {
    remainingOvers() {
      return ballToOvers(this.remaingBalls);
    },
  },
  created() {
    this.loadAllRuns();
    if (this.match) {
      this.scoreCard = matchToScoreCard(this.match);
    }
  },
  methods: {
    ballToOvers,
    loadAllRuns() {
      const match = this.match || this.$store.state.match;
      const obj = calculateAllPoints(match);
      this.score = obj.score;
      this.points = obj.points;
      this.remaingBalls = obj.remaingBalls;

      if (this.score.length === 2) {
        const t1Score = this.score[0].inns.reduce((prev, cur) => prev + cur.runs, 0);
        const t2Score = this.score[1].inns.reduce((prev, cur) => prev + cur.runs, 0);

        if (t1Score > t2Score) {
          this.leading.team = this.score[0].team;
          this.leading.runs = t1Score - t2Score;
        } else {
          this.leading.team = this.score[1].team;
          this.leading.runs = t2Score - t1Score;
        }
      }
    },
  },
};
</script>

<style>
</style>
