<template>
  <div>
    <Status v-for="status in statuses" :key="status.id" :data="status"/>
  </div>
</template>
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

