<template>
  <div style="padding: 5px;">
    <b-nav justified tabs>
      <b-nav-item active @click="handleRedirct('timeline')">首页</b-nav-item>
      <b-nav-item @click="handleRedirct('mention')">@提到我的</b-nav-item>
    </b-nav>
  </div>
</template>
<script>
export default {
  name: 'Menu',
  methods: {
    handleRedirct(url) {
      console.log(url)
    },
    checkActive(name) {
      console.log(name)
    }
  }
}
</script>
<style>
</style>

