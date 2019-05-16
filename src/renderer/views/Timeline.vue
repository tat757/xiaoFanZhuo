<template>
  <div class="timeline">
    <Status v-for="status in statuses" :key="status.id" :data="status"/>
  </div>
</template>

<style>
.timeline {
  overflow-y: scroll;
  height: 450px;
}
.timeline::-webkit-scrollbar {
	width: 10px;
	background-color: #F5F5F5;
}
.timeline::-webkit-scrollbar-track {
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	background-color: #F5F5F5;
	border-radius: 10px;
}
.timeline::-webkit-scrollbar-thumb {
	border-radius: 10px;
	background-image: -webkit-gradient(linear,
									   left bottom,
									   left top,
									   color-stop(0.44, rgb(122,153,217)),
									   color-stop(0.72, rgb(73,125,189)),
									   color-stop(0.86, rgb(28,58,148)));
}
</style>

<script>
import Status from '../components/Status'
export default {
  name: 'Timeline',
  components: {
    Status
  },
  data() {
    return {
      statuses: []
    }
  },
  mounted() {
    this.getTimeline()
  },
  methods: {
    getTimeline() {
      this.$store.dispatch('GetTimeline').then((res) => {
        this.statuses = res
      })
    }
  }
}
</script>

