<template>
  <div class="timeline scroll" @scroll="handleScroll">
    <div class="text-center">
      <b-spinner v-if="statuses.length === 0" small></b-spinner>
    </div>
    <b-row v-if="newStatuses.length > 0" class="text-center" style="margin: 0;">
      <b-col class="timeline-new-status-notification" @click="handleShowNewStatus"><span class="menu-item-text">{{newStatuses.length}}条新消息</span></b-col>
    </b-row>
    <div v-for="status in statuses" :key="status.id">
      <Status v-if="!status.isDelete" :data="status" @action="handleAction"/>
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
.timeline {
  overflow-y: scroll;
  height: 450px;
}
.timeline-new-status-notification {
  cursor: pointer;
  height: 30px;
  border: 1px solid black;
  margin: 2px;
  background-color: #2e317c;
  color: white;
}
</style>

<script>
import Status from '../components/Status'
export default {
  name: 'Timeline',
  components: {
    Status
  },
  props: {
    statuses: {
      type: Array,
      default() {
        return []
      }
    },
    newStatuses: {
      type: Array,
      default() {
        return []
      }
    },
    updateTime: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      modal: {
        show: false,
        type: '',
        data: null,
        hasTextarea: false,
        text: ''
      },
      input: {
        status: ''
      },
      lastId: '',
      textareaClass: 'textarea',
      requesting: {
        new: false,
        old: false
      }
    }
  },
  computed: {
    count() {
      return 140 - this.input.status.length
    }
  },
  watch: {
    updateTime() {
      this.statuses.push({})
      this.statuses.pop()
    }
  },
  methods: {
    getNewStatus() {
      this.$emit('getNewStatus')
    },
    getMoreStatus() {
      this.$emit('getMoreStatus')
    },
    setInterval() {
      setInterval(() => {
        this.getNewStatus()
      }, 10 * 1000)
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
    handleAction(type, data) {
      if (type === 'favorite') {
        this.handleFavorite(data)
      } else {
        this.setModal(type, data)
      }
    },
    handleTextareaChange(data) {
      if (data.split('\n').length > 5) {
        this.textareaClass = 'scroll show-scroll-y'
      } else {
        this.textareaClass = 'textarea'
      }
    },
    handleConfirm() {
      this.$emit('destroyStatus', {id: this.modal.data.id})
      this.resetModal()
    },
    handleCancel() {
      this.resetModal()
    },
    handleStatus(type) {
      this.$emit('newStatus', this.input)
      this.resetModal()
    },
    handleFavorite(data) {
      let params = {}
      if (data.favorited) {
        params = {id: data.id, destroy: true, userId: data.user.id}
      } else {
        params = {id: data.id, userId: data.user.id}
      }
      this.$emit('favorite', params)
    },
    handleShowNewStatus() {
      for (let i = this.newStatuses.length - 1; i >= 0; i--) {
        this.statuses.unshift(this.newStatuses[i])
      }
      this.$emit('showNewStatus')
    },
    handleScroll() {
      const position = Math.floor((this.$el.scrollTop / this.$el.scrollHeight) * 100)
      if (position > 80) {
        this.getMoreStatus()
      }
    }
  }
}
</script>

