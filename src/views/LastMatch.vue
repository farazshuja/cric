<template>
  <div class="h-100">
    <div class="flex flex-row mb-5">
      <div class="flex-grow">
        <div class="bat-row facing">
          <label class="inline-block w-16">SA-P1:</label>
          <span>32 (13 b)</span> <span class="text-sm italic"> not out</span>
          <span class="pl-2 text-lg">&#42;</span>
        </div>
        <div class="bat-row">
          <label class="inline-block w-16">SL-P1:</label>
          <span>32 (13 b)</span> <span class="text-sm italic"> not out</span>
        </div>
        <div class="bat-row">
          <label class="inline-block w-16">???:</label>
          <span class="text-sm italic">YTB</span>
        </div>
      </div>
      <div class="flex-grow">
        <div class="balling">
          <label class="inline-block w-16">WI: <span class="text-lg">&#42;</span></label>
          <span class="inline-block px-1">0</span>
          <span class="inline-block px-1">1</span>
          <span class="inline-block px-1">W</span>
          <span class="inline-block px-1">4</span>
          <span class="inline-block px-1">6</span>
          <span class="inline-block px-1">2</span>
        </div>
        <div>
          <label class="inline-block w-16">PAK:</label>
        </div>
      </div>
    </div>
    <div class="total">
      <label class="inline-block w-16">Total:</label>
      <span>64/0 (2.4 overs)</span>
    </div>
    <p class="mt-10 text-center">
      <button class="border-2 border-gray text-gray py-1 px-5 font-semibold rounded mx-1">
        1
      </button>
      <button class="border-2 border-gray text-gray py-1 px-5 font-semibold rounded mx-1">
        2
      </button>
      <button class="border-2 border-gray text-gray py-1 px-5 font-semibold rounded mx-1">
        3
      </button>
      <button class="border-2 border-gray text-gray py-1 px-5 font-semibold rounded mx-1">
        4
      </button>
      <button class="border-2 border-gray text-gray py-1 px-5 font-semibold rounded mx-1">
        6
      </button>
    </p>
    <p class="mt-2 text-center">
      <button class="border-2 border-gray text-gray py-1 px-4 font-semibold rounded mx-1">
        Catch Out
      </button>
      <button class="border-2 border-gray text-gray py-1 px-4 font-semibold rounded mx-1">
        Bowled Out
      </button>
      <button class="border-2 border-gray text-gray py-1 px-4 font-semibold rounded mx-1">
        Custom
      </button>
      <button class="border-2 border-gray text-gray py-1 px-4 font-semibold rounded mx-1">
        UNDO
      </button>
    </p>
    <p class="mt-10 text-center">
      <button
        class="border-2 border-gray text-gray py-1 px-5 font-semibold rounded mx-1"
        @click="$router.push({ name: 'Home' })"
      >
        HOME
      </button>
      <button class="border-2 border-gray text-gray py-1 px-5 font-semibold rounded mx-1">
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

export default {
  data() {
    return {
      currentTab: 0, // inns 1
      tabs: ['INNS - 1', 'INNS - 2', 'INNS - 3', 'INNS-4', 'POINTS'],
    };
  },
  computed: {
    ...mapGetters({
      countries: 'getCountries',
      teams: 'getTeams',
    }),
  },
  methods: {
    openTab(i) {
      this.currentTab = i;
    },
    addBall() {

    },
  },
};
</script>
