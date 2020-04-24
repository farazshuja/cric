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
// import { mapGetters } from 'vuex';
import { merge } from 'lodash-es';
import ballToOvers, { getTotal } from '../utils';

export const runsToPoints = (runs) => {
  const fp = runs - 20;
  let pts = 0;
  if (fp > 0) {
    pts = 1;
    pts += parseInt(fp / 15, 10);
  }
  return pts;
};

export const innsToBatPoints = (inn) => {
  const p = {};
  inn.bats.forEach((b) => {
    p[b.country] = {
      batPoints: runsToPoints(b.runs),
    };
  });
  return p;
};

export const teamResult = (team1, p1, team2, p2) => {
  const result = {};
  result[team1[0]] = { WLD: p1 };
  result[team1[1]] = { WLD: p1 };
  result[team2[0]] = { WLD: p2 };
  result[team2[1]] = { WLD: p2 };
  return result;
};

export const innsToTeamPoints = (inn) => {
  const p = {};
  let totalRuns = 0;
  inn.bats.forEach((b) => {
    totalRuns += b.runs;
  });
  const t1 = inn.bats[0].country;
  const t2 = inn.bats[1].country;
  const pts = runsToPoints(totalRuns);
  p[t1] = { batTeamPoints: pts };
  p[t2] = { batTeamPoints: pts };
  return p;
};

export const scoreToWinPoints = (score) => {
  let result = null;
  if (score && score.length === 2) {
    const totalInns = score[0].inns.length + score[1].inns.length;
    const team1 = score[0].team.split('-');
    const team2 = score[1].team.split('-');
    result = teamResult(team1, 0, team2, 0);
    // follow on case
    if (totalInns === 3 && score[0].inns.length === 1 && score[1].inns[1].outs === 3) {
      if ((score[1].inns[0].runs + score[1].inns[1].runs) < score[0].inns[0].runs) {
        result = teamResult(team1, 5, team2, 0);
      }
    } else if (totalInns === 3 && score[0].inns.length === 2 && score[0].inns[1].outs === 3) {
      if ((score[0].inns[0].runs + score[0].inns[1].runs) < score[1].inns[0].runs) {
        result = teamResult(team1, 0, team2, 5);
      }
    } else if (totalInns === 4) {
      if (score[1].inns[1].outs === 3) {
        if ((score[0].inns[0].runs + score[0].inns[1].runs) < (score[1].inns[0].runs + score[1].inns[1].runs)) {
          result = teamResult(team1, 0, team2, 5);
        } else {
          result = teamResult(team1, 5, team2, 0);
        }
      } else if ((score[0].inns[0].runs + score[0].inns[1].runs) < (score[1].inns[0].runs + score[1].inns[1].runs)) {
        result = teamResult(team1, 0, team2, 5);
      }
    }
  }
  return result; // no result so far
};

export const innsToBallerPoints = (inn) => {
  const p = {};
  inn.ballers.forEach((b) => {
    p[b.country] = {
      ballerPoints: b.outs,
    };
  });
  return p;
};

export default {
  data() {
    return {
      score: null,
      points: null,
    };
  },
  created() {
    this.loadAllRuns();
  },
  methods: {
    ballToOvers,
    loadAllRuns() {
      const { match } = this.$store.state;
      const result = {};
      let points = {};
      if (match) {
        match.inns.forEach((inn, i) => {
          const bats = this.$store.getters.getBats(i);
          const team = [...new Set(bats.map((b) => b.country))].sort().join('-');
          const total = getTotal(bats);
          if (total.balls === 0) {
            return;
          }
          if (result[team]) {
            result[team].push(total);
          } else {
            result[team] = [total];
          }

          // bat n ball points are only for first inns
          if (i < 2) {
            points = merge(
              points,
              innsToBatPoints(inn),
              innsToBallerPoints(inn),
              innsToTeamPoints(inn),
            );
          }
        });
      }
      this.score = Object.keys(result).map((key) => ({
        team: key,
        inns: result[key],
      }));
      points = merge(points, scoreToWinPoints(this.score));
      this.points = Object.keys(points).map((key) => {
        const p = points[key];
        const total = p.batPoints + p.ballerPoints + p.batTeamPoints + p.WLD;
        return {
          country: key,
          total,
          ...p,
        };
      }).sort((a, b) => b.total - a.total);
    },
  },
};
</script>

<style>
</style>
