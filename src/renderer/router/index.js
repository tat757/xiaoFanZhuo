import Vue from 'vue'
import Router from 'vue-router'

import Full from '../views/Full'
import Timeline from '../views/Homepage'
import Mention from '../views/Mention'
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
          name: '时间轴',
          component: Timeline
        },
        {
          path: 'mention',
          name: '提到我的',
          component: Mention
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
