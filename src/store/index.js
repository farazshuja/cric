/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';
import ballToOvers, { getNewInns, getTotal } from '@/utils.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoading: false,
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
      id: 'hash64',
      series: 'Series',
      team1: ['PAK', 'SA'],
      team2: ['SL', 'WI'],
      toBat: 'Team1',
      toBall: 'Team2',
      inns: [
        {
          status: 'declared' | 'all out' | 'all over',
          balls: [
            {
              id: '0.1',  // 0.0 for out without ball
              runs: 1, // 0 - 6
              ballBy: 'WI', // country name
              playedBy: 'SA-P1', // country-player
              out: DNB | not out | R.O. | B.O. | C.O.
              outBy: same as ballBy or in case of R.O. set corrent name here
              outPlayer: same as playedBy, in case of R.O. set corrent name here
            }
          ],
          bat: [{
            country: 'PAK',
            player: 'PAK-P1',
            runs: 0,
            balls: 0,
            out: '',  // out by outBy
            isFacing: false,
          }],
          ballers: [{
            country: 'WI',
            balls: 0,
            runs: 0, // runs given
            outs: 0, // wickets taken
            isBalling: true,
          }]
        }
      ]
    }
    */
  },
  getters: {
    getIsLoading(state) {
      return state.isLoading;
    },
    getAllPlayers(state) {
      return Object.keys(state.countries).flatMap((key) => state.countries[key]);
    },
    getCountries(state) {
      return Object.keys(state.countries);
    },
    getTeams(state) {
      return state.teams;
    },
    getCurrentMatch(state) {
      return state.match;
    },
    getBats: (state) => (innsIndex) => {
      if (state.match && state.match.inns && state.match.inns[innsIndex]) {
        return state.match.inns[innsIndex].bats;
      }
      return [];
    },
    getBallers: (state) => (innsIndex) => {
      if (state.match && state.match.inns && state.match.inns[innsIndex]) {
        return state.match.inns[innsIndex].ballers;
      }
      return [];
    },
  },
  mutations: {
    setIsLoading(state, payload) {
      state.isLoading = payload;
    },
    addBallToInns(state, { innsIndex, ball }) {
      const inns = state.match.inns[innsIndex];
      let { id } = ball;
      if (!id) {
        const balls = inns.balls.filter((b) => b.id !== '0.0').length;
        id = ballToOvers(balls + 1);
      }
      ball.id = id;
      inns.balls.push(ball);
    },
    // update players score card and isFacing status
    updatePlayerFromBall(state, innsIndex) {
      const inns = state.match.inns[innsIndex];
      // get the last ball
      const ball = inns.balls[inns.balls.length - 1];
      inns.bats.forEach((bat, i, arr) => {
        if (ball.id !== '0.0' && bat.player === ball.playedBy) {
          arr[i].balls += 1;
          arr[i].runs += ball.runs;
        }
        if (ball.outPlayer === bat.player) {
          arr[i].out = `${ball.out} by ${ball.outBy}`;
          arr[i].isFacing = false;

          // load P3
          if (arr[2].out === 'DNB') {
            arr[2].isFacing = true;
            arr[2].out = 'not out';
            arr[2].country = arr[i].country;
            arr[2].player = arr[i].player.replace('P1', 'P3');
          }
        }
      });

      inns.bats.filter((bat) => bat.out === 'not out').forEach((bat, i, arr) => {
        if (arr.length === 1) {
          arr[i].isFacing = true;
        }
      });

      if ((ball.id.endsWith('.0') && ball.runs % 2 === 0)
        || (!ball.id.endsWith('.0') && ball.runs % 2 !== 0)) {
        inns.bats.filter((bat) => bat.out === 'not out').forEach((bat, i, arr) => {
          if (arr.length === 2) {
            arr[i].isFacing = !arr[i].isFacing;
          }
        });
      }
    },
    updateBallerFromBall(state, innsIndex) {
      const inns = state.match.inns[innsIndex];
      // get the last ball
      const ball = inns.balls[inns.balls.length - 1];
      inns.ballers.forEach((baller, i, arr) => {
        if (ball.id !== '0.0' && baller.country === ball.ballBy) {
          arr[i].balls += 1;
          arr[i].runs += ball.runs;
        }

        if (baller.country === ball.outBy) {
          arr[i].outs += 1;
        }
        // switch baller
        if (ball.id.endsWith('.0')) {
          arr[i].isBalling = !arr[i].isBalling;
        }
      });
    },
    undoLastBall(state, innsIndex) {
      const inns = state.match.inns[innsIndex];
      const ball = inns.balls.pop();

      if (ball) {
        inns.bats.forEach((bat, i, arr) => {
          if (ball.id !== '0.0' && bat.player === ball.playedBy) {
            arr[i].balls -= 1;
            arr[i].runs -= ball.runs;

            if (arr[i].balls === 0 && arr[i].player.endsWith('P3')) {
              arr[i].out = 'DNB';
            } else if (ball.outBy) {
              arr[i].out = 'not out';
            }

            arr[i].isFacing = true;
          } else {
            arr[i].isFacing = false;
          }
        });

        inns.ballers.forEach((baller, i, arr) => {
          if (ball.id !== '0.0' && baller.country === ball.ballBy) {
            arr[i].balls -= 1;
            arr[i].runs -= ball.runs;

            arr[i].isBalling = true;
          } else {
            arr[i].isBalling = false;
          }
          if (baller.country === ball.outBy) {
            arr[i].outs -= 1;
          }
        });
      }
    },
    // set active batsman
    setActive(state, { innsIndex, playerName }) {
      state.match.inns[innsIndex].bats.forEach((bat, i, arr) => {
        arr[i].isFacing = bat.player === playerName;
      });
    },
    setActiveBaller(state, { innsIndex, country }) {
      state.match.inns[innsIndex].ballers.forEach((baller, i, arr) => {
        arr[i].isBalling = baller.country === country;
      });
    },
    setMatch(state, data) {
      const toBat = data[data.toBat.toLowerCase()];
      const toBall = data[data.toBall.toLowerCase()];
      data.inns = data.inns || [getNewInns(toBat, toBall)];

      state.match = data;
      // localStorage.setItem('match', JSON.stringify(data));
    },
    // Push new inns if all-out, all-over, or inns declared
    handleNextInns(state, { innsIndex, isDeclared }) {
      const curBat = getTotal(state.match.inns[innsIndex].bats);
      let nextToBat = state.match.inns[innsIndex].ballers.map((b) => b.country);
      let nextToBall = state.match.inns[innsIndex].bats.slice(0, 2).map((b) => b.country);
      if ((curBat.outs === 3 || curBat.balls === 60) || isDeclared) {
        if (innsIndex === 1) {
          const preBat = getTotal(state.match.inns[0].bats);
          // follow on
          if ((preBat.runs / 2) > curBat.runs) {
            [nextToBat, nextToBall] = [nextToBall, nextToBat];
          }
        }
        state.match.inns = [
          ...state.match.inns,
          getNewInns(nextToBat, nextToBall),
        ];
      }
    },
  },
  actions: {
    addBall(context, { innsIndex, ball }) {
      context.commit('addBallToInns', { innsIndex, ball });
      context.commit('updatePlayerFromBall', innsIndex);
      context.commit('updateBallerFromBall', innsIndex);
      context.commit('handleNextInns', { innsIndex, isDeclared: false });
      localStorage.setItem('match', JSON.stringify(context.state.match));
    },
    undoLastBall(context, innsIndex) {
      context.commit('undoLastBall', innsIndex);
      localStorage.setItem('match', JSON.stringify(context.state.match));
    },
  },
  modules: {
  },
});
