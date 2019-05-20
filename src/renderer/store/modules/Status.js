import fanfou from '../../../api/request'

const status = {
  state: {
    timeline: {}
  },
  mutations: {
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
          url = '/favorites/destroy'
        } else {
          url = '/favorites/create'
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
          resolve(res)
        }).catch((err) => {
          console.log(err)
        })
      })
    }
  } 
}
export default status