<template>
  <el-dialog
    draggable
    :title="MODAL_TYPE[dialogStatus]"
    :model-value="true"
    :destroy-on-close="true"
    :close-on-click-modal="false"
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
        <el-col :span="12">
          <el-form-item label="商机订单" prop="businessOrderId">
            <select-page
              ref="selectRef"
              v-model="form.businessOrderId"
              :defaultSelectVal="defaultSelectVal"
              :getOptions="getBusinessOrderOptions"
              :disabled="onlyEditFile"
              @change="businessOrderChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目名称" prop="projName">
            <el-input
              v-model="form.projName"
              clearable
              :disabled="onlyEditFile"
              :maxlength="100"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" justify="space-between">
        <el-col :span="12">
          <el-form-item label="生产号" prop="prodNumber">
            <el-input
              v-model="form.prodNumber"
              clearable
              :maxlength="100"
              :disabled="onlyEditFile"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户名称" prop="customName">
            <el-input
              v-model="form.customName"
              clearable
              :maxlength="100"
              :disabled="onlyEditFile"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" justify="space-between">
        <el-col :span="12">
          <el-form-item label="产品大类" prop="prodCategory">
            <el-select
              v-model="form.prodCategory"
              :disabled="onlyEditFile"
              class="filter-item"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in prodCategoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电压等级" prop="voltageLevel">
            <el-input
              v-model="form.voltageLevel"
              clearable
              :maxlength="100"
              :disabled="onlyEditFile"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" justify="space-between">
        <el-col :span="12">
          <el-form-item label="产品型号" prop="prodModel">
            <el-input
              v-model="form.prodModel"
              clearable
              :maxlength="100"
              :disabled="onlyEditFile"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="厂商" prop="manufacturer">
            <el-input
              v-model="form.manufacturer"
              :maxlength="100"
              clearable
              :disabled="onlyEditFile"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" justify="space-between">
        <el-col :span="12">
          <el-form-item label="计划开始时间">
            <el-date-picker
              v-model="form.planStartTime"
              type="datetime"
              placeholder="开始时间"
              :value-format="COMMON_FORMAT"
              :disabled="onlyEditFile"
              clearable
              @change="planStartTimeChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!-- 必须先选择开始时间 -->
          <el-form-item label="计划完成时间">
            <el-date-picker
              :disabled="!form.planStartTime || onlyEditFile"
              v-model="form.planEndTime"
              :value-format="COMMON_FORMAT"
              type="datetime"
              placeholder="完成时间"
              clearable
              :default-time="defaultTime"
              :disabled-date="disabledDate"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" justify="start">
        <el-col :span="12">
          <el-form-item label="附件上传">
            <multi-upload-vue
              :limit="maxUpload"
              :fileUrl="fileUrl"
              :fileName="fileName"
              @uploadSuccess="uploadSuccess"
            ></multi-upload-vue>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click.stop="handleClose"> 取消 </el-button>
        <el-button type="primary" :loading="saveLoading" @click="handleOk">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import {
  addWorkOrder,
  editWorkOrder,
  findWorkOrder,
  getBusinessOrderList,
  getProdCategory,
} from "@/api/overhaul/workOrderApi.js";
import { requiredVerify, safeLimit } from "@/common/js/validator";
import { WORK_ORDER_MAP } from "../config.js";
import SelectPage from "@/components/SelectPage/selectPage.vue";
import { COMMON_FORMAT } from "@/views/overhaul/constants.js";
import dayjs from "dayjs";
import multiUploadVue from "@/views/overhaul/overhaulCommon/multi-upload.vue";
const MODAL_TYPE = {
  update: "编辑工单",
  add: "新增工单",
};
export default {
  components: {
    SelectPage,
    multiUploadVue,
  },
  props: {
    //操作行
    operateRow: {
      type: Object,
      default() {
        return null;
      },
    },
    dialogStatus: {
      type: String,
      default: "add", //弹窗类型 1 为新增 2编辑
    },
    modalName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      defaultTime: new Date(0, 0, 0, 23, 59, 59), //默认时间
      COMMON_FORMAT,
      saveLoading: false,
      MODAL_TYPE,
      defaultSelectVal: {}, //用于下拉框回显
      //form表格数据
      form: {
        businessOrderId: "",
        businessOrderName: "",
        projName: "",
        prodNumber: "",
        customName: "",
        prodCategory: "",
        voltageLevel: "",
        prodModel: "",
        manufacturer: "",
        planStartTime: "",
        planEndTime: "",
        workOrderType: 1,
        attachmentName: "",
        attachmentUrl: "",
      },
      fileList: [],
      fileUrl: "",
      fileName: "",
      maxUpload: 30,
      rules: {
        businessOrderId: requiredVerify(),
        projName: safeLimit("", true),
        prodNumber: safeLimit("", false),
        customName: safeLimit("", true),
        prodCategory: requiredVerify(),
        voltageLevel: safeLimit("", true),
        prodModel: safeLimit("", false),
      },
      prodCategoryOptions: [],
      businessOrderOptions: [],
    };
  },
  async created() {
    const { data } = await getProdCategory();
    this.prodCategoryOptions = Object.keys(data).map((item) => ({
      label: data[item],
      value: +item,
    }));
    if (this.operateRow) {
      const { data } = await findWorkOrder(this.operateRow.id);
      this.form = data;
      this.fileName = this.form.attachmentName || "";
      this.fileUrl = this.form.attachmentUrl || "";
      //商机回显 的默认值
      if (this.form.businessOrderId) {
        this.defaultSelectVal = {
          value: this.form.businessOrderId,
          label: this.form.businessOrderName,
        };
      }
    }
  },
  computed: {
    //再工单结束时仅能新增附件无法删除附件
    onlyEditFile() {
      return this.operateRow
        ? !(this.operateRow.orderStatus === WORK_ORDER_MAP["createOrder"].value)
        : false;
    },
  },
  methods: {
    businessOrderChange(val) {
      if (!val) {
        this.form.businessOrderName = "";
        return;
      }
      const options = this.$refs.selectRef.selectOptions;
      const target = options.find((item) => item.value === val);
      if (target) {
        this.form.businessOrderName = target.label;
      } else {
        this.form.businessOrderName = "";
      }
    },
    uploadSuccess(fileName, fileList) {
      this.fileList = fileList;
      this.form.attachmentName = fileName;
      this.form.attachmentUrl = fileList
        .map((item) => item.fileUrl || [])
        .join("|");
    },
    //开始时间改变时
    planStartTimeChange(val) {
      if (!val) {
        //如果为空了则需要重新选择结束时间
        this.form.planEndTime = "";
      }
    },
    //禁用时间主要用于禁止开始时间早于结束时间
    disabledDate(Date) {
      return dayjs(Date).isBefore(dayjs(this.form.planStartTime));
    },
    /**
     * 获取商机订单的方法
     */
    getBusinessOrderOptions(pageOptions) {
      const { pageNum, pageSize, searchKey } = pageOptions;
      let queryParms = {
        pageNum,
        pageSize,
        searchKey,
      };
      return new Promise((resolve, reject) => {
        getBusinessOrderList(queryParms).then((res) => {
          resolve({
            options: res.data.pageList.map((item) => ({
              label: item.projName,
              value: item.rowId,
            })),
            totalPage: res.data.allPageNum,
          });
        });
      });
    },
    handleOk() {
      this.$refs["dataForm"].validate(async (valid) => {
        if (!valid) return;
        this.saveLoading = true;
        if (this.operateRow && this.operateRow.id) {
          editWorkOrder(this.form)
            .then(() => {
              this.handleClose(true);
            })
            .finally(() => {
              this.saveLoading = false;
            });
        } else {
          addWorkOrder(this.form)
            .then(() => {
              this.handleClose(true);
            })
            .finally(() => {
              this.saveLoading = false;
            });
        }
      });
    },
    handleClose(isSearch = false) {
      this.$emit("closeModal", this.modalName, isSearch);
    },
  },
};
</script>

<style lang="scss" scoped>
:deep(.el-input) {
  width: 220px;
}
:deep(.el-input__wrapper) {
  width: 220px;
}
:deep(.el-input--small .el-input__inner) {
  width: 220px;
}
</style>
