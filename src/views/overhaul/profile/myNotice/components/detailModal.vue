<template>
  <el-dialog
    title="查看"
    custom-class="detail-modal"
    width="520px"
    :model-value="visible"
    :close-on-click-modal="false"
    @close="closeModal"
  >
    <div>
      <!-- <div class="ml24">
        <span class="item-label">标题：</span>
        <span class="item-content">{{ info.title }}</span>
      </div> -->
      <!-- <div class="ml24">
        <span class="item-label">来源：</span>
        <span class="item-content">{{ info.source }}</span>
      </div> -->
      <div class="ml24">
        <span class="item-label">类型：</span>
        <span class="item-content">{{ typeOptions[info.noticeStatus].text }}</span>
      </div>
      <div class="ml24">
        <span class="item-label">接收时间：</span>
        <span class="item-content">{{ info.createTime }}</span>
      </div>
      <div class="notice-content">{{ info.noticeContent }}</div>
    </div>
    <template #footer>
      <el-button  type="primary" @click="closeModal"
        >确 定</el-button
      >
    </template>
  </el-dialog>
</template>
<script>

const typeOptions = [
  { value: 1, text: "任务通知" },
  { value: 2, text: "超时通知" },
];

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    info: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      typeOptions: Object.freeze(typeOptions)
    };
  },
  methods: {
    // 关闭弹框
    closeModal() {
      this.$emit("closeModal");
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep(.el-dialog__header){
  border-bottom: 1px solid #eee;
}
.ml24 {
  margin-left: 24px;
  margin-bottom: 12px;
  color: #76797c;
}
.item-label {
  display: inline-block;
  width: 80px;
  text-align: right;
}
.notice-content {
  background-color: #efefef;
  min-height: 76px;
  max-height: 200px;
  overflow-y: auto;
  padding: 15px 20px;
}
</style>