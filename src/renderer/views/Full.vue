<template>
  <div class="full">
    <InputField @newStatus="handleNewStatus"/>
    <Menu/>
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
  computed: {
    bottomHeight() {
      return require('electron').remote.getCurrentWindow().getContentSize()[1] - 162
    }
  },
  mounted() {
    this.getCurrUser()
  },
  methods: {
    getCurrUser() {
      this.$store.dispatch('GetCurrUser')
    },
    handleNewStatus(data) {
      if (!data.photo) {
        this.$store.dispatch('NewStatus', data)
      } else {
        this.$store.dispatch('UploadPhoto', data)
      }
    }
  }
}
</script>