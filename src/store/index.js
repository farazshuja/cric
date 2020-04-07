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
    match: null,
    /*
    match: {
      series: 'Series',
      team1: ['PAK', 'SA'],
      team2: ['SL', 'WI'],
      toBat: 'Team1',
      toBall: 'Team2',
      inns: [
        {
          isDeclared: false,
          balls: [
            {
              id: '0.1',  // 0.0 for out without ball
              run: 1,
              ballBy: 'WI',
              playedBy: 'SA-P1',
              outBy: 'C.O. by WI'
            }
          ]
        }
      ]
    }
    */
  },
  getters: {
    getCountries(state) {
      return Object.keys(state.countries);
    },
    getTeams(state) {
      return state.teams;
    },
  },
  mutations: {
    setMatch(state, data) {
      this.match = data;
      this.match.inns = [{
        isDeclared: false,
        balls: [],
      }];

      localStorage.setItem('match', JSON.stringify(data));
    },
  },
  actions: {
  },
  modules: {
  },
});
