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
      <div v-if="modal.hasTextarea">
        <b-form-textarea
          v-model="input"
          rows="3"
          max-rows="5"
          :class="textareaClass"
          @input="handleTextareaChange"/>
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
      input: '',
      lastId: '',
      textareaClass: 'textarea'
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
      this.setModal(type, data)
    },
    handleTextareaChange(data) {
      if (data.split('\n').length > 5) {
        this.textareaClass = 'scroll show-scroll-y'
      } else {
        this.textareaClass = 'textarea'
      }
    },
    handleConfirm() {
      console.log(this.modal)
      this.$store.dispatch('DestoryStatus', {id: this.modal.data.id}).then((res) => {
        console.log(res)
      })
      this.statuses.data[this.statuses.cache[this.modal.data.id]].isDelete = true
      this.resetModal()
    },
    handleCancel() {
      this.resetModal()
    }
  }
}
</script>

