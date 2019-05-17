import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './css/style.css'
import { Layout, FormTextarea, Nav, Card, Button, Image, FormFile, Modal, Spinner } from 'bootstrap-vue/es/components'
Vue.use(FormTextarea)
Vue.use(Layout)
Vue.use(Nav)
Vue.use(Card)
Vue.use(Button)
Vue.use(Image)
Vue.use(FormFile)
Vue.use(Modal)
Vue.use(Spinner)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
