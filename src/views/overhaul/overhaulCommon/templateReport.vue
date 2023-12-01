<template>
  <div
    class="report-box"
    v-loading="loading"
    :element-loading-text="loadingText"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-row type="flex" justify="start">
      <el-col :span="4">
        模板选择
        <el-select
          :disabled="isBtnDisabled"
          v-model="templateChoose"
          class="filter-item"
          placeholder="请选择"
          @change="handleTemplateChange"
        >
          <el-option
            v-for="item in templateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="10">
        <el-button
          v-if="$isAuth(this.menuCodeEdit)"
          type="primary"
          :disabled="isBtnDisabled"
          @click="saveFile"
        >
          <el-icon class="el-icon--left"><Document /></el-icon>保存
        </el-button>
        <el-button
          v-if="$isAuth(this.menuCodeEdit)"
          type="primary"
          :disabled="isBtnDisabled"
          @click="checkFile"
        >
          <el-icon class="el-icon--left"><Stamp /></el-icon> 发起审核
        </el-button>
        <el-button
          type="primary"
          :disabled="isBtnDisabled"
          @click="downLoadFile"
        >
          <el-icon class="el-icon--left"><Download /></el-icon>下载
        </el-button>
        <el-upload
          v-if="$isAuth(this.menuCodeEdit)"
          class="upload-demo upload-report"
          :limit="1"
          :disabled="isBtnDisabled"
          v-model:file-list="fileList"
          :before-upload="beforeUpload"
          :http-request="uploadFile"
          :show-file-list="false"
          :auto-upload="true"
          accept=".doc,.docx,.pdf"
        >
          <el-button type="primary" :disabled="isBtnDisabled"
            ><el-icon class="el-icon--left"><UploadFilled /></el-icon
            >上传</el-button
          >
        </el-upload>
        <el-tag
          :key="REPORT_CHECK_STATUS[templateStatus].label"
          :type="REPORT_CHECK_STATUS[templateStatus].type"
          class="mrl12"
          effect="plain"
          round
        >
          {{ REPORT_CHECK_STATUS[templateStatus].label }}
        </el-tag>
      </el-col>
    </el-row>
    <div class="report-box-editor">
      <iframe
        v-if="pdfURL"
        width="100%"
        height="100%"
        :src="pdfURL"
        frameborder="0"
      ></iframe>
      <el-empty
        v-else
        style="height: 100%"
        description="暂无可预览文档"
        :image-size="200"
      ></el-empty>
    </div>
  </div>
</template>

