<template>
  <div class="timeline scroll">
    <div class="text-center">
      <b-spinner v-if="statuses.data.length === 0" small></b-spinner>
    </div>
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
      textareaClass: 'textarea'
    }
  },
  computed: {
    count() {
      return 140 - this.input.status.length
    }
  },
  mounted() {
    this.initTimeline()
  },
  methods: {
    initTimeline() {
      this.$store.dispatch('InitTimeline').then((res) => {
        this.statuses.cache = {}
        this.statuses.data = res.map((item, index) => {
          this.statuses.cache[item.id] = index
          item.isDelete = false
          return item
        })
      })
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
      this.statuses.data[this.statuses.cache[this.modal.data.id]].isDelete = true
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
      console.log(data)
      if (data.favorited) {
        this.$store.dispatch('Favorite', {id: data.id, destroy: true})
        this.statuses.data[this.statuses.cache[data.id]].isFavorite = false
      } else {
        this.$store.dispatch('Favorite', {id: data.id})
        this.statuses.data[this.statuses.cache[data.id]].isFavorite = true
      }
    }
  }
}
</script>

