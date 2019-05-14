import fanfou from '../../../api/request'

const status = {
  state: {
    timeline: {}
  },
  mutations: {
  },
  actions: {
    GetTimeline() {
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
    }
  } 
}
export default status