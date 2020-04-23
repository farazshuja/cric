<template>
  <div class="h-100">
    <div class="mb-5">
      <div class="flex flex-row">
        <div>
          <div
            v-for="(player, i) in players"
            :key="i"
            :class="{'facing' : player.isFacing }"
            class="bat-row"
            @click="setActive(player)"
          >
            <label class="inline-block w-18">{{ player.player }}:</label>
            <span>{{ player.runs }} ({{ player.balls }})</span> <span class="text-sm italic">{{ player.out }}</span>
            <span v-if="player.isFacing" class="pl-2 text-mehroon">&#9728;</span>
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
        @click="setActiveBaller(baller)"
      >
        <label class="inline-block w-18">{{ baller.country }}:
          <span v-if="baller.isBalling" class="pl-2 text-mehroon">&#9728;</span>
        </label>
        {{ ballToOvers(baller.balls) }} - {{ baller.runs }} - {{ baller.outs }}W
      </div>
    </div>
    <p class="mt-5 text-center">
      <button
        v-for="i in scr"
        :key="i"
        class="border-2 border-gray text-gray py-1 px-8 font-semibold rounded mx-1 my-1 text-3xl"
        @click="addBall(i)"
      >
        {{ i }}
      </button>
    </p>
    <p class="mt-5 text-center">
      <button
        class="border-2 border-gray text-gray py-3 px-4 font-semibold rounded mx-1 my-1"
        @click="outBall('C.O.')"
      >
        C.O.
      </button>
      <button
        class="border-2 border-gray text-gray py-3 px-4 font-semibold rounded mx-1 my-1"
        @click="outBall('B.O.')"
      >
        B.O.
      </button>
      <button
        class="border-2 border-gray text-gray py-3 px-1 font-semibold rounded mx-1 my-1"
        @click="showCustom = !showCustom"
      >
        Custom
      </button>
      <button
        class="border-2 border-gray text-gray py-3 px-1 font-semibold rounded mx-1 my-1"
        @click="undoLastBall"
      >
        UNDO
      </button>
    </p>
    <custom-ball
      v-if="showCustom"
      :current-tab="currentTab"
      :players="players"
      @cancel="showCustom = false"
    />
    <custom-menu
      v-if="showCustomMenu"
      @cancel="showCustomMenu = false"
      @customMenu="onCustomMenu"
    />
    <p class="mt-3 text-center">
      <button
        class="border-2 border-gray text-gray py-1 px-5 font-semibold rounded mx-1"
        @click="$router.push({ name: 'Home' })"
      >
        HOME
      </button>
      <button
        class="border-2 border-gray text-gray py-1 px-5 font-semibold rounded mx-1"
        @click="showCustomMenu = true"
      >
        +++
      </button>
      <!-- <button
        class="border-2 border-gray text-gray py-1 px-5 font-semibold rounded mx-1"
        @click="innsDeclare"
      >
        DECLARE
      </button> -->
    </p>
    <div class="fixed bottom-0 left-0 w-full">
      <div class="tabs flex flex-row">
        <div
          v-for="(tab, i) in tabs"
          :key="tab"
          :class="{'bg-green': i === currentTab}"
          class="text-red py-3 flex-grow text-center"
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
import CustomMenu from '../components/CustomMenu.vue';
import CustomBall from '../components/CustomBall.vue';

export default {
  components: {
    CustomBall,
    CustomMenu,
  },
  data() {
    return {
      currentTab: 0, // inns 1
      showCustom: false,
      showCustomMenu: false,
      tabs: ['INNS - 1', 'INNS - 2', 'INNS - 3', 'INNS-4', 'POINTS'],
      scr: [0, 1, 2, 3, 4, 6],
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
    onCustomMenu(e) {
      if (e === 'Declare') {
        this.innsDeclare();
      } else if (e === 'Save') {
        this.save();
      } else if (e === 'Delete') {
        this.delete();
      }
    },
    openTab(i) {
      if (this.match.inns[i] || i === 4) {
        this.currentTab = i;
      } else {
        alert('No inns');
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
    save() {
      firebase.firestore()
        .collection('matches')
        .doc(this.match.id)
        .update(this.match)
        .then(() => {
          alert('Saved successfully');
        });
    },
    delete() {
      // eslint-disable-next-line
      if(confirm('Are you sure, you want to delete local?')) {
        localStorage.removeItem('match');
        this.$router.push({ name: 'Home' });
      }
    },
  },
};
</script>