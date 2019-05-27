<template>
  <div :class="{ direct: hasScroll, scroll: hasScroll }">
    私信 <span class="text-button">返回</span>
    <div v-if="conversations.length > 0">
      <b-row v-for="conversation in conversations" :key="conversation.otherid" :class="{ 'direct-conversation': true, 'direct-new': conversation.new_conv}" style="margin: 0;">
        <div class="direct-avatar">
          <b-img :src="conversation.avatar" width="48"/>
        </div>
        <div class="direct-content">
          <p>{{conversation.name}}<span>{{conversation.time}}</span></p>
          <p>{{conversation.text}}</p>
        </div>
      </b-row>
    </div>
  </div>
</template>
<style>
.direct {
  overflow-y: scroll;
}
.direct-avatar {
  display: inline-block;
  width: 50px !important;
  margin: 2px;
  padding: 0;
}
.direct-new {
  border-right: 5px solid red;
}
.direct-conversation {
  cursor: pointer;
}
.direct-conversation:hover {
  background-color: rgba(208, 217, 236, 1)!important;
}
.direct-content {
  display: inline-block;
}
.direct-content p {
  width: calc(500px - 70px);
  font-size: 12px!important;
  margin: 0px!important;
  text-overflow: ellipsis!important;
  white-space: nowrap!important;
  overflow-x: hidden!important;
}
</style>
<script>
import T from '@/assets/T'
export default {
  name: 'direct',
  data() {
    return {
      conversations: [],
      hasScroll: false
    }
  },
  mounted() {
    this.hasScroll = this.$el.clientHeight > require('electron').remote.getCurrentWindow().getContentSize()[1]
    this.getConversations()
  },
  methods: {
    getConversations() {
      this.$store.dispatch('GetDirectConversation').then((res) => {
        this.conversations = this.setData(res)
      })
    },
    setData(data) {
      return data.map((item) => {
        if (item.dm.recipient_id === item.otherid) {
          item.avatar = item.dm.recipient.profile_image_url
          item.name = item.dm.recipient_screen_name
        } else {
          item.avatar = item.dm.sender.profile_image_url
          item.name = item.dm.sender_screen_name
        }
        item.text = item.dm.text
        item.time = T.setTime(item.dm.created_at, 'N')
        return item
      })
    }
  }
}
</script>

