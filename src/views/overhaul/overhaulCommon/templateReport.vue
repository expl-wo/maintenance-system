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
          :disabled="isBtnDisabled || isDisabledStauts"
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
          :disabled="isBtnDisabled || !templateChoose || isDisabledStauts"
          @click="saveFile"
        >
          <el-icon class="el-icon--left"><Document /></el-icon>保存
        </el-button>
        <el-button
          v-if="$isAuth(this.menuCodeEdit)"
          type="primary"
          :disabled="isBtnDisabled || isDisabledStauts"
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
          :disabled="isBtnDisabled || isDisabledStauts"
          v-model:file-list="fileList"
          :before-upload="beforeUpload"
          :http-request="uploadFile"
          :show-file-list="false"
          :auto-upload="true"
          accept=".docx"
        >
          <el-button
            type="primary"
            :disabled="isBtnDisabled || isDisabledStauts"
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
    <div class="report-box-editor" v-if="wordUri" ref="reportWordRef">
    </div>
    <el-empty
        v-else
        style="height: 100%"
        description="暂无可预览文档"
        :image-size="200"
      ></el-empty>
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
import { downloadClick } from "@/utils";
import { renderAsync } from "docx-preview";
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
    //选中的label名字
    activeLabel: {
      type: String,
      default: "",
    },
    //工单类型
    workOrderType: {
      type: Number,
      default: 1,
    },
    onlyTabName: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      REPORT_CHECK_STATUS,
      templateStatus: 0,
      //wordUri
      wordUri: "",
      loading: false,
      loadingType: 1,
      fileList: [],
      templateChoose: undefined,
      //模板项
      templateOptions: [],
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
        4: "文档上传中。。。",
      };
      return textMap[this.loadingType];
    },
    //按钮全禁用情况
    isBtnDisabled() {
      return [
        COMMOM_WORK_ORDER_MAP["pause"].value,
        COMMOM_WORK_ORDER_MAP["finish"].value,
      ].includes(this.workOrderInfo.orderStatus);
    },
    isDisabledStauts() {
      return (
        [1, 2].includes(this.templateStatus) ||
        this.onlyTabName === "surveyItem-report"
      );
    },
  },
  watch:{
    wordUri(val){
      if(val){
        this.renderWord(val);
      }
    }
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
    this.getSaveFile();
  },
  methods: {
    renderWord(url) {
      fetch(url).then((res) => {
        res.blob().then((res) => {
          renderAsync(res, this.$refs.reportWordRef, null, {
            className: "docx", //默认和文档样式类的类名/前缀
            inWrapper: true, //启用围绕文档内容呈现包装器
            ignoreWidth: false, //禁用页面的渲染宽度
            ignoreHeight: false, //禁用页面的渲染高度
            ignoreFonts: false, //禁用字体渲染
            breakPages: true, //在分页符上启用分页
            ignoreLastRenderedPageBreak: true, //在lastRenderedPageBreak元素上禁用分页
            experimental: false, //启用实验功能（制表符停止计算）
            trimXmlDeclaration: true, //如果为true，则在解析之前将从xml文档中删除xml声明
            useBase64URL: false, //如果为true，图像、字体等将转换为base 64 URL，否则使用URL.createObjectURL
            useMathMLPolyfill: false, //包括用于铬、边等的MathML多填充。
            showChanges: false, //启用文档更改的实验渲染（插入/删除）
            debug: false, //启用额外的日志记录
          });
        });
      });
    },
    dealUrl(url) {
      if (!url) return "";
      if (url.indexOf("minioServer") < 0) {
        url = "minioServer/" + url;
      }
      return url;
    },
    getSaveFile() {
      getWorkDocmentInfo({
        workCode: this.workOrderInfo.id,
        workDocType: this.workType,
      }).then(({ data }) => {
        const { templateCode, reviewStatus, wordUri } = data;
        this.templateStatus = reviewStatus || 0;
        this.templateChoose = templateCode || undefined;
        this.wordUri = this.dealUrl(wordUri);
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
      if (!this.wordUri) {
        this.$message.error("暂无可保存数据！");
        return;
      }
      saveWorkDocmentInfo({
        workCode: this.workOrderInfo.id,
        templateCode: this.templateChoose,
        workDocType: this.workType,
        wordUri: this.wordUri,
      }).then((res) => {
        if (res.code !== "0") {
          this.$message.error(res.errMsg);
        } else {
          this.$message.success("保存成功");
        }
        this.loading = false;
      });
    },
    uploadFile(file) {
      const formData = new FormData();
      // 文件对象
      formData.append("docInfo", file.file);
      formData.append("workCode", this.workOrderInfo.id);
      formData.append("workDocType", this.workType);
      this.loading = true;
      this.loadingType = 4;
      // 调用保存接口 将form的值全都传过去
      uploadWorkDocmentInfo(formData).then((res) => {
        if (res.code !== "0") {
          this.$message.error(res.errMsg);
        } else {
          this.$message.success("操作成功，上传文件已自动保存！");
          this.wordUri = this.dealUrl(res.data.wordUri);
          this.templateChoose = undefined;
        }
        this.loading = false;
      });
    },
    //下载文件
    downLoadFile() {
      downloadWorkDocmentInfo({
        workCode: this.workOrderInfo.id,
        workDocType: this.workType,
      }).then((res) => {
        if (res.code !== "0") {
          this.$message.error(res.errMsg);
        } else {
          downloadClick(this.dealUrl(res.data.docUri), this.activeLabel);
        }
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
            if (res.code !== "0") {
              this.$message.error(res.errMsg);
            } else {
              this.$message.success("提交审核成功！");
            }
            this.loading = false;
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
        if (res.code !== "0") {
          this.wordUri = "";
          this.$message.error(res.errMsg);
        } else {
          this.wordUri = this.dealUrl(res.data.ossWordUri);
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
    height: 680px;
    margin-top: 10px;
    overflow-y: scroll;
  }
  .upload-report {
    display: inline-block;
    margin-left: 12px;
    vertical-align: top;
  }
}
</style>