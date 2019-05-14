<template>
  <div>
    <InputField/>
    <Menu/>
    <router-view/>
  </div>
</template>
<script>
import InputField from '../components/InputField'
import Menu from '../components/Menu'
export default {
  name: 'Full',
  components: {
    InputField,
    Menu
  },
  mounted() {
    this.getCurrUser()
  },
  methods: {
    getCurrUser() {
      this.$store.dispatch('GetCurrUser')
    }
  }
}
</script>