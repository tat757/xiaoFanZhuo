<template>
  <div>
    <b-row class="text-center">
      <b-col :class="getClass('timeline')" @click="handleRedirct('timeline')"><span class="menu-item-text">首页</span></b-col>
      <b-col :class="getClass('mention')" @click="handleRedirct('mention')"><span class="menu-item-text">@提到我的</span></b-col>
      <b-col :class="getClass('direct')" @click="handleRedirct('direct')"><span class="menu-item-text">私信</span></b-col>
    </b-row>
  </div>
</template>
<style>
.menu-item-active {
  background-color: rgba(90, 122, 188, 1) !important;
  color: white;
}
.menu-item {
  background-color: rgba(208, 217, 236, 0.5);
  cursor: pointer;
  height: 40px;
  border-right: 1px solid white;
}
.menu-item:hover {
  background-color: rgba(208, 217, 236, 1);
}
.menu-item-text {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
<script>
export default {
  name: 'Menu',
  computed: {
    active() {
      return this.$route.path.split('/')[1]
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
      this.$router.push('/' + url)
    }
  }
}
</script>

