<template>
  <div class="h-100">
    <cr-nav
      :links="['Back']"
      @linkClick="onNavClick"
    />
    <div
      v-if="currentTab !== 4"
      class="mt-12 mb-5"
    >
      <div class="flex flex-row">
        <div>
          <div
            v-for="(player, i) in players"
            :key="i"
            :class="{'facing' : player.isFacing }"
            class="bat-row"
          >
            <label class="inline-block w-18">{{ player.player }}:</label>
            <span>{{ player.runs }} ({{ player.balls }})</span> <span class="text-sm italic">{{ player.out }}</span>
            <span v-if="player.isFacing" class="pl-2 text-liver">&#9728;</span>
          </div>
        </div>
        <div class="total ml-1 pl-1 text-right flex-grow">
          <div class="text-3xl">{{ total.runs}}/<span class="text-2xl">{{total.outs}}</span></div>
          <div class="text-2xl">{{total.overs}} ov</div>
        </div>
      </div>
      <hr class="mt-4 mb-2" />
      <div
        v-for="baller in ballers"
        :key="baller.country"
        class="balling"
      >
        <label class="inline-block w-18">{{ baller.country }}:
          <span v-if="baller.isBalling" class="pl-2 text-liver">&#9728;</span>
        </label>
        {{ ballToOvers(baller.balls) }} - {{ baller.runs }} - {{ baller.outs }}W
      </div>
    </div>
    <points
      v-else class="mt-12"
      :match="match"
    />
    <div class="fixed bottom-0 left-0 w-full bg-opal">
      <div class="tabs flex flex-row">
        <div
          v-for="(tab, i) in tabs"
          :key="tab"
          :class="{'bg-liver text-white': i === currentTab}"
          class="cursor-pointer py-3 flex-grow text-center"
          @click="openTab(i)"
        >
          {{ tab }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase';
import ballToOvers, { matchToBats, matchToBallers } from '@/utils.js';
import CrNav from '@/components/CrNav.vue';
import Points from '../components/Points.vue';
// import matchData from '../data/match.json';

export default {
  name: 'ViewMatch',
  components: {
    CrNav,
    Points,
  },
  props: {
    id: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      currentTab: 0, // inns 1
      tabs: ['INNS - 1', 'INNS - 2', 'INNS - 3', 'INNS-4', 'POINTS'],
      match: null,
    };
  },
  computed: {
    players() {
      return matchToBats(this.match, this.currentTab);
    },
    ballers() {
      return matchToBallers(this.match, this.currentTab);
    },
    total() {
      const total = {
        runs: 0,
        overs: '0.0',
        outs: 0,
      };
      let totalBalls = 0;

      this.players.forEach((player) => {
        if (player.out !== 'not out' && player.out !== 'DNB') {
          total.outs += 1;
        }
        total.runs += player.runs;
        totalBalls += player.balls;
      });
      total.overs = ballToOvers(totalBalls);
      return total;
    },
  },
  async created() {
    this.$store.commit('setIsLoading', true);
    firebase.firestore()
      .collection('matches')
      .doc(this.id)
      .get()
      .then(async (d) => {
        this.$store.commit('setIsLoading', false);
        const match = d.data();
        if (!match) {
          alert('No match found');
          this.$router.push({ name: 'Home' });
        }
        this.match = match;
        this.activateLastInns();
      });
  },
  methods: {
    ballToOvers,
    // activate the last inns or show Points
    activateLastInns() {
      this.currentTab = this.match.inns.length - 1;
    },
    openTab(i) {
      if (this.match.inns[i] || i === 4) {
        this.currentTab = i;
      }
    },
    onNavClick(e) {
      if (e === 'Back') {
        this.$router.push({ name: 'Series' });
      }
    },
  },
};
</script>
