<template>
<span class="xui-text" :class="typeClass">
  <slot></slot>
</span>
</template>

<script>
export default {
  name: "xuiText",
  props: {
    type: {
      type: String,
      default: 'primary'
    }
  },
  computed: {
    typeClass() {
      return `is-${this.type}`
    }
  }
}
</script>

<style scoped lang="scss">
.xui-text {
  text-decoration: underline;
  cursor: pointer;
}

.xui-text.primary {
  color: var(--el-color-primary);
}

</style>