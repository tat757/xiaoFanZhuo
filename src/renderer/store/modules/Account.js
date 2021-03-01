import fanfou from '../../../api/request'

const account = {
  state: {
    avatar: '',
    userId: '',
    isLogin: false
  },
  getters: {
    checkLogin(state) {
      return state.isLogin
    }
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
    SET_USERID (state, id) {
      state.userId = id
    },
    LOGIN (state) {
      state.isLogin = true
    },
    LOGOUT (state) {
      state.isLogin = false
    }
  },
  actions: {
    Login(context) {
      return new Promise((resolve, reject) => {
        try {
          fanfou.authorize((data) => {
            context.commit('LOGIN')
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
            context.commit('LOGOUT')
            resolve()
          })
        } catch (err) {
          reject(err)
        }
      })
    },
    GetUserInfo(context, params) {
      return new Promise((resolve, reject) => {
        fanfou.get('/users/show', params).then((res) => {
          if (!params) {
            context.commit('SET_AVATAR', res.profile_image_url)
            context.commit('SET_USERID', res.id)
          }
          resolve(res)
        }).catch((err) => {
          console.log(err)
        })
      })
    }
  } 
}
export default account