import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './css/style.css'
import { LayoutPlugin, FormTextareaPlugin, NavPlugin, CardPlugin, ButtonPlugin, ImagePlugin, FormFilePlugin, ModalPlugin, SpinnerPlugin, DropdownPlugin } from 'bootstrap-vue'
Vue.use(FormTextareaPlugin)
Vue.use(LayoutPlugin)
Vue.use(NavPlugin)
Vue.use(CardPlugin)
Vue.use(ButtonPlugin)
Vue.use(ImagePlugin)
Vue.use(FormFilePlugin)
Vue.use(ModalPlugin)
Vue.use(SpinnerPlugin)
Vue.use(DropdownPlugin)

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
