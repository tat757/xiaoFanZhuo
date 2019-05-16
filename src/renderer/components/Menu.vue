<template>
  <div style="padding: 5px;">
    <b-nav justified tabs>
      <b-nav-item :class="getClass('timeline')" @click="handleRedirct('timeline')">首页</b-nav-item>
      <b-nav-item :class="getClass('mention')" @click="handleRedirct('mention')">@提到我的</b-nav-item>
    </b-nav>
  </div>
</template>
<style>
.menu-item-active {
  background-color: #346c9c !important;
}
.menu-item {
  background-color: #93b5cf;
  color: white !important;
}
</style>
<script>
export default {
  name: 'Menu',
  data() {
    return {
      active: 'timeline'
    }
  },
  methods: {
    getClass(id) {
      let classList = 'menu-item'
      if (this.active === id) {
        classList += ' menu-item-active'
      }
      return classList
    },
    handleRedirct(url) {
      this.active = url
    }
  }
}
</script>

