<template>
  <a class="downloadFile"  v-if="href" :download="fileName" @click.stop="handleDownload">{{fileName}}</a>
</template>

<script>
import {downloadClick} from "@/utils";

export default {
  name: "xuiDownload",
  props:{
    href: {
      type: String,
      default: ''
    },
    fileName: String,
    downloadName: String,

  },
  methods: {
    handleDownload(){
      let href = this.href;
      if(href === undefined || href === null || href=== ''){
        return;
      }
      if(href.indexOf('minioServer') < 0){
        href = 'minioServer/' + href;
      }
      if(this.downloadName){
        downloadClick(href, this.downloadName);
      }else{
        downloadClick(href, this.fileName);
      }
      //点击事件
      this.$emit('click', {
        fileName: this.fileName,
        href: this.href
      })
    }
  }
}
</script>

<style scoped>

</style>
