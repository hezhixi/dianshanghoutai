import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Subject from '@/views/Subject.vue'
import User from '@/views/users/User.vue'
Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    { name: 'Login', path: '/login', component: Login },
    { path: '/', redirect: '/login' },
    { name: 'Home',
      path: '/home',
      component: Home,
      redirect: { name: 'Subject' },
      children: [
        { name: 'Subject', path: 'subject', component: Subject },
        { name: 'User', path: 'user', component: User }

      ] }
  ]
})
