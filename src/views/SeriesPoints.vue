<template>
  <div class="flex flex-col h-full">
    <cr-nav
      :links="['Back']"
      @linkClick="onNavClick"
    />
    <table
      v-if="points.length > 0"
      class="w-full mt-12"
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
    <best-players :series="series" />
  </div>
</template>

<script>
import firebase from 'firebase';
import CrNav from '@/components/CrNav.vue';
import BestPlayers from '@/views/BestPlayers.vue';
import { addOrPush, calculateAllPoints } from '../utils';


export default {
  name: 'SeriesPoints',
  components: {
    BestPlayers,
    CrNav,
  },
  data() {
    return {
      points: {},
    };
  },
  props: {
    series: {
      type: String,
      default: null,
    },
  },
  created() {
    if (this.series) {
      this.loadSeriesPoints();
    } else {
      alert('No series');
    }
  },
  methods: {
    loadSeriesPoints() {
      const vm = this;
      const points = {};
      vm.$store.commit('setIsLoading', true);
      firebase.firestore()
        .collection('matches')
        .where('series', '==', this.series)
        .get()
        .then((querySnapshot) => {
          const matches = [];
          querySnapshot
            .docs
            .sort((a, b) => a.timestamp - b.timestamp)
            .forEach((d) => {
              const obj = calculateAllPoints(d.data());
              matches.push(obj.points);
            });
          matches.forEach((match) => {
            match.forEach((c) => {
              addOrPush(points, c.country, 'WLD', c.WLD);
              addOrPush(points, c.country, 'ballerPoints', c.ballerPoints);
              addOrPush(points, c.country, 'batPoints', c.batPoints);
              addOrPush(points, c.country, 'batTeamPoints', c.batTeamPoints);
              addOrPush(points, c.country, 'total', c.total);
            });
          });
          this.points = Object.keys(points).map((key) => {
            const point = points[key];
            return {
              country: key,
              WLD: point.WLD.reduce((a, b) => a + b, 0),
              ballerPoints: point.ballerPoints.reduce((a, b) => a + b, 0),
              batPoints: point.batPoints.reduce((a, b) => a + b, 0),
              batTeamPoints: point.batTeamPoints.reduce((a, b) => a + b, 0),
              total: point.total.reduce((a, b) => a + b, 0),
            };
          }).sort((a, b) => b.total - a.total);
          this.$store.commit('setIsLoading', false);
        });
    },
    onNavClick(e) {
      if (e === 'Back') {
        this.$router.push({ name: 'Series' });
      }
    },
  },
};
</script>
