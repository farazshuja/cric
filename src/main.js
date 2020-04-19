import Vue from 'vue';
import firebase from 'firebase';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

const firebaseConfig = {
  apiKey: 'AIzaSyC-fjzGddATYnYeEd9np-4QG3me-wqgKG4',
  authDomain: 'cric-bdc72.firebaseapp.com',
  databaseURL: 'https://cric-bdc72.firebaseio.com',
  projectId: 'cric-bdc72',
  storageBucket: 'cric-bdc72.appspot.com',
  messagingSenderId: '918109148980',
  appId: '1:918109148980:web:ba8d3e4dd0e6952a97f761',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let app;
firebase.auth().onAuthStateChanged(async () => {
  if (!app) {
    await firebase.auth().currentUser;
    new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount('#app');
  }
});
