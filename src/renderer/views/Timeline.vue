<template>
  <div class="timeline scroll" @scroll="handleScroll">
    <div class="text-center">
      <b-spinner v-if="statuses.data.length === 0" small></b-spinner>
    </div>
    <b-row v-if="newStatuses.length > 0" class="text-center" style="margin: 0;">
      <b-col class="timeline-new-status-notification" @click="handleShowNewStatus"><span class="menu-item-text">{{newStatuses.length}}条新消息</span></b-col>
    </b-row>
    <div v-for="status in statuses.data" :key="status.id">
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
  data() {
    return {
      statuses: {
        data: [],
        cache: {}
      },
      newStatuses: [],
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
    },
    newestStatus() {
      return this.statuses.data[0]
    },
    oldestStatus() {
      return this.statuses.data[this.statuses.data.length - 1]
    }
  },
  watch: {
    '$store.state.status.updateTime'() {
      if (this.$store.state.status.updateTime !== 0) {
        this.getNewStatus()
      }
    }
  },
  mounted() {
    this.initTimeline()
    this.setInterval()
  },
  methods: {
    initTimeline() {
      this.requesting = {
        new: true,
        old: true
      }
      this.$store.dispatch('InitTimeline').then((res) => {
        this.statuses.data = res
        this.requesting = {
          new: false,
          old: false
        }
      })
    },
    getNewStatus() {
      if (!this.requesting.new) {
        this.requesting.new = true
        this.$store.dispatch('GetNewStatus', { since_id: this.newestStatus.id }).then((res) => {
          this.newStatuses = res
          this.requesting.new = false
        })
      }
    },
    getMoreStatus() {
      if (!this.requesting.old) {
        this.requesting.old = true
        this.$store.dispatch('GetNewStatus', { max_id: this.oldestStatus.id, count: 10 }).then((res) => {
          for (let i = 0; i < res.length; i++) {
            this.statuses.data.push(res[i])
          }
          this.requesting.old = false
        })
      }
    },
    setInterval() {
      setInterval(() => {
        this.getNewStatus()
      }, 10 * 1000)
    },
    setModal(type, data) {
      console.log(type, data)
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
      this.$store.dispatch('DestroyStatus', {id: this.modal.data.id})
      for (let i = this.statuses.data.length - 1; i >= 0; i--) {
        if (this.statuses.data[i].id === this.modal.data.id) {
          this.statuses.data[i].isDelete = true
        }
      }
      this.resetModal()
    },
    handleCancel() {
      this.resetModal()
    },
    handleStatus(type) {
      this.$store.dispatch('NewStatus', this.input)
      this.resetModal()
    },
    handleFavorite(data) {
      if (data.favorited) {
        this.$store.dispatch('Favorite', {id: data.id, destroy: true, userId: data.user.id})
      } else {
        this.$store.dispatch('Favorite', {id: data.id, userId: data.user.id})
      }
      for (let i = this.statuses.data.length - 1; i >= 0; i--) {
        if (this.statuses.data[i].id === this.modal.data.id) {
          this.statuses.data[i].favorited = !this.statuses.data[i].favorited
        }
      }
    },
    handleShowNewStatus() {
      for (let i = this.newStatuses.length - 1; i >= 0; i--) {
        this.statuses.data.unshift(this.newStatuses[i])
        this.newStatuses.pop()
      }
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

