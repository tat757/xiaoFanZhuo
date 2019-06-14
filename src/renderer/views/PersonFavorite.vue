<template>
  <div>
    <p v-if="noStatus" style="text-align: center">无信息</p>
    <Timeline v-else
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
      currPage: 1,
      noStatus: false
    }
  },
  computed: {
    oldestStatus() {
      return this.statuses[this.statuses.length - 1]
    }
  },
  mounted() {
    this.personId = this.$route.params.id
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
        if (res.length === 0) {
          this.noStatus = true
        }
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
    },
    handleNameClick(data) {
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
