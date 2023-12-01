<template>
  <a
    class="downloadFile"
    v-if="href"
    :download="fileName"
    @click.stop="handleDownload"
    :title="fileName"
    ><el-icon class="overhaul-icon-down"><Document /></el-icon
    >{{ fileNameText }}</a
  >
</template>

<script>
import { downloadClick } from "@/utils";

export default {
  props: {
    href: {
      type: String,
      default: "",
    },
    fileName: {
      type: String,
      default: "",
    },
    downloadName: String,
  },
  computed: {
    fileNameText() {
      return (this.fileName && this.fileName.length) > 20
        ? this.fileName.substring(0, 17) + "..."
        : this.fileName;
    },
  },
  methods: {
    handleDownload() {
      let href = this.href;
      if (href === undefined || href === null || href === "") {
        return;
      }
      if (href.indexOf("minioServer") < 0) {
        href = "minioServer/" + href;
      }
      if (this.downloadName) {
        downloadClick(href, this.downloadName);
      } else {
        downloadClick(href, this.fileName);
      }
      //点击事件
      this.$emit("click", {
        fileName: this.fileName,
        href: this.href,
      });
    },
  },
};
</script>

<style scoped>
a:hover {
  color: var(--el-color-primary);
  cursor: pointer;
  text-decoration: underline;
}
.overhaul-icon-down {
  margin-right: 5px;
}
</style>
