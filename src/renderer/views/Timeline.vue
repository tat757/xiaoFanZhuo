<template>
  <div class="timeline">
    <Status v-for="status in statuses" :key="status.id" :data="status"/>
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
      statuses: []
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
    }
  }
}
</script>

