<template>
  <div>
    <Timeline
      :statuses="statuses"
      :newStatuses="newStatuses"
      :updateTime="updateTime"
      :height="timelineHeight"
      @getNewStatus="getNewStatus"
      @getMoreStatus="getMoreStatus"
      @showNewStatus="newStatuses = []"
      @destroyStatus="handleDestroyStatus"
      @newStatus="handleNewStatus"
      @favorite="handleFavorite"
      @nameClick="handleNameClick"
    />
  </div>
</template>
<script>
import Timeline from '@/components/Timeline'
export default {
  name: 'Homepage',
  components: {
    Timeline
  },
  data() {
    return {
      statuses: [],
      newStatuses: [],
      updateTime: 0,
      requesting: {
        new: false,
        old: false
      },
      interval: null,
      destroyed: false,
      timelineHeight: ''
    }
  },
  watch: {
    '$store.state.status.updateTime'() {
      if (this.$store.state.status.updateTime !== 0) {
        this.getNewStatus()
      }
    }
  },
  computed: {
    newestStatus() {
      return this.statuses[0]
    },
    oldestStatus() {
      return this.statuses[this.statuses.length - 1]
    }
  },
  mounted() {
    this.timelineHeight = this.$el.clientHeight + 'px'
    this.initTimeline()
    this.setInterval()
  },
  destroyed() {
    clearInterval(this.interval)
    this.destroyed = true
  },
  methods: {
    initTimeline() {
      this.requesting = {
        new: true,
        old: true
      }
      const res = this.$store.getters.getData('home_timeline').data
      this.statuses = res
      this.requesting = {
        new: false,
        old: false
      }
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
            this.statuses.push(res[i])
            this.updateTime = Date.now()
            this.requesting.old = false
          }
        })
      }
    },
    setInterval() {
      this.interval = setInterval(() => {
        if (!this.destroyed) {
          this.getNewStatus()
        }
      }, 10 * 1000)
    },
    handleDestroyStatus(params) {
      this.$store.dispatch('DestroyStatus', params)
      for (let i = this.statuses.length - 1; i >= 0; i--) {
        if (this.statuses[i].id === params.id) {
          this.statuses[i].isDelete = true
          this.updateTime = Date.now()
        }
      }
    },
    handleNewStatus(params) {
      this.$store.dispatch('NewStatus', params)
    },
    handleFavorite(params) {
      this.$store.dispatch('Favorite', params)
      for (let i = this.statuses.length - 1; i >= 0; i--) {
        if (this.statuses[i].id === params.id) {
          this.statuses[i].favorited = !this.statuses[i].favorited
          this.updateTime = Date.now()
        }
      }
    },
    handleNameClick(data) {
      this.$router.push('/profile/timeline/' + data)
    }
  }
}
</script>
