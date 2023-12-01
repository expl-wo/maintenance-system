<template>
  <!-- <el-empty description="暂无数据" /> -->
  <div class="work-content-box">
    <el-card class="content-box-card">
      <template #header>
        <div class="content-header">
          <span>工作内容名称</span>
          <div>
            <el-button class="button">开工</el-button>
            <el-button class="button">完工</el-button>
            <el-button class="button">复核</el-button>
          </div>
        </div>
      </template>
      <div v-for="o in 4" :key="o" class="text item">
        {{ "List item " + o }}
      </div>
      <template #footer>Footer content</template>
    </el-card>
  </div>
</template>
<script>
export default {
  props: {
    currentNode: {
      type: Object,
      default() {
        return {};
      },
    },
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
.work-content-box {
  padding: 20px;
  .content-box-card {
    width: 480px;
    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .text {
      font-size: 14px;
    }

    .item {
      margin-bottom: 18px;
    }
  }
}
</style>