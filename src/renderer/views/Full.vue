<template>
  <div class="full">
    <InputField @newStatus="handleNewStatus"/>
    <Menu :menu="menu" :active="active" @redirect="handleRedirect"/>
    <router-view :style="{ height: bottomHeight + 'px' }"/>
  </div>
</template>
<style>
</style>
<script>
import InputField from '../components/InputField'
import Menu from '../components/Menu'
export default {
  name: 'Full',
  components: {
    InputField,
    Menu
  },
  data() {
    return {
      menu: [{
        key: 'timeline',
        label: '首页'
      }, {
        key: 'mention',
        label: '@提到我的'
      }]
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
    this.$store.dispatch('GetUserInfo')
  },
  methods: {
    handleNewStatus(data) {
      if (!data.photo) {
        this.$store.dispatch('NewStatus', data)
      } else {
        this.$store.dispatch('UploadPhoto', data)
      }
    },
    handleRedirect(path) {
      this.$router.push('/' + path)
    }
  }
}
</script>