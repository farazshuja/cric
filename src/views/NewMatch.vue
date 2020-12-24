<template>
  <div class="h-100">
    <cr-nav
      :links="['Back']"
      @linkClick="onNavClick"
    />
    <div class="flex flex-row mt-12 mb-5">
      <label class="w-32">Series:</label>
      <input v-model="series" class="flex-grow" type="text" list="series" />
      <datalist id="series">
        <option>Series-12</option>
        <option>Series-13</option>
        <option>Series-14</option>
        <option>Series-15</option>
        <option>Series-16</option>
        <option>Series-17</option>
      </datalist>
    </div>
    <div class="flex flex-row mb-5">
      <label
        class="w-32"
        @click="isBatting = 'Team1'"
      >
        Team1: <span v-if="isBatting === 'Team1'">🏏</span>
      </label>
      <select v-model="country1" class="flex-grow">
        <option
          v-for="country in countries"
          :key="country"
        >
          {{ country }}
        </option>
      </select>
      <span class="px-2 text-gray-500">and</span>
      <select v-model="country2" class="flex-grow">
        <option
          v-for="country in countries"
          :key="country"
        >
          {{ country }}
        </option>
      </select>
    </div>
    <div class="flex flex-row mb-5">
      <label
        class="w-32"
        @click="isBatting = 'Team2'"
      >
        Team2: <span v-if="isBatting === 'Team2'">🏏</span>
      </label>
      <select v-model="country3" class="flex-grow">
        <option
          v-for="country in countries"
          :key="country"
        >
          {{ country }}
        </option>
      </select>
      <span class="px-2 text-gray-500">and</span>
      <select v-model="country4" class="flex-grow">
        <option
          v-for="country in countries"
          :key="country"
        >
          {{ country }}
        </option>
      </select>
    </div>
    <div class="flex flex-row mb-5">
      <label class="w-32">One Day</label>
      <input type="checkbox" v-model="isOneDay" />
    </div>
    <p class="text-center">
      <cr-button @click.native="startMatch()">Start</cr-button>
      <cr-button @click.native="$router.push({ name: 'Home' })">Cancel</cr-button>
    </p>
  </div>
</template>

<script>
import firebase from 'firebase';
import { mapGetters, mapMutations } from 'vuex';
import CrButton from '@/components/CrButton.vue';
import CrNav from '@/components/CrNav.vue';

export default {
  name: 'NewMatch',
  components: {
    CrNav,
    CrButton,
  },
  data() {
    return {
      country1: 'PAK',
      country2: 'SA',
      country3: 'SL',
      country4: 'WI',
      series: 'Series-8',
      toBat: 'Team1',
      toBall: 'Team2',
      isBatting: 'Team1',
      isOneDay: false,
    };
  },
  computed: {
    ...mapGetters({
      countries: 'getCountries',
      teams: 'getTeams',
    }),
  },
  async created() {
    // redirect to last match if there is some match in LocalStorage
    const match = localStorage.getItem('match');
    if (match) {
      await this.setMatch(JSON.parse(match));
      this.$router.push({ name: 'LastMatch' });
    }
  },
  methods: {
    isNewMatchValid() {
      if (!this.series) {
        return false;
      }
      const teams = [this.country1, this.country2, this.country3, this.country4];
      const set = new Set(teams);
      return teams.length === set.size;
    },
    startMatch() {
      if (this.isNewMatchValid()) {
        const data = {
          series: this.series,
          team1: [this.country1, this.country2].sort(),
          team2: [this.country3, this.country4].sort(),
          toBat: this.isBatting === 'Team1' ? 'Team1' : 'Team2',
          toBall: this.isBatting === 'Team1' ? 'Team2' : 'Team1',
          timestamp: parseInt(new Date().getTime() / 1000, 10),
          isOneDay: this.isOneDay,
        };
        const matches = firebase.firestore()
          .collection('matches');

        matches.add(data)
          .then((d) => {
            data.id = d.id;
            this.setMatch(data);
            localStorage.setItem('match', JSON.stringify(data));
            this.$router.push({ name: 'LastMatch' });
          })
          .catch(() => alert('Save failed'));
      } else {
        alert('Match no valid');
      }
    },
    onNavClick(e) {
      if (e === 'Back') {
        this.$router.push({ name: 'Home' });
      }
    },
    ...mapMutations(['setMatch']),
  },
};
</script>
