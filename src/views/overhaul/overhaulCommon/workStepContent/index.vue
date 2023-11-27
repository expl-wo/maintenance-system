<template>
  <el-empty description="暂无数据" />
</template>
<script>
export default {
  props: {
    //当前工单的详情
    workOrderInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    onlyTabName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
</style>