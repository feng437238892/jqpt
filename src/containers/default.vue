<template>
  <div>
    {{msg}}
  </div>
</template>

<script>
  import tools from '@/assets/tools/tool.js'

  module.exports = {
    name: 'Invoice',
    data(){
      return {
        msg: 'loading...'
      }
    },
    mounted(){
      let params = tools.urlquery()
      this.$router.replace(`/invoice?${window.location.search}&version=${Date.now()}`)
    }
  }

</script>
<style lang="less">
    .weui-dialog__btn_default {
        color: #25B8F1;
    }
</style>
