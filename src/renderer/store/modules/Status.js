import fanfou from '../../../api/request'

const status = {
  state: {
    updateTime: 0
  },
  mutations: {
    setUpdateTime(state, time) {
      state.updateTime = time
    }
  },
  actions: {
    InitTimeline() {
      return new Promise((resolve, reject) => {
        const option = {
          count: 20
        }
        fanfou.get('/statuses/home_timeline', option).then((res) => {
          resolve(res)
        }).catch((err) => {
          console.log(err)
        })
      })
    },
    NewStatus(context, params) {
      return new Promise((resolve, reject) => {
        fanfou.post('/statuses/update', params).then((res) => {
          context.commit('setUpdateTime', Date.now())
          resolve(res)
        }).catch((err) => {
          console.log(err)
        })
      })
    },
    DestroyStatus(context, params) {
      return new Promise((resolve, reject) => {
        fanfou.post('/statuses/destroy', params).then((res) => {
          resolve(res)
        }).catch((err) => {
          console.log(err)
        })
      })
    },
    Favorite(context, params) {
      return new Promise((resolve, reject) => {
        let url = ''
        if (params.destroy) {
          url = '/favorites/destroy/' + params.userId
        } else {
          url = '/favorites/create/' + params.userId
        }
        fanfou.post(url, {id: params.id}).then((res) => {
          resolve(res)
        }).catch((err) => {
          console.log(err)
        })
      })
    },
    UploadPhoto(context, params) {
      return new Promise((resolve, reject) => {
        fanfou.uploadPhoto(params).then((res) => {
          context.commit('setUpdateTime', Date.now())
          resolve(res)
        }).catch((err) => {
          console.log(err)
        })
      })
    },
    GetNewStatus(context, params) {
      return new Promise((resolve, reject) => {
        fanfou.get('/statuses/home_timeline', params).then((res) => {
          resolve(res)
        }).catch((err) => {
          console.log(err)
        })
      })
    }
  } 
}
export default status