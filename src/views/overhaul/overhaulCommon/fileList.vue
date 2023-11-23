<template>
  <div class="upload-operator" :style="{ width }">
    <div
      class="upload-operator-item"
      v-for="(item, index) in fileList"
      :key="index"
    >
      <overhaul-download
        :href="item.fileUrl"
        :fileName="item.fileName"
      ></overhaul-download>
      <el-button
        v-if="isCanDelete"
        class="delete-btn"
        @click="handleDelete(item)"
        type="danger"
        >删除</el-button
      >
    </div>
  </div>
</template>

<script>
import OverhaulDownload from "@/views/overhaul/overhaulCommon/download.vue";
export default {
  props: {
    //文件类型
    fileList: {
      type: Array,
      default() {
        return [];
      },
    },
    isCanDelete: {
      type: Boolean,
      default: true,
    },
    width: {
      type: String,
      default: "unset",
    },
  },
  components: {
    OverhaulDownload,
  },
  methods: {
    handleDelete(item) {
      this.$emit("onDelete", item);
    },
  },
};
</script>

<style lang="scss" scoped>
.upload-operator {
  max-height: 100px;
  overflow-y: auto;
}
.upload-operator-item {
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .delete-btn {
    margin-right: 10px;
    margin-left: 4px;
    margin-top: -2px;
  }
}
</style>