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
      <span>{{ remainingOvers }} overs</span>
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
import ballToOvers, { calculateAllPoints } from '../utils';


export default {
  data() {
    return {
      score: null,
      points: null,
      remaingBalls: 150,
    };
  },
  computed: {
    remainingOvers() {
      return ballToOvers(this.remaingBalls);
    },
  },
  created() {
    this.loadAllRuns();
  },
  methods: {
    ballToOvers,
    loadAllRuns() {
      const { match } = this.$store.state;
      const obj = calculateAllPoints(match);
      this.score = obj.score;
      this.points = obj.points;
      this.remaingBalls = obj.remaingBalls;
    },
  },
};
</script>

<style>
</style>
