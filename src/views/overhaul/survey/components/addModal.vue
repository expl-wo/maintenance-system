<template>
  <el-dialog
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
      size="small"
      label-width="100px"
    >
      <el-row type="flex" align="middle" justify="space-between">
        <el-col :span="12">
          <el-form-item label="商机订单" prop="businessOrder">
            <select-page
              v-model="form.businessOrder"
              :getOptions="getBusinessOrderOptions"
              :disabled="onlyEditFile"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目名称" prop="projName">
            <el-input
              v-model="form.projName"
              clearable
              :disabled="onlyEditFile"
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
              :disabled="onlyEditFile"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户名称" prop="customName">
            <el-input
              v-model="form.customName"
              clearable
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
              :disabled="onlyEditFile"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="厂商" prop="manufacturer">
            <el-input
              v-model="form.manufacturer"
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
      //form表格数据
      form: {
        businessOrder: "",
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
        businessOrder: requiredVerify(),
        projName: safeLimit("", true),
        prodNumber: safeLimit("", false),
        customName: safeLimit("", true),
        prodCategory: requiredVerify(),
        voltageLevel: safeLimit("", true),
        prodModel: safeLimit("", false),
      },
      prodCategoryOptions: [{ label: "产品打类", value: 1 }],
      businessOrderOptions: [
        { label: "浙江大华1", value: 2 },
        { label: "浙江大华2", value: 3 },
        { label: "浙江大华3", value: 41 },
        { label: "浙江大华4", value: 4 },
        { label: "浙江大华5", value: 5 },
        { label: "浙江大华6", value: 6 },
        { label: "浙江大华7", value: 7 },
        { label: "浙江大华8", value: 8 },
      ],
    };
  },
  async mounted() {
    if (this.operateRow) {
      const { data } = await findWorkOrder(this.operateRow.id);
      this.form = data;
      this.fileName = this.form.attachmentName;
      this.fileUrl = this.form.attachmentUrl;
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
            options: this.businessOrderOptions,
            totalPage: 5,
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
::v-deep(.el-input) {
  width: 220px;
}
::v-deep(.el-input__wrapper) {
  width: 220px;
}
::v-deep(.el-input--small .el-input__inner) {
  width: 220px;
}
</style>