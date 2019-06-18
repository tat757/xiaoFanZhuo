<template>
  <div>
    <span class="text-button" @click="() => {$router.push('/message')}">返回</span>
  </div>
</template>
<script>
export default {
  name: 'Message',
  data() {
    return {
      otherId: '',
      currUserId
    }
  },
  mounted() {
    this.otherId = this.$route.params.id
    this.currUserId = this.$store.state.account.userId
    this.getConversation()
  },
  methods: {
    getConversation() {
      this.$store.dispatch('GetConversation', {id: this.otherId}).then((res) => {
        console.log(res)
      })
    }
  }
}
</script>
