import Vue from 'vue';
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
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
