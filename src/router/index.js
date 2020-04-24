import Vue from 'vue';
// import firebase from 'firebase';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/new-match',
    name: 'NewMatch',
    component: () => import('../views/NewMatch.vue'),
  },
  {
    path: '/last-match',
    name: 'LastMatch',
    component: () => import('../views/LastMatch.vue'),
  },
  {
    path: '/best-players',
    name: 'BestPlayers',
    component: () => import('../views/BestPlayers.vue'),
  },
  {
    path: '/best-ballers',
    name: 'BestBallers',
    component: () => import('../views/BestBallers.vue'),
  },
  {
    path: '/series',
    name: 'Series',
    component: () => import('../views/Series.vue'),
  },
  {
    path: '/view-match/:id',
    name: 'ViewMatch',
    component: () => import('../views/ViewMatch.vue'),
    props: (route) => ({ id: route.params.id }),
  },
  {
    path: '/series-points/:series',
    name: 'SeriesPoints',
    component: () => import('../views/SeriesPoints.vue'),
    props: (route) => ({ series: route.params.series }),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

// router.beforeEach((to, from, next) => {
//   const user = firebase.auth().currentUser;
//   if (user) {
//     next();
//   } else if (to.name !== 'Login') {
//     next({ name: 'Login' });
//   }
//   next();
// });

export default router;
