<template>
  <b-row class="status">
    <div class="status-avatar">
      <b-img :src="data.user.profile_image_url" width="48"/>
    </div>
    <b-col class="p-0">
      <p class="status-name">{{data.user.name}}</p>
      <p class="status-content">{{data.text}}</p>
    </b-col>
  </b-row>
</template>
<style>
.status {
  background-color: grey;
  min-height: 100px;
  margin: 2px !important;
}
.status:hover {
  background-color: red;
}
.status-avatar {
  width: 50px !important;
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


