<template>
  <el-dialog
    :title="operateTypeTitle"
    :model-value="true"
    class="overhaul-bom-modal"
    :destroy-on-close="true"
    width="500"
    @close="handleClose"
  >
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="form"
      label-position="right"
      size="small"
      label-width="100px"
    >
      <el-row type="flex" align="middle" justify="space-between">
        <el-col :span="24">
          <el-form-item label="节点类型" prop="bomNodeType">
            <el-select v-model="form.bomNodeType" placeholder="请选择">
              <el-option
                v-for="item in bomNodeTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" justify="space-between">
        <el-col :span="24">
          <el-form-item
            :label="form.bomNodeType === 1 ? '大部件' : '物料类别'"
            prop="bomNode"
          >
            <el-select v-model="form.bomNode" placeholder="请选择" clearable>
              <el-option
                v-for="item in bomNodeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click.stop="handleClose"> 取消 </el-button>
        <el-button type="primary" @click="handleOk"> 保存 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { requiredVerify, safeLimit } from "@/common/js/validator";
export default {
  props: {
    //操作行
    operateRow: {
      type: Object,
      default() {
        return null;
      },
    },
    operateType: {
      type: String,
      default: "add",
    },
    modalName: {
      type: String,
      default: "",
    },
  },
  computed: {
    operateTypeTitle() {
      return this.operateType === "add" ? "新增BOM节点" : "修改BOM节点";
    },
  },
  data() {
    return {
      form: {
        bomNode: 1,
        bomNodeType: 1,
        bomNodeName: "",
      },
      rules: {
        bomNode: requiredVerify(),
        bomNodeType: requiredVerify(),
        // bomNodeName: safeLimit("", true),
      },
      bomNodeTypeOptions: [
        { label: "大部件", value: 1 },
        { label: "物料类别", value: 2 },
      ],
      bomNodeOptions: [
        { label: "电容", value: 1 },
        { label: "测试", value: 2 },
      ],
    };
  },
  mounted() {
    if (this.operateType === "update") {
      this.form.bomNode = 1;
      this.form.bomNodeName = this.operateRow.data.treeName;
    }
  },
  methods: {
    handleOk() {
      this.$refs["dataForm"].validate((valid) => {
        debugger;
        this.$emit("closeModal", this.modalName);
      });
    },
    handleClose(isSearch = false) {
      this.$emit("closeModal", this.modalName, isSearch);
    },
  },
};
</script>