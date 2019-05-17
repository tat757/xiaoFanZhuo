<template>
  <div class="timeline scroll">
    <div class="text-center">
      <b-spinner v-if="statuses.length === 0" small></b-spinner>
    </div>
    <Status v-for="status in statuses" :key="status.id" :data="status" @action="handleAction"/>
    <b-modal
      v-model="modal.show"
      hide-header
      hide-footer
      centered>
      <b-form-textarea
        v-model="input"
        rows="3"
        max-rows="5"
        :class="textareaClass"
        @input="handleTextareaChange"/>
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
      statuses: [],
      modal: {
        show: false,
        type: ''
      },
      input: '',
      lastId: '',
      textareaClass: 'textarea'
    }
  },
  mounted() {
    this.getTimeline()
  },
  methods: {
    getTimeline() {
      this.$store.dispatch('GetTimeline').then((res) => {
        this.statuses = res
      })
    },
    handleAction(type, data) {
      this.modal.type = type
      this.modal.show = true
    },
    handleTextareaChange(data) {
      if (data.split('\n').length > 5) {
        this.textareaClass = 'scroll show-scroll-y'
      } else {
        this.textareaClass = 'textarea'
      }
    }
  }
}
</script>

