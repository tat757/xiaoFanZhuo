import Vue from 'vue'
import Router from 'vue-router'

import Full from '../views/Full'
import Timeline from '../views/Timeline'
import Login from '../views/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      redirect: '/login',
      component: Full,
      children: [
        {
          path: 'timeline',
          name: 'Timeline',
          component: Timeline
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
