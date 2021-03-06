import fanfou from '../../../api/request'

const status = {
  state: {
    updateTime: 0,
    cache: {},
    home_timeline: [],
    new_home_timeline: 0,
    mentions: [],
    new_mentions: 0,
    dataUpdateTime: 0
  },
  getters: {
    getCache(state) {
      return (id) => {
        return state.cache[id]
      }
    },
    getData(state) {
      return (type) => {
        return {
          data: state[type],
          numNew: 'new_' + type
        }
      }
    }
  },
  mutations: {
    setUpdateTime(state, time) {
      state.updateTime = time
    },
    setCache(state, status) {
      if (!status) {
        state.cache = {}
      } else {
        for (let i = status.length - 1; i >= 0; i--) {
          state.cache[status[i].id] = status[i]
        }
      }
    },
    setData(state, {type, data, isAdd, isPrefix}) {
      const ids = []
      for (let i = 0; i < data.length; i++) {
        ids.push(data[i].id)
      }
      if (isAdd) {
        if (isPrefix) {
          state['new_' + type] = ids.length
          state[type] = ids.concat(state[type])
        } else {
          state[type] = state[type].concat(ids)
        }
      } else {
        state[type] = ids
      }
      state.dataUpdateTime = Date.now()
    },
    setCacheFavorited(state, status) {
      state.cache[status.id].favorited = status.favorited
    },
    removeCache(state, id) {
      if (!id) {
        state.cache = {}
      } else {
        state.cache[id] = null
      }
    }
  },
  actions: {
    InitData(context) {
      return new Promise((resolve, reject) => {
        fanfou.initData().then(res => {
          for (const type in res) {
            context.commit('setData', {type: type, data: res[type]})
            context.commit('setCache', res[type])
          }
          resolve()
        })
      })
    },
    InitTimeline(context, options) {
      options = options || {}
      context.commit('setCache')
      return new Promise((resolve, reject) => {
        let params = {
          count: 20,
          format: 'html'
        }
        if (options.id) {
          params.id = options.id
        }
        let url = ''
        if (options.isPerson) {
          url = '/statuses/user_timeline'
        } else if (options.isFavorite) {
          url = '/favorites'
          params = options
          params.format = 'html'
        } else {
          url = '/statuses/home_timeline'
        }
        fanfou.get(url, params).then((res) => {
          context.commit('setCache', res)
          resolve(res)
        }).catch((err) => {
          reject(err)
          console.log(err)
        })
      })
    },
    InitMention() {
      return new Promise((resolve, reject) => {
        const option = {
          count: 20,
          format: 'html'
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
          context.commit('removeCache', params.id)
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
          context.commit('setCacheFavorited', res)
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
      } else if (params.isFavorite) {
        url = '/favorites'
      } else {
        url = '/statuses/home_timeline'
      }
      return new Promise((resolve, reject) => {
        fanfou.get(url, params).then((res) => {
          context.commit('setCache', res)
          resolve(res)
        }).catch((err) => {
          console.log(err)
        })
      })
    },
    GetNewMention(context, params) {
      params.format = 'html'
      return new Promise((resolve, reject) => {
        fanfou.get('/statuses/mentions', params).then((res) => {
          resolve(res)
        }).catch((err) => {
          console.log(err)
        })
      })
    },
    GetUserPhotos(context, params) {
      params.format = 'html'
      return new Promise((resolve, reject) => {
        fanfou.get('/photos/user_timeline', params).then((res) => {
          context.commit('setCache', res)
          resolve(res)
        }).catch((err) => {
          console.log(err)
        })
      })
    }
  } 
}
export default status