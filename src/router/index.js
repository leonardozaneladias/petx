import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import ListServices from '../views/ListServices.vue'
import Agendar from '../views/Agendar.vue'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  
  {
    path: '/services',
    name: 'ListServices',
    component: ListServices,
    beforeEnter(to, from, next) {
      const token = localStorage.getItem('token')
      if(token){
        next();
      }else{
        next({
          name: "Login" // back to safety route //
        });
      }
    },
    meta: {
      title: 'Serviços'
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    beforeEnter(to, from, next) {
      const token = localStorage.getItem('token')
      if(token){
        next();
      }else{
        next({
          name: "Login" // back to safety route //
        });
      }
    },
    meta: {
      title: 'Home'
    }
  },
  {
    path: '/agendar/:id',
    name: 'Agendar',
    component: Agendar,
    props: true,
    beforeEnter(to, from, next) {
      const token = localStorage.getItem('token')
      if(token){
        next();
      }else{
        next({
          name: "Login" // back to safety route //
        });
      }
    },
    meta: {
      title: 'Agendar'
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {
      title: 'About'
    }
  },
  {
    path: '/agendamentos',
    name: 'Agendamentos',
    beforeEnter(to, from, next) {
      const token = localStorage.getItem('token')
      if(token){
        next();
      }else{
        next({
          name: "Login" // back to safety route //
        });
      }
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Agendamentos.vue'),
    meta: {
      title: 'Agendamentos'
    }
  },
  {
    path: '/meus-pets',
    name: 'MeusPets',
    props: true,
    beforeEnter(to, from, next) {
      const token = localStorage.getItem('token')
      if(token){
        next();
      }else{
        next({
          name: "Login" // back to safety route //
        });
      }
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/MeusPets.vue'),
    meta: {
      title: 'Meus Pets'
    }
  },
  {
    path: '/pet/create',
    name: 'PetCreate',
    props: true,
    beforeEnter(to, from, next) {
      const token = localStorage.getItem('token')
      if(token){
        next();
      }else{
        next({
          name: "Login" // back to safety route //
        });
      }
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/PetCreate.vue'),
    meta: {
      title: 'Cadastrar Pet'
    }
  },
  {
    path: '/pet/:id',
    name: 'Pet',
    props: true,
    beforeEnter(to, from, next) {
      const token = localStorage.getItem('token')
      if(token){
        next();
      }else{
        next({
          name: "Login" // back to safety route //
        });
      }
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Pet.vue'),
    meta: {
      title: 'Pet'
    }
  },
  
  {
    path: '/agendamento-detalhes/:id',
    name: 'AgendamentoDetalhes',
    props: true,
    beforeEnter(to, from, next) {
      const token = localStorage.getItem('token')
      if(token){
        next();
      }else{
        next({
          name: "Login" // back to safety route //
        });
      }
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AgendamentoDetalhes.vue'),
    meta: {
      title: 'Agendamento Detalhes'
    }
  },
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Login'
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
