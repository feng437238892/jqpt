<template>
  <div class="weui-cell-group">
    <div class="weui-cells__title" v-if="title">{{title}}</div>
    <div class="weui-cells" :class="{'vux-no-group-title':!title}" :style="{marginTop: typeof gutter === 'number' ? (gutter + 'px') : gutter}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default{
    props: {
      title: {
        default: null
      },
      radio: {
        type: Boolean
      },
      checkbox: {
        type: Boolean
      },
      gutter: [String, Number]
    }
  }
</script>
