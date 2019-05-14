import Vue from 'vue'
import Vuex from 'vuex'

import { createPersistedState, createSharedMutations } from 'vuex-electron'

import account from './modules/Account'
import status from './modules/Status'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    account,
    status
  },
  plugins: [
    createPersistedState(),
    // createSharedMutations()
  ],
  strict: process.env.NODE_ENV !== 'production'
})
export default store