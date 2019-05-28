<template>
  <div>
    <b-row class="text-center">
      <b-col v-for="item in menu" :key="item.key" :class="getClass(item.key)" @click="handleRedirct(item.key)"><span class="menu-item-text">{{item.label}}</span></b-col>
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
  props: {
    menu: {
      type: Array,
      default() {
        return []
      }
    },
    active: {
      type: String,
      default() {
        return ''
      }
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
      this.$emit('redirect', url)
    }
  }
}
</script>

