<template>
  <div class="weui-cell">
    <div class="weui-cell__hd" v-if="!fill"><label class="weui-label">{{title}}</label></div>
    <div class="weui-cell__bd">
      <textarea class="weui-textarea" :placeholder="placeholder" rows="3" :maxlength="max" v-model="currentValue"></textarea>
      <div class="weui-textarea-counter" v-if="currentValue"><span>{{currentValue.length}}</span>/{{max}}</div>
    </div>
  </div>
</template>

<script>
  export default{
    data () {
      return {
        currentValue: this.value
      }
    },
    props: {
      title: {
        default: null
      },
      value: {
        default: null
      },
      placeholder: {
        default: "请输入文本"
      },
      max: {
        default: 60
      },
      fill: {
        type: Boolean
      },
    },
    watch: {
      value (val) {
        this.currentValue = val
      },
      currentValue (newVal) {
        if (this.max && newVal > this.max) {
          this.currentValue = newVal.slice(0, this.max)
        }
        this.$emit('on-change', this.currentValue)
        this.$emit('input', this.currentValue)
      }
    }
  }
</script>

<style lang="less" scoped>
  .weui-cell__hd {
    align-self: flex-start;
  }
</style>
