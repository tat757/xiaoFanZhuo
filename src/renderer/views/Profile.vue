<template>
  <div>
    <div v-if="user['profile_background_image_url']" class="profile-header" :style="{background: 'url(' + user['profile_background_image_url'] + ')', 'background-size': 'cover'}">
      <div class="profile-info-container">
        <span class="text-button" @click="() => {$router.push('/timeline')}">返回</span>
        <b-img :src="user['profile_image_origin_large']" class="profile-photo"/>
        <p class="profile-name">{{user.name}}</p>
        <span v-if="user.id" class="text-tag">id：{{user.id}}</span>
        <span v-if="user.birthday" class="text-tag">生日：{{user.birthday}}</span>
        <span v-if="user.gender" class="text-tag">性别：{{user.gender}}</span>
        <span v-if="user.location" class="text-tag">地址：{{user.location}}</span>
        <div class="break-line"/>
        <span class="text-button">关注：{{user.friends_count}}</span>
        <span class="text-button">被关注：{{user.followers_count}}</span>
        <span v-if="userId === currUserId" class="text-button">私信</span>
      </div>
    </div>
    <Menu :menu="menu" :active="active" @redirect="handleRedirect"/>
    <router-view :style="{ height: bottomHeight + 'px' }"/>
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
  background-color: rgba(90, 122, 188, 0.3)
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
import Menu from '../components/Menu'
export default {
  name: 'Profile',
  components: {
    Menu
  },
  data() {
    return {
      user: {},
      userId: '',
      menu: [{
        key: 'timeline',
        label: '时间轴'
      }, {
        key: 'photo',
        label: '照片'
      }, {
        key: 'favorite',
        label: '收藏'
      }]
    }
  },
  computed: {
    bottomHeight() {
      return require('electron').remote.getCurrentWindow().getContentSize()[1] - 300
    },
    currUserId() {
      return this.$store.state.account.userId
    },
    active() {
      return this.$route.path.split('/')[2]
    }
  },
  watch: {
    '$route.path'() {
      this.userId = this.getUserId()
      this.getUserInfo(this.userId)
    }
  },
  mounted() {
    this.userId = this.getUserId()
    this.getUserInfo(this.userId)
  },
  methods: {
    getUserId() {
      return this.$route.params.id || ''
    },
    getUserInfo(id) {
      const params = {}
      if (id) {
        params.id = id
      }
      this.$store.dispatch('GetUserInfo', params).then((res) => {
        this.user = res
      })
    },
    handleRedirect(path) {
      this.$router.push('/profile/' + path + '/' + this.userId)
    }
  }
}
</script>
