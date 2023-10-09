<template>
<span class="xui-form-text">
  <slot></slot>
</span>
</template>

<script>
export default {
  name: "xuiFormText",
  props: {
    type: {
      type: String,
      default: 'primary'
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