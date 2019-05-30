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
    InitTimeline(context, options) {
      options = options || {}
      return new Promise((resolve, reject) => {
        const params = {
          count: 20,
          format: 'html'
        }
        let url = ''
        if (options.isPerson) {
          url = '/statuses/user_timeline'
        } else {
          url = '/statuses/home_timeline'
        }
        if (options.id) {
          params.id = options.id
        }
        fanfou.get(url, params).then((res) => {
          resolve(res)
        }).catch((err) => {
          console.log(err)
        })
      })
    },
    InitMention() {
      return new Promise((resolve, reject) => {
        const option = {
          count: 20
        }
        fanfou.get('/statuses/mentions', option).then((res) => {
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
    GetFavorite(context, params) {
      const url = '/favorites/' + params.id
      return new Promise((resolve, reject) => {
        fanfou.get(url, { page: params.page, format: 'html' }).then((res) => {
          resolve(res)
        }).catch((err) => {
          console.log(err)
        })
      })
    },
    GetNewStatus(context, params) {
      params.format = 'html'
      let url = ''
      if (params.isPerson) {
        url = '/statuses/user_timeline'
      } else {
        url = '/statuses/home_timeline'
      }
      return new Promise((resolve, reject) => {
        fanfou.get(url, params).then((res) => {
          resolve(res)
        }).catch((err) => {
          console.log(err)
        })
      })
    },
    GetNewMention(context, params) {
      return new Promise((resolve, reject) => {
        fanfou.get('/statuses/mentions', params).then((res) => {
          resolve(res)
        }).catch((err) => {
          console.log(err)
        })
      })
    }
  } 
}
export default status