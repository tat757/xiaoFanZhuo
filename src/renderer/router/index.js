import Vue from 'vue'
import Router from 'vue-router'

import Full from '../views/Full'
import Timeline from '../views/Homepage'
import Mention from '../views/Mention'
import Login from '../views/Login'
import Profile from '../views/Profile'
import PersonTimeline from '../views/PersonTimeline'
import PersonPhoto from '../views/PersonPhoto'
import PersonFavorite from '../views/PersonFavorite'
import WelcomePage from '../views/WelcomePage'

import MessageList from '../views/Message/index'
import Message from '../views/Message/_id'

import PhotoStatus from '../views/PhotoStatus'

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
      path: '/profile',
      name: 'profile',
      redirect: '/profile/timeline',
      component: Profile,
      children: [
        {
          path: 'timeline/:id',
          name: '个人时间轴',
          component: PersonTimeline
        },
        {
          path: 'photo/:id',
          name: '照片',
          component: PersonPhoto
        },
        {
          path: 'favorite/:id',
          name: '收藏',
          component: PersonFavorite
        }
      ]
    },
    {
      path: '/message',
      name: 'MessageList',
      component: MessageList
    },
    {
      path: '/message/:id',
      name: 'Message',
      component: Message
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/welcome',
      name: 'Welcome',
      component: WelcomePage
    },
    {
      path: '/photoStatus/:id',
      name: '测试',
      component: PhotoStatus
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
