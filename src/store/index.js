import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    countries: {
      PAK: ['PAK-P1', 'PAK-P3'],
      SL: ['SL-P1', 'SL-P3'],
      SA: ['SA-P1', 'SA-P3'],
      WI: ['WI-P1', 'WI-P3'],
      AUS: ['AUS-P1', 'AUS-P3'],
      ENG: ['ENG-P1', 'ENG-P3'],
    },
    teams: [
      'Team1',
      'Team2',
    ],
  },
  getters: {
    getCountries(state) {
      return Object.keys(state.countries);
    },
    getTeams(state) {
      return Object.keys(state.teams);
    },
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  },
});
