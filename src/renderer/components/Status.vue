<template>
  <b-row class="status">
    <div class="status-avatar">
      <b-img :src="data.user.profile_image_url" width="48" style="border-radius: 3px;"/>
    </div>
    <b-col class="status-middle">
      <p class="status-name"><b><span class="name-link" @click="handleNameClick(data.user.id)">{{data.user.name}}</span></b><span class="status-time">{{createdTime}}</span></p>
      <b-row class="status-content">
        <b-col style="padding: 0 10px 0 0;">
          <p>
            <span v-for="(item, index) in data.txt" :key="index">
              <span v-if="item.type === 'at'" class="name-link" @click="handleNameClick(item.id)">
                {{item.text}}
              </span>
              <span v-else>{{item.text}}</span>
            </span>
          </p>
        </b-col>
        <a @click="handlePhotoClick(data.photo)">
          <b-img v-if="data.photo" class="status-photo" :src="data.photo.thumburl"/>
        </a>
      </b-row>
    </b-col>
    <div class="status-buttons">
      <div class="status-buttons-container">
        <div v-if="data.is_self">
          <span class="text-button" @click="handleAction('delete')">删除</span>
        </div>
        <div v-else>
          <span class="text-button" @click="handleAction('reply')">回复</span>
        </div>
        <div>
          <span class="text-button" @click="handleAction('repost')">转发</span>
        </div>
        <div v-if="!data.favorited">
          <span class="text-button" @click="handleAction('favorite')">收藏</span>
        </div>
        <div v-else>
          <span class="text-button" @click="handleAction('favorite')">取消</span>
        </div>
      </div>
    </div>
  </b-row>
</template>
<style>
.status {
  min-height: 100px;
  margin: 2px !important;
  border-bottom: 1px solid;
  padding: 3px 0 5px 0;
}
.status:hover {
  background-color: rgba(208, 217, 236, 1);
}
.status-avatar {
  width: 50px !important;
  margin: 2px;
  padding: 0;
}
.status-middle {
  padding: 0 !important;
  margin-left: 5px;
}
.status-buttons {
  width: 50px !important;
  padding: 0;
  text-align: center;
}
.status-buttons-container{
  display: none;
}
.status:hover .status-buttons-container{
  display: block;
}
.status-name {
  margin: 0;
  font-size: 15px;
}
.status-content {
  font-size: 15px;
  margin: 0 !important;
}
.status-photo {
  display: inline-block;
  cursor: pointer;
  padding: 2px;
  background-color: lightgrey;
}
.status-photo:hover {
  padding: 2px;
  background-color: #24BDDF;
}
.status-photo-container {
  padding-left: 10px;
}
.status-time {
  margin-left: 10px;
  font-size: 10px;
}
</style>
<script>
import T from '@/assets/T'
import electron from 'electron'
export default {
  name: 'Status',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      createdTime: '',
      notDestoryed: true
    }
  },
  created() {
    const timestamp = new Date(this.data.created_at)
    this.createdTime = T.setTime(timestamp, 'YMDHmN')
    const timeout = () => {
      this.createdTime = T.setTime(timestamp, 'YMDHmN')
      setTimeout(() => {
        if (this.notDestoryed) {
          timeout()
        }
      }, 10000);
    }
    timeout()
  },
  beforeDestroy() {
    this.notDestoryed = false
  },
  methods: {
    setTime(time) {
      const timestamp = new Date(time)
      return T.setTime(timestamp, 'YMDHmN')
    },
    handleAction(type) {
      this.$emit('action', type, this.data)
    },
    handlePhotoClick(data) {
      const originPhoto = new Image()
      originPhoto.onload = function () {
        let win = new electron.remote.BrowserWindow({
          width: originPhoto.width,
          height: originPhoto.height,
          autoHideMenuBar: true,
          webPreferences: {
            devTools: false
          }
        })
        win.on('close', function () {
          win = null;
        })
        win.loadURL(originPhoto.src)
      };
      originPhoto.src = data.originurl
    },
    handleNameClick(id) {
      this.$emit('nameClick', id)
    }
  }
}
</script>


