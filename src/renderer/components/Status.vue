<template>
  <b-row class="status">
    <div class="status-avatar">
      <b-img :src="data.user.profile_image_url" width="48"/>
    </div>
    <b-col>
      <p class="status-name">{{data.user.name}}</p>
      <p class="status-content">{{data.text}}</p>
    </b-col>
  </b-row>
</template>
<style>
.status {
  min-height: 100px;
  margin: 2px !important;
  border-bottom: 1px solid;
}
.status:hover {
  background-color: #93b5cf;
}
.status-avatar {
  width: 50px !important;
  margin: 2px;
  padding: 0;
}
.status-name {
  margin: 0;
  font-size: 15px;
}
.status-content {
  margin: 0;
  font-size: 15px;
}
</style>
<script>
export default {
  name: 'Status',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>


