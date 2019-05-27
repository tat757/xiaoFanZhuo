import fanfou from '../../../api/request'

const direct = {
  state: {
  },
  mutations: {
  },
  actions: {
    GetDirectConversation() {
      return new Promise((resolve, reject) => {
        fanfou.get('/direct_messages/conversation_list').then((res) => {
          resolve(res)
        }).catch((err) => {
          console.log(err)
        })
      })
    }
  } 
}
export default direct