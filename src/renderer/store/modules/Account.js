import fanfou from '../../../api/request'

const account = {
  state: {
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
    GetUserInfo(context, params) {
      return new Promise((resolve, reject) => {
        fanfou.get('/users/show', params).then((res) => {
          if (!params) {
            context.commit('SET_AVATAR', res.profile_image_url)            
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