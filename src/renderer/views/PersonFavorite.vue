<template>
  <div>
    <Timeline
      :statuses="statuses"
      :height="timelineHeight"
      @getMoreStatus="getMoreStatus"
      @newStatus="handleNewStatus"
      @favorite="handleFavorite"
    />
  </div>
</template>
<style>
</style>
<script>
import Timeline from '@/components/Timeline'
export default {
  name: 'PersonFavorite',
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
      personId: '',
      currPage: 1
    }
  },
  computed: {
    oldestStatus() {
      return this.statuses[this.statuses.length - 1]
    }
  },
  mounted() {
    this.personId = this.$route.query.id
    if (!this.personId) {
      this.personId = this.$store.state.account.userId
    }
    this.timelineHeight = this.$el.clientHeight + 'px'
    this.initTimeline()
  },
  methods: {
    initTimeline() {
      this.requesting = {
        old: true
      }
      const params = {
        page: this.currPage,
        id: this.personId,
        isFavorite: true
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
        this.currPage++
        this.requesting.old = true
        const params = {
          page: this.currPage,
          id: this.personId,
          isFavorite: true
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
    }
  }
}
</script>
