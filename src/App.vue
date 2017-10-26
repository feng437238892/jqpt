<template>
  <div class="app-content">
    <xsvg></xsvg>
    <router-view></router-view>
    <Toast v-model="Interface.toast.show" :title="Interface.toast.text"/>
    <Toast v-model="Interface.loading.show" loading/>
  </div>
</template>

<script>
  import {mapState, mapGetters, mapActions, mapMutations} from 'vuex'

  export default {
    name: 'app',
    computed: {
      ...mapState({
        Interface: state => state.utils.Interface,
      }),
    },
    methods: {
      initMTA() {
        let sid;
        if (process.env.NODE_ENV === 'test') {
          sid = "500509926";
        } else if (process.env.NODE_ENV === 'production') {
          sid = "500508192";
        }

        var _mtac = {};
        (function () {
          var mta = document.createElement("script");
          mta.src = "http://pingjs.qq.com/h5/stats.js?v2.0.4";
          mta.setAttribute("name", "MTAH5");
          mta.setAttribute("sid", sid);

          var s = document.getElementsByTagName("script")[0];
          s.parentNode.insertBefore(mta, s);
        })();
      }
    },
    mounted() {
      if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'prod') {
        this.initMTA();
      }
    }
  }
</script>

<style lang="less">
  @import "./assets/styles/index.less";
  .app-content {
    height: 100%;
  }
</style>
