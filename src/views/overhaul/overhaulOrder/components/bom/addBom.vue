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
            <select-page
              ref="selectRef"
              v-model="form.bomNode"
              :defaultSelectVal="defaultSelectVal"
              :getOptions="getOptions"
            />
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
import { requiredVerify } from "@/common/js/validator";
import { getMaterial, getBigComponent } from "@/api/overhaul/bomApi.js";
import SelectPage from "@/components/SelectPage/selectPage.vue";
export default {
  components: {
    SelectPage,
  },
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
  data() {
    return {
      form: {
        bomNode: undefined,
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
      defaultSelectVal: {},
    };
  },
  watch: {
    "form.bomNodeType": {
      handler(val) {
        //切换节点类型时需要重置下拉选择框
        this.$refs.selectRef && this.$refs.selectRef.selectSearch("");
        this.defaultSelectVal = {};
      },
    },
  },
  computed: {
    operateTypeTitle() {
      return this.operateType === "add" ? "新增BOM节点" : "修改BOM节点";
    },
  },
  mounted() {
    if (this.operateType === "update") {
      this.form.bomNode = 1;
      this.form.bomNodeName = this.operateRow.data.treeName;
    }
  },
  methods: {
    //获取下拉选择项
    getOptions(params) {
      return new Promise((resolve, reject) => {
        const { pageNum, pageSize, searchKey } = params;
        let queryParms = {
          pageNum,
          pageSize,
          searchKey,
        };
        if (this.form.bomNodeType === 1) {
          getBigComponent(queryParms).then((res) => {
            debugger;
            let options = (res.data.pageList || []).map((item) => ({
              label: item.templateName,
              value: item.id,
            }));
            resolve({
              options: options,
              totalPage: res.data.total,
            });
          });
        } else {
          getMaterial(queryParms).then((res) => {
            debugger;
            let options = (res.data.pageList || []).map((item) => ({
              label: item.templateName,
              value: item.id,
            }));
            resolve({
              options: options,
              totalPage: res.data.total,
            });
          });
        }
      });
    },
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