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
    DestoryStatus(context, params) {
      return new Promise((resolve, reject) => {
        fanfou.post('/statuses/destroy', params).then((res) => {
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