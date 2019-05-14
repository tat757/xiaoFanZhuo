<template>
  <b-row no-gutters>
    <div class="input-field-left">
      <b-img :src="avatar" width="48" height="48"/>
      <div style="margin-top: 3px">
        <b-button size="sm" @click="handleLogout">x</b-button>
      </div>
    </div>
    <b-col>
      <b-form-textarea
        rows="3"
        max-rows="5"/>
    </b-col>
  </b-row>
</template>
<style>
.input-field-left {
  margin: 4px 5px;
}
</style>
<script>
export default {
  name: 'InputField',
  computed: {
    avatar() {
      return this.$store.state.account.avatar
    }
  },
  methods: {
    handleLogout() {
      this.$store.dispatch('Logout').then((res) => {
        this.$router.push('/login')
      })
    }
  }
}
</script>


