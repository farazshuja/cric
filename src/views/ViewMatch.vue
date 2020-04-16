<template>
  <div class="h-100">
    <div class="mb-5">
      <div
        v-for="(player, i) in players"
        :key="i"
        :class="{'facing' : player.isFacing }"
        class="bat-row"
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
      >
        <label class="inline-block w-24">{{ baller.country }}:
          <span v-if="baller.isBalling" class="pl-2 text-mehroon">&#9728;</span>
        </label>
        {{ ballToOvers(baller.balls) }} - {{ baller.runs }} - {{ baller.outs }}W
      </div>
    </div>
    <p class="mt-3 text-center">
      <button
        class="border-2 border-gray text-gray py-1 px-5 font-semibold rounded mx-1"
        @click="$router.push({ name: 'Series' })"
      >
        BACK
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
import firebase from 'firebase';
import { mapGetters } from 'vuex';
import ballToOvers from '@/utils.js';

export default {
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
      match: 'getCurrentMatch',
      getBats: 'getBats',
      getBallers: 'getBallers',
      getAllPlayers: 'getAllPlayers',
    }),
  },
  async created() {
    firebase.firestore()
      .collection('matches')
      .doc(this.id)
      .get()
      .then(async (d) => {
        const match = d.data();
        if (match) {
          if (match) {
            await this.$store.commit('setMatch', match);
          } else {
            alert('No match found');
            this.$router.push({ name: 'Home' });
          }
        }
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
  },
};
</script>