<script>
import {
  getWorkDocmentTemplate,
  getWorkDocmentInfo,
  createPDF,
  saveWorkDocmentInfo,
  downloadWorkDocmentInfo,
  uploadWorkDocmentInfo,
  checkWorkDocmentInfo,
} from "@/api/overhaul/workOrderApi.js";
import {
  MAX_FILE_SIZE,
  REPORT_CHECK_STATUS,
  COMMOM_WORK_ORDER_MAP,
  MENU_CODE,
} from "@/views/overhaul/constants.js";
import { downLoadBlob } from "../tools.js";
export default {
  props: {
    //报告模板类型类型
    workType: {
      type: [Number, String],
      default: "1",
    },
    //当前工单的详情
    workOrderInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    //工单类型
    workOrderType: {
      type: Number,
      default: 1,
    },
  },

  data() {
    return {
      REPORT_CHECK_STATUS,
      templateStatus: 0,
      //pdf的回显URL
      pdfURL: "",
      loading: false,
      loadingType: 1,
      fileList: [],
      templateChoose: undefined,
      //模板项
      templateOptions: [
        { label: "模板1", value: 1 },
        { label: "模板2", value: 2 },
      ],
    };
  },
  computed: {
    //编辑权限
    menuCodeEdit() {
      return `${MENU_CODE[this.workOrderType]}_report_view_${this.workType}`;
    },
    loadingText() {
      const textMap = {
        1: "文档生成中,预计1分钟,请耐心等待。。。",
        2: "文档保存中。。。",
        3: "文档发起审批中。。。",
      };
      return textMap[this.loadingType];
    },
    //按钮全禁用情况
    isBtnDisabled() {
      // if (!this.workOrderInfo.workOrderCode) {
      //   //工单没有workOrderCode 工序模板编号时禁用
      //   return true;
      // }
      return [
        COMMOM_WORK_ORDER_MAP["pause"].value,
        COMMOM_WORK_ORDER_MAP["finish"].value,
      ].includes(this.workOrderInfo.orderStatus);
    },
  },
  async mounted() {
    try {
      const {
        data: { value },
      } = await getWorkDocmentTemplate(this.workType);
      this.templateOptions = value.map((item) => ({
        label: item.name,
        value: item.docId,
      }));
    } catch (error) {
      this.templateOptions = [];
    }
  },
  methods: {
    getSaveFile() {
      getWorkDocmentInfo({
        workCode: this.workOrderInfo.id,
        workDocType: this.workType,
      }).then(({ templateCode, reviewStatus, pdfUri }) => {
        debugger;
        this.templateStatus = reviewStatus;
        this.templateChoose = templateCode;
        this.pdfURL = pdfUri;
      });
    },
    /**
     * 上传前置操作
     */
    beforeUpload(file) {
      if (file.size / 1024 / 1024 > MAX_FILE_SIZE) {
        this.$message.error(`附件大小请勿超过${MAX_FILE_SIZE}M`);
        return false;
      }
      return true;
    },
    //保存文档
    saveFile() {
      this.loading = true;
      this.loadingType = 2;
      saveWorkDocmentInfo({
        workCode: this.workOrderInfo.id,
        templateCode: this.templateChoose,
        workDocType: this.workType,
      }).then((res) => {
        if (res.code !== "0") {
          this.$message.error(res.errMsg);
        } else {
          this.$message.success("保存成功");
        }
        this.loading = false;
      });
    },
    // 上传图片
    uploadFile(file) {
      const formData = new FormData();
      // 文件对象
      formData.append("docInfo", file.file);
      formData.append("overHaulCode", 1111);
      formData.append("workType", this.workType);
      // 调用保存接口 将form的值全都传过去
      uploadWorkDocmentInfo(formData).then((res) => {
        debugger;
      });
    },
    //下载文件
    downLoadFile() {
      downloadWorkDocmentInfo({
        workCode: this.workOrderInfo.id,
        workDocType: this.workType,
      }).then((res) => {
        debugger; // 创建blob对象，解析流数据
        const blob = new Blob([res], {
          type: "application/msword;charset=UTF-8",
        });
        downLoadBlob("test.pdf", blob);
      });
    },
    //提交审核
    checkFile() {
      this.loading = true;
      this.loadingType = 3;
      this.$confirm("确认将该报告发起审核?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          checkWorkDocmentInfo({
            workCode: this.workOrderInfo.id,
            workDocType: this.workType,
          }).then((res) => {
            this.loading = false;
            debugger;
          });
        })
        .catch(() => {});
    },
    /**
     * 模板改变操作
     */
    handleTemplateChange(val) {
      if (!val) return;
      this.loading = true;
      this.loadingType = 1;
      createPDF({
        workCode: this.workOrderInfo.id,
        templateCode: val,
        workDocType: this.workType,
      }).then((res) => {
        if (Reflect.has(res, "code")) {
          if (res.code !== "0") {
            this.$message.error(res.errMsg);
          }
        } else {
          const blob = new Blob([res], { type: "application/pdf" });
          this.pdfURL = window.URL.createObjectURL(blob);
        }
        this.loading = false;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.report-box {
  height: 100%;
  width: 100%;
  .mrl12 {
    margin-left: 12px;
  }
  &-editor {
    width: 100%;
    height: 600px;
    margin-top: 10px;
  }
  .upload-report {
    display: inline-block;
    margin-left: 12px;
    vertical-align: top;
  }
}
</style>