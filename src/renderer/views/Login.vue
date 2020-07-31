<template>
  <div>
    <b-container>
      <b-row>
        <h2>小饭桌</h2><span>by TATx</span>
      </b-row>
      <b-row>
        <b-button @click="login">登录</b-button>
      </b-row>
    </b-container>
  </div>
</template>
<script>
export default {
  name: 'Login',
  mounted() {
    this.login()
  },
  methods: {
    login() {
      this.$store.dispatch('Login').then((data) => {
        this.$router.push('/welcome')
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>
