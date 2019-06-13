<template>
  <div :style="{ height: viewHeight, overflow: 'scroll' }" @scroll="handleScroll">
    <div v-for="photo in photos" class="photos-item" :key="photo.id">
      <a @click="handlePhotoClick(photo)">
        <div style="height: 148px; width: 155px;">
            <b-img :src="photo.photo.thumburl"/>
        </div>
      </a>
    </div>
  </div>
</template>
<style>
.photos-item {
  display: inline-block;
  margin: 3px;
  text-align: center;
  background-color: white;
  vertical-align:top;
}
.photos-item:hover {
  background-color: rgba(208, 217, 236, 1);
  cursor: pointer;
}
</style>
<script>
export default {
  name: 'PersonPhoto',
  data() {
    return {
      userId: '',
      photos: [],
      viewHeight: ''
    }
  },
  computed: {
    oldestStatus() {
      return this.photos[this.photos.length - 1]
    }
  },
  mounted() {
    this.initPage()
    this.viewHeight = this.$el.clientHeight + 'px'
  },
  methods: {
    initPage() {
      this.getUserId()
      this.getPersonPhotos()
    },
    getUserId() {
      this.userId = this.$route.query.id
    },
    getPersonPhotos() {
      if (!this.loading) {
        this.loading = true
        const params = {
          count: 15
        }
        if (this.userId !== '') {
          params.id = this.userId
        }
        this.$store.dispatch('GetUserPhotos', params).then((res) => {
          for (let i = res.length - 1; i >= 0; i--) {
            this.photos.unshift(res[i])
          }
          this.loading = false
        })
      }
    },
    getMorePhotos() {
      if (!this.loading) {
        this.loading = true
        const params = {
          id: this.userId,
          max_id: this.oldestStatus.id,
          count: 16
        }
        this.$store.dispatch('GetUserPhotos', params).then((res) => {
          for (let i = 1; i < res.length; i++) {
            this.photos.push(res[i])
          }
          this.loading = false
        })
      }
    },
    handlePhotoClick(item) {
      console.log(item)
    },
    handleScroll(data) {
      const scrollPosition = Math.floor((data.srcElement.scrollTop / data.srcElement.scrollHeight) * 100)
      let fixedRefreshPosition = Math.floor((300 / data.srcElement.scrollHeight) * 100)
      if (fixedRefreshPosition < 20) {
        fixedRefreshPosition = 20
      }
      if (scrollPosition > (100 - fixedRefreshPosition)) {
        this.getMorePhotos()
      }
    }
  }
}
</script>
