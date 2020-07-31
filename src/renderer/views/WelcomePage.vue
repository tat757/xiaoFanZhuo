<template>
  <div>
    <h1>欢迎使用小饭桌</h1>
  </div>
</template>
<style>
</style>
<script>
export default {
  name: 'WelcomePage',
  mounted() {
    this.$store.dispatch('InitData').then(() => {
      this.$router.push('/timeline')
    })
  }
}
</script>