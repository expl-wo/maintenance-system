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
        模板选择：<el-select
          :disabled="isBtnDisabled"
          size="small"
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
          v-if="isHiddenHeader"
          type="primary"
          size="small"
          :disabled="isBtnDisabled"
          @click="saveFile"
        >
          <el-icon class="el-icon--left"><Document /></el-icon>保存
        </el-button>
        <el-button
          v-if="isHiddenHeader"
          type="primary"
          size="small"
          :disabled="isBtnDisabled"
          @click="checkFile"
        >
          <el-icon class="el-icon--left"><Stamp /></el-icon> 发起审核
        </el-button>
        <el-button
          type="primary"
          size="small"
          :disabled="isBtnDisabled"
          @click="downLoadFile"
        >
          <el-icon class="el-icon--left"><Download /></el-icon>下载
        </el-button>
        <el-upload
          v-if="isHiddenHeader"
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
          <el-button size="small" type="primary" :disabled="isBtnDisabled"
            ><el-icon class="el-icon--left"><UploadFilled /></el-icon
            >上传</el-button
          >
        </el-upload>
        <el-tag
          :key="REPORT_CHECK_STATUS[1].label"
          :type="REPORT_CHECK_STATUS[1].type"
          class="mrl12"
          effect="plain"
          round
        >
          {{ REPORT_CHECK_STATUS[1].label }}
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
  UploadFilled,
  Download,
  Stamp,
  Document,
} from "@element-plus/icons-vue";
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
} from "@/views/overhaul/constants.js";
import { downLoadBlob } from "../tools.js";
export default {
  components: {
    UploadFilled,
    Download,
    Stamp,
    Document,
  },
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
    loadingText() {
      const textMap = {
        1: "文档生成中。。。",
        2: "文档保存中。。。",
        3: "文档发起审批中。。。",
      };
      return textMap[this.loadingType];
    },
    //隐藏header
    isHiddenHeader() {
      if (this.workOrderType === 2 && this.workType === 1) {
        return false;
      }
      return true;
    },
    //按钮全禁用情况
    isBtnDisabled() {
      if (this.workOrderInfo.orderStatus === 17) {
        //暂停
        return true;
      } else if (!this.workOrderInfo.workOrderCode) {
        //工单没有workOrderCode 工序模板编号时禁用
        return true;
      }
      return false;
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
        overHaulCode: 1,
        workType: this.workType,
      }).then((res) => {
        debugger;
      });
    },
    /**
     * 上传前置操作
     */
    beforeUpload(file) {
      if (file.size > MAX_FILE_SIZE) {
        this.$message.error(`附件大小请勿超过${MAX_FILE_SIZE / 1024 / 1024}M`);
        return false;
      }
      return true;
    },
    //保存文档
    saveFile() {
      this.loading = true;
      this.loadingType = 2;
      saveWorkDocmentInfo({
        overHaulCode: 1,
        workType: this.workType,
        templateCode: "21212",
      }).then((res) => {
        this.loading = false;
        debugger;
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
        overHaulCode: 1,
        workType: this.workType,
      }).then((res) => {
        debugger; // 创建blob对象，解析流数据
        const blob = new Blob([res], {
          // 设置返回的文件类型
          // type: 'application/pdf;charset=UTF-8' 表示下载文档为pdf，如果是word则设置为msword，excel为excel
          type: type,
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
            overHaulCode: 1,
            workType: this.workType,
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
      this.loading = true;
      this.loadingType = 1;
      createPDF(val).then((res) => {
        debugger;
      });
      setTimeout(() => {
        this.pdfURL = "http://ashuai.work/api/pdf.pdf";
        this.loading = false;
      }, 3000);
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