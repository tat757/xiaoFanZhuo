import fanfou from '../../../api/request'

const message = {
  state: {
  },
  mutations: {
  },
  actions: {
    GetMessageList() {
      return new Promise((resolve, reject) => {
        fanfou.get('/direct_messages/conversation_list').then((res) => {
          resolve(res)
        }).catch((err) => {
          console.log(err)
        })
      })
    },
    GetConversation(context, params) {
      return new Promise((resolve, reject) => {
        fanfou.get('/direct_messages/conversation', params).then((res) => {
          resolve(res)
        }).catch((err) => {
          console.log(err)
        })
      })
    }
  } 
}
export default message