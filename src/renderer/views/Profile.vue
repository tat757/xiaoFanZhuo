<template>
  <div>
    <div v-if="user['profile_background_image_url']" class="profile-header" :style="{background: 'url(' + user['profile_background_image_url'] + ')', 'background-size': 'cover'}">
      <div class="profile-info-container">
      <span class="text-button" @click="handleRedirect('/timeline')">返回</span>
        <b-img :src="user['profile_image_origin_large']" class="profile-photo"/>
        <p class="profile-name">{{user.name}}</p>
        <span v-if="user.id" class="text-tag">id：{{user.id}}</span>
        <span v-if="user.birthday" class="text-tag">生日：{{user.birthday}}</span>
        <span v-if="user.gender" class="text-tag">性别：{{user.gender}}</span>
        <span v-if="user.location" class="text-tag">地址：{{user.location}}</span>
        <div class="break-line"/>
        <span class="text-button">关注：{{user.friends_count}}</span>
        <span class="text-button">被关注：{{user.followers_count}}</span>
      </div>
    </div>
  </div>
</template>
<style>
.profile-header {
  height: 260px;
}
.profile-info-container {
  height: 100%;
  width: 100%;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.3)
}
.profile-photo {
  display: block;
  margin: auto;
  width: 96px;
  border: 1px solid silver;
  border-radius: 5%;
}
.profile-name {
  font-size: 30px;
  text-align: center;
  color: white;
}
</style>
<script>
export default {
  name: 'Profile',
  data() {
    return {
      user: {}
    }
  },
  computed: {
    bottomHeight() {
      return require('electron').remote.getCurrentWindow().getContentSize()[1] - 162
    },
    active() {
      return this.$route.path.split('/')[1]
    }
  },
  mounted() {
    const userId = this.getUserId()
    this.getUserInfo(userId)
  },
  methods: {
    getUserId() {
      console.log(this.$route.params)
    },
    getUserInfo(id) {
      const params = {}
      if (id) {
        params.id = id
      }
      this.$store.dispatch('GetUserInfo', params).then((res) => {
        this.user = res
        console.log(this.user['profile_image_url'])
        console.log(res)
      })
    },
    handleRedirect(path) {
      this.$router.push('/' + path)
    }
  }
}
</script>


