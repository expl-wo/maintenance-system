<template>
  <el-dialog
    draggable
    :title="operateTypeTitle"
    :model-value="true"
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
              v-if="showSelectPage"
              ref="selectRef"
              v-model="form.bomNode"
              :defaultSelectVal="defaultSelectVal"
              :getOptions="getOptions"
              @change="selectChange"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" justify="space-between">
        <el-col :span="24">
          <el-form-item label="利旧状态">
            <el-select
              v-model="form.utilizeStatus"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in utilizeStatusOptions"
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
          <el-form-item label="备注">
            <el-input
              v-model="form.memo"
              :maxlength="500"
              autosize
              type="textarea"
              clearable
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
import {
  getMaterial,
  getBigComponent,
  addBomNode,
  updateBomNode,
} from "@/api/overhaul/bomApi.js";
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
    //当前工单的详情
    workOrderInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      form: {
        bomNode: undefined,
        bomCode: "",
        bomNodeType: 1,
        bomName: "",
        utilizeStatus: undefined,
        memo: "",
      },
      rules: {
        bomNode: requiredVerify(),
        bomNodeType: requiredVerify(),
        // bomName: safeLimit("", true),
      },
      utilizeStatusOptions: [
        { label: "废弃", value: 1 },
        { label: "利旧", value: 2 },
        { label: "维修", value: 3 },
      ],
      bomNodeTypeOptions: [
        { label: "大部件", value: 1 },
        { label: "物料类别", value: 2 },
      ],
      defaultSelectVal: {},
      showSelectPage:true
    };
  },
  watch: {
    "form.bomNodeType": {
      handler(val) {
        //切换节点类型时需要重置下拉选择框
        this.showSelectPage=false
        this.$nextTick(()=>{
          this.showSelectPage=true;
          this.$refs.selectRef && this.$refs.selectRef.selectSearch("");
          this.form = {
          ...this.form,
          bomNode: undefined,
          bomCode: "",
          bomName: "",
        };
        this.defaultSelectVal = {};
        })
       
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
      this.form.bomType = +this.operateRow.bomType;
      this.form.bomCode = this.operateRow.bomCode;
      this.form.bomName = this.operateRow.bomName;
      this.form.utilizeStatus = this.operateRow.utilize;
      this.form.memo = this.operateRow.memo;
      if (this.form.bomNodeType === 1) {
        this.form.bomNode = this.operateRow.bomName;
        if (!this.operateRow.bomName) return;
        this.defaultSelectVal = {
          label: this.form.bomNode,
          value: this.form.bomNode,
          featureNo: this.form.bomCode,
        };
      } else {
        this.form.bomNode = this.operateRow.bomCode;
        if (!this.operateRow.bomName) return;
        this.defaultSelectVal = {
          label: this.form.bomName,
          value: this.form.bomNode,
        };
      }
    }
  },
  methods: {
    selectChange(val) {
      this.form.bomCode = val;
      if (!val) {
        this.form.bomName = "";
        return;
      }
      const options = this.$refs.selectRef.selectOptions;
      const target = options.find((item) => item.value === val);
      if (target) {
        if (this.form.bomNodeType === 1) {
          this.form.bomName = target.name;
          this.form.bomCode = target.featureNo;
        } else {
          this.form.bomName = target.label;
        }
      } else {
        this.form.bomName = "";
        this.form.bomCode = "";
      }
    },
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
            let options = (res.data.pageList || []).map((item) => ({
              ...item,
              label: item.name,
              value: `${item.name}_${item.featureNo}`,
            }));
            resolve({
              options: options,
              totalPage: res.data.total,
            });
          });
        } else {
          getMaterial(queryParms).then((res) => {
            let options = (res.data.pageList || []).map((item) => ({
              label: item.className,
              value: item.classCode,
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
        if (!valid) return;
        let params = {
          workId: this.workOrderInfo.id,
          bomType: this.form.bomNodeType,
          bomCode: this.form.bomCode,
          bomName: this.form.bomName,
          utilize: this.form.utilizeStatus,
          memo: this.form.memo,
        };
        if (this.operateType === "update") {
          updateBomNode({ ...params, id: this.operateRow.id }).then((res) => {
            if (res.code !== "0") {
              this.$message.error(res.errMsg);
              return;
            }
            this.$message.success("操作成功！");
            this.handleClose(true);
          });
        } else {
          addBomNode({ ...params, parentTreeId: this.operateRow.treeId }).then(
            (res) => {
              if (res.code !== "0") {
                this.$message.error(res.errMsg);
                return;
              }
              this.$message.success("操作成功！");
              this.handleClose(true);
            }
          );
        }
      });
    },
    handleClose(isSearch = false) {
      this.$emit("closeModal", this.modalName, isSearch);
    },
  },
};
</script>
