<template>
  <div class="report-box">
    <el-row type="flex" justify="start">
      <el-col :span="5">
        模板选择：<el-select
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
        <el-button type="primary" size="small">
          <el-icon class="el-icon--left"><Document /></el-icon>保存
        </el-button>
        <el-button type="primary" size="small">
          <el-icon class="el-icon--left"><Stamp /></el-icon> 审核
        </el-button>

        <!-- <el-button type="primary" size="small" icon="el-icon-view">
          查看
        </el-button> -->

        <el-button type="primary" size="small">
          <el-icon class="el-icon--left"><Download /></el-icon>下载模板
        </el-button>
        <el-upload
          class="upload-demo upload-report"
          action="https://jsonplaceholder.typicode.com/posts/"
          :file-list="fileList"
          :auto-upload="false"
          accept=".doc,.docx,.pdf"
        >
          <el-button size="small" type="primary"
            ><el-icon class="el-icon--left"><UploadFilled /></el-icon>上传</el-button
          >
        </el-upload>
      </el-col>
    </el-row>
    <div
      class="report-box-editor"
      v-loading="loading"
      element-loading-text="文档加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
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
export default {
  components: {
    UploadFilled,
    Download,
    Stamp,
    Document,
  },
  props: {
    type: {
      type: String,
      default: "report",
    },
  },

  data() {
    return {
      //pdf的回显URL
      pdfURL: "",
      loading: false,
      fileList: [],
      templateChoose: undefined,
      //模板项
      templateOptions: [
        { label: "模板1", value: 1 },
        { label: "模板2", value: 2 },
      ],
    };
  },
  methods: {
    /**
     * 模板改变操作
     */
    handleTemplateChange(val) {
      this.loading = true;
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