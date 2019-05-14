import fanfou from '../../../api/request'
import { stat } from 'fs';

const account = {
  state: {
    username: '',
    avatar: ''
  },
  mutations: {
    DECREMENT_MAIN_COUNTER (state) {
      state.main--
    },
    INCREMENT_MAIN_COUNTER (state) {
      state.main++
    },
    SET_AVATAR (state, avatar) {
      state.avatar = avatar
    },
    SET_USERNAME (state, username) {
      state.username = username
    }
  },
  actions: {
    Login() {
      return new Promise((resolve, reject) => {
        try {
          fanfou.authorize((data) => {
            resolve()
          })
        } catch(err) {
          reject(err)
        }
      })
    },
    Logout() {
      return new Promise((resolve, reject) => {
        try {
          fanfou.logout().then((res) => {
            resolve()
          })
        } catch (err) {
          reject(err)
        }
      })
    },
    GetCurrUser(context) {
      return new Promise((resolve, reject) => {
        fanfou.get('/users/show').then((res) => {
          context.commit('SET_AVATAR', res.profile_image_url)
          context.commit('SET_USERNAME', res.name)
          resolve()
        })
      })
    }
  } 
}
export default account