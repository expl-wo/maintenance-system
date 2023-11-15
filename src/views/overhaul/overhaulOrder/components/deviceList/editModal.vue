<template>
  <el-dialog
    title="编辑"
    :model-value="true"
    :destroy-on-close="true"
    @close="handleClose"
  >
    <el-row type="flex" align="middle" justify="space-between">
      <el-col :span="12">
        <span class="mrl10">领用人:</span>
        <el-select
          size="small"
          v-model="userPerson"
          class="filter-item"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in userOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="12">
        <span class="mrl10">是否领用:</span>
        <el-radio-group v-model="isUser">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click.stop="handleClose"> 取消 </el-button>
        <el-button type="primary" :loading="useLoading" @click="useHandleOk">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
export default {
  props: {
    //操作行
    operateRow: {
      type: Object,
      default() {
        return null;
      },
    },
    modalName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      useLoading: true,
      userPerson: undefined,
      isUser: 0,
      userOptions: [{ label: "文罗江", value: 1 }],
    };
  },
  methods: {
    handleOk() {
      this.$emit("onSave", this.modalName);
      this.$emit("closeModal", this.modalName);
    },
    handleClose(isSearch = false) {
      this.$emit("closeModal", this.modalName, isSearch);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>