<template>
  <div style="margin: 0 4px;">
    <div v-if="data">
      <div style="text-align: center;">
        <b-img :width="width" :height="height" :src="src"/>
      </div>
      <p style="text-align: center;">
        <span v-for="(item, index) in data.txt" :key="index">
          <span v-if="item.type === 'at'" class="name-link" @click="handleNameClick(item.id)">
            {{item.text}}
          </span>
          <span v-else>{{item.text}}</span>
        </span>
      </p>
      <span v-if="data.is_self" class="text-button" @click="handleAction('delete')">删除</span>
      <span v-else class="text-button" @click="handleAction('reply')">回复</span>
      <span class="text-button" @click="handleAction('repost')">转发</span>
      <span v-if="!data.favorited" class="text-button" @click="handleAction('favorite')">收藏</span>
      <span v-else class="text-button" @click="handleAction('favorite')">取消</span>
    </div>
    <b-modal
      v-model="modal.show"
      hide-header
      hide-footer
      centered>
      <div v-show="modal.hasTextarea">
        <b-form-textarea
          v-model="input.status"
          ref="modalInput"
          rows="3"
          max-rows="5"
          :class="textareaClass"
          @input="handleTextareaChange"/>
        <span class="text-button" style="float: right; margin: 2px 10px 0 10px;" @click="handleStatus(modal.type)">发送</span>
        <span :style="{float: 'right', color: count < 50 ? 'red' : 'black'}">{{count}}</span>
      </div>
      <div v-if="modal.text !== ''">
        {{this.modal.text}}
        <b-row text-align="center">
          <b-col>
            <span class="text-button text-danger" @click="handleConfirm">确定</span>
            <span class="text-button" @click="handleCancel">取消</span>
          </b-col>
        </b-row>
      </div>
    </b-modal>
  </div>
</template>
<style>
</style>
<script>
import electron from 'electron'
const ipcRenderer = electron.ipcRenderer
export default {
  name: 'PhotoStatus',
  data() {
    return {
      data: null,
      width: '',
      height: '',
      src: '',
      currUserId: '',
      modal: {
        show: false,
        type: '',
        data: null,
        hasTextarea: false,
        text: ''
      },
      textareaClass: 'textarea',
      input: {
        status: ''
      }
    }
  },
  computed: {
    count() {
      return 140 - this.input.status.length
    }
  },
  mounted() {
    this.currUserId = this.$store.state.account.userId
    this.data = this.$store.getters.getCache(this.$route.params.id)
    this.getPhoto()
  },
  methods: {
    getPhoto() {
      const largePhoto = new Image()
      largePhoto.onload = () => {
        let width = largePhoto.width
        let height = largePhoto.height
        if (width > height) {
          height = Math.floor(521 / width * height)
          width = 521
        } else {
          width = Math.floor(521 / height * width)
          height = 521
        }
        this.$nextTick().then(() => {
          const bounds = electron.remote.getCurrentWindow().getBounds()
          bounds.height = height + 200
          electron.remote.getCurrentWindow().setBounds(bounds)
          this.width = width
          this.height = height
          this.src = largePhoto.src
        })
      }
      largePhoto.onerr = (err) => {
        console.log(err)
      }
      largePhoto.src = this.data.photo.largeurl
    },
    setModal(type, data) {
      this.resetModal()
      this.modal.type = type
      this.modal.data = data
      this.modal.show = true
      this.modal.hasTextarea = true
      switch(type) {
        case 'delete': {
          let deleteType = '条消息'
          if (data.photo) {
            deleteType = '张照片'
          }
          this.modal.hasTextarea = false
          this.modal.text = '你确定要删除这' + deleteType + '吗？'
          break
        }
        case 'reply': {
          this.input.status = '@' + data.user.name + ' '
          this.input.in_reply_to_status_id = data.id
          this.input.in_reply_to_user_id = data.user.id
          this.$nextTick().then(() => {
            this.$nextTick().then(() => {
              this.$refs.modalInput.focus()
            })
          })
          break
        }
        case 'repost': {
          this.input.status = '转@' + data.user.name + ' ' + data.plain_text
          this.input.repost_status_id = data.id
          this.$nextTick().then(() => {
            this.$nextTick().then(() => {
              this.$refs.modalInput.focus()
              this.$refs.modalInput.setSelectionRange(0, 0)
            })
          })
          break
        }
      }
    },
    setModal(type, data) {
      this.resetModal()
      this.modal.type = type
      this.modal.data = data
      this.modal.show = true
      this.modal.hasTextarea = true
      switch(type) {
        case 'delete': {
          let deleteType = '条消息'
          if (data.photo) {
            deleteType = '张照片'
          }
          this.modal.hasTextarea = false
          this.modal.text = '你确定要删除这' + deleteType + '吗？'
          break
        }
        case 'reply': {
          this.input.status = '@' + data.user.name + ' '
          this.input.in_reply_to_status_id = data.id
          this.input.in_reply_to_user_id = data.user.id
          this.$nextTick().then(() => {
            this.$nextTick().then(() => {
              this.$refs.modalInput.focus()
            })
          })
          break
        }
        case 'repost': {
          this.input.status = '转@' + data.user.name + ' ' + data.plain_text
          this.input.repost_status_id = data.id
          this.$nextTick().then(() => {
            this.$nextTick().then(() => {
              this.$refs.modalInput.focus()
              this.$refs.modalInput.setSelectionRange(0, 0)
            })
          })
          break
        }
      }
    },
    resetModal() {
      this.modal = {
        show: false,
        type: '',
        data: null,
        hasTextarea: false,
        text: ''
      }
    },
    handleConfirm() {
      this.$store.dispatch('DestroyStatus', {id: this.modal.data.id}).then((res) => {
        this.handleCloseWindow('/profile/photo/' + this.currUserId)
      })
      this.resetModal()
    },
    handleCancel() {
      this.resetModal()
    },
    handleStatus(type) {
      this.$store.dispatch('NewStatus', this.input).then((res) => {
        electron.remote.getCurrentWindow().getParentWindow().focus()
        electron.remote.getCurrentWindow().close()
      })
      this.resetModal()
    },
    handleNameClick(id) {
      this.handleCloseWindow('/profile/timeline/' + id)
    },
    handleAction(type) {
      const data = this.data
      if (type === 'favorite') {
        this.handleFavorite(data)
      } else {
        this.setModal(type, data)
      }
    },
    handleFavorite(data) {
      let params = {}
      if (data.favorited) {
        params = {id: data.id, destroy: true, userId: data.user.id}
      } else {
        params = {id: data.id, userId: data.user.id}
      }
      this.$store.dispatch('Favorite', params)
    },
    handleTextareaChange(data) {
      if (data.split('\n').length > 5) {
        this.textareaClass = 'scroll show-scroll-y'
      } else {
        this.textareaClass = 'textarea'
      }
    },
    handleCloseWindow(path) {
      const href = window.location.href
      electron.remote.getCurrentWindow().getParentWindow().loadURL(href.substring(0, href.indexOf('#') + 1) + path)
      electron.remote.getCurrentWindow().getParentWindow().focus()
      electron.remote.getCurrentWindow().close()
    }
  }
}
</script>
