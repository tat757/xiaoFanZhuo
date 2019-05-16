<template>
  <b-row no-gutters>
    <div class="input-field-left">
      <b-img :src="avatar" width="48" height="48"/>
      <div style="margin-top: 3px">
        <b-button size="sm" @click="handleLogout">x</b-button>
      </div>
    </div>
    <b-col class="input-field-right">
      <b-form-textarea
        v-model="input"
        rows="3"
        max-rows="5"
        class="input-field-textarea"/>
      <div>
        <label for="uploadImage">
          <span class="input-field-text" aria-hidden="true">上传照片</span>
          <b-form-file id="uploadImage" v-model="image" style="display: none"/>
        </label>
        <span class="upload-image-name">{{uploadImageName}}</span>
        <span class="input-field-text" style="float: right; margin: 2px 10px 0 10px;" @click="handleNewStatus">发送</span>
        <span :style="{float: 'right', color: count < 50 ? 'red' : 'black'}">{{count}}</span>
      </div>
    </b-col>
  </b-row>
</template>
<style>
.input-field-left {
  margin: 4px 5px 0 5px;
}
.input-field-right {
  margin: 4px 5px 0 5px;
}
.upload-image-name {
  color: #36292f;
  font-size: 12px;
  font-style: italic;
}
.input-field-text {
  font-size: 12px;
  cursor: pointer;
}
.input-field-textarea {
  background-color: #93b5cf !important;
}
</style>
<script>
export default {
  name: 'InputField',
  data() {
    return {
      input: '',
      image: null
    }
  },
  computed: {
    avatar() {
      return this.$store.state.account.avatar
    },
    count() {
      return 140 - this.input.length
    },
    uploadImageName() {
      return this.image ? this.image.name : ''
    }
  },
  methods: {
    handleLogout() {
      this.$store.dispatch('Logout').then((res) => {
        this.$router.push('/login')
      })
    },
    handleNewStatus() {
      let params = {
        status: this.input
      }
      if (!this.image) {
        this.$store.dispatch('NewStatus', params).then((res) => {
          this.input = ''
        })
      } else {
        params.photo = this.image
        this.$store.dispatch('UploadPhoto', params).then((res) => {
          this.input = ''
          this.image = null
        })
      }
      console.log(this.image)
    }
  }
}
</script>


