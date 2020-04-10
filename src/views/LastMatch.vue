<template>
  <div class="h-100">
    <div class="mb-5">
      <div
        v-for="(player, i) in players"
        :key="i"
        :class="{'facing' : player.isFacing }"
        class="bat-row"
        @click="setActive(player)"
      >
        <label class="inline-block w-24">{{ player.player }}:</label>
        <span>{{ player.runs }} ({{ player.balls }})</span> <span class="text-sm italic">{{ player.out }}</span>
        <span v-if="player.isFacing" class="pl-2 text-mehroon">&#9728;</span>
      </div>
      <hr class="mt-2 mb-2" />
      <div class="total">
        <label class="inline-block w-24">Total:</label>
        <span>{{ total.runs}}/{{total.outs}} ({{total.overs}} overs)</span>
      </div>
      <hr class="mt-4 mb-2" />
      <div
        v-for="baller in ballers"
        :key="baller.country"
        class="balling"
        @click="setActiveBaller(baller)"
      >
        <label class="inline-block w-24">{{ baller.country }}:
          <span v-if="baller.isBalling" class="pl-2 text-mehroon">&#9728;</span>
        </label>
        {{ ballToOvers(baller.balls) }} - {{ baller.runs }} - {{ baller.outs }}W
      </div>
    </div>
    <p class="mt-10 text-center">
      <button
        v-for="i in 7"
        :key="i"
        class="border-2 border-gray text-gray py-1 px-4 font-semibold rounded mx-1"
        @click="addBall(i - 1)"
      >
        {{ i - 1 }}
      </button>
    </p>
    <p class="mt-2 text-center">
      <button
        class="border-2 border-gray text-gray py-1 px-1 font-semibold rounded mx-1 my-1"
        @click="outBall('C.O.')"
      >
        Catch Out
      </button>
      <button
        class="border-2 border-gray text-gray py-1 px-4 font-semibold rounded mx-1 my-1"
        @click="outBall('B.O.')"
      >
        Bowled Out
      </button>
      <button
        class="border-2 border-gray text-gray py-1 px-4 font-semibold rounded mx-1 my-1"
        @click="showCustom = !showCustom"
      >
        Custom
      </button>
      <button
        class="border-2 border-gray text-gray py-1 px-4 font-semibold rounded mx-1 my-1"
        @click="undoLastBall"
      >
        UNDO
      </button>
    </p>
    <custom-ball
      v-if="showCustom"
      :current-tab="currentTab"
      :players="players"
    />
    <p class="mt-10 text-center">
      <button
        class="border-2 border-gray text-gray py-1 px-5 font-semibold rounded mx-1"
        @click="$router.push({ name: 'Home' })"
      >
        HOME
      </button>
      <button
        class="border-2 border-gray text-gray py-1 px-5 font-semibold rounded mx-1"
        @click="innsDeclare"
      >
        DECLARE
      </button>
    </p>
    <div class="fixed bottom-0 left-0 w-full">
      <div class="tabs flex flex-row">
        <div
          v-for="(tab, i) in tabs"
          :key="tab"
          :class="{'bg-green': i === currentTab}"
          class="text-red py-1 flex-grow text-center"
          @click="openTab(i)"
        >
          {{ tab }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ballToOvers from '@/utils.js';
import CustomBall from '../components/CustomBall.vue';

export default {
  components: {
    CustomBall,
  },
  data() {
    return {
      currentTab: 0, // inns 1
      showCustom: false,
      tabs: ['INNS - 1', 'INNS - 2', 'INNS - 3', 'INNS-4', 'POINTS'],
    };
  },
  computed: {
    players() {
      return this.getBats(this.currentTab);
    },
    ballers() {
      return this.getBallers(this.currentTab);
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
    ...mapGetters({
      countries: 'getCountries',
      teams: 'getTeams',
      match: 'getCurrentMatch',
      getBats: 'getBats',
      getBallers: 'getBallers',
      getAllPlayers: 'getAllPlayers',
    }),
  },
  async created() {
    if (!this.match) {
      const match = localStorage.getItem('match');
      if (match) {
        await this.$store.commit('setMatch', JSON.parse(match));
      } else {
        alert('No match found');
        this.$router.push({ name: 'Home' });
      }
    }
    this.activateLastInns();
  },
  methods: {
    ballToOvers,
    setActive(player) {
      if (player.out === 'not out') {
        this.$store.commit('setActive', {
          innsIndex: this.currentTab,
          playerName: player.player,
        });
      }
    },
    setActiveBaller(baller) {
      this.$store.commit('setActiveBaller', {
        innsIndex: this.currentTab,
        country: baller.country,
      });
    },
    // activate the last inns or show Points
    activateLastInns() {
      this.currentTab = this.match.inns.length - 1;
    },
    openTab(i) {
      if (this.match.inns[i] || i === 4) {
        this.currentTab = i;
      }
    },
    addBall(runs) {
      const player = this.players.filter((pl) => pl.isFacing);
      const baller = this.ballers.filter((bl) => bl.isBalling);
      if (!player[0]) {
        alert('Set the player first');
      }
      const ball = {
        runs,
        ballBy: baller[0].country,
        playedBy: player[0].player,
        out: 'not out',
      };
      this.$store.dispatch('addBall', {
        innsIndex: this.currentTab,
        ball,
      });
    },
    outBall(out) {
      const player = this.players.filter((pl) => pl.isFacing);
      const baller = this.ballers.filter((bl) => bl.isBalling);
      if (!player[0]) {
        alert('Set the player first');
      }
      const ball = {
        runs: 0,
        ballBy: baller[0].country,
        playedBy: player[0].player,
        out,
        outBy: baller[0].country,
        outPlayer: player[0].player,
      };
      this.$store.dispatch('addBall', {
        innsIndex: this.currentTab,
        ball,
      });
    },
    innsDeclare() {
      this.$store.commit('handleNextInns', { innsIndex: this.currentTab, isDeclared: true });
    },
    undoLastBall() {
      this.$store.dispatch('undoLastBall', this.currentTab);
    },
  },
};
</script>
