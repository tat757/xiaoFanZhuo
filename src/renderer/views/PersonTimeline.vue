<template>
  <div>
    <Timeline
      :statuses="statuses"
      :height="timelineHeight"
      @getMoreStatus="getMoreStatus"
      @newStatus="handleNewStatus"
      @favorite="handleFavorite"
      @nameClick="handleNameClick"
      @destroyStatus="handleDestroy"
    />
  </div>
</template>
<style>
</style>
<script>
import Timeline from '@/components/Timeline'
export default {
  name: 'PersonTimeline',
  components: {
    Timeline
  },
  data() {
    return {
      statuses: [],
      requesting: {
        old: false
      },
      timelineHeight: '',
      personId: ''
    }
  },
  computed: {
    oldestStatus() {
      return this.statuses[this.statuses.length - 1]
    }
  },
  watch: {
    '$route.path'() {
      this.personId = this.$route.params.id
      this.initTimeline()
    }
  },
  mounted() {
    this.personId = this.$route.params.id
    this.timelineHeight = this.$el.clientHeight + 'px'
    this.initTimeline()
  },
  methods: {
    initTimeline() {
      this.requesting = {
        old: true
      }
      const params = {
        isPerson: true
      }
      if (this.personId !== '') {
        params.id = this.personId
      }
      this.$store.dispatch('InitTimeline', params).then((res) => {
        this.statuses = res
        this.requesting = {
          old: false
        }
      })
    },
    getMoreStatus() {
      if (!this.requesting.old) {
        this.requesting.old = true
        const params = {
          isPerson: true,
          max_id: this.oldestStatus.id,
          count: 10
        }
        if (this.personId !== '') {
          params.id = this.personId
        }
        this.$store.dispatch('GetNewStatus', params).then((res) => {
          for (let i = 0; i < res.length; i++) {
            this.statuses.push(res[i])
            this.updateTime = Date.now()
            this.requesting.old = false
          }
        })
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
      if (data !== this.personId) {
        this.statuses = []
      }
      this.$router.push('/profile/timeline/' + data)
    },
    handleDestroy(params) {
      this.$store.dispatch('DestroyStatus', params).then((res) => {
        this.initTimeline()
      })
    }
  }
}
</script>

