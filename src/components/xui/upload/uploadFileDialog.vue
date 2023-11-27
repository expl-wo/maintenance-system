<template>
  <el-dialog
      title="上传文件"
      v-model="dialogVisible"
      width="700px"
      :before-close="beforeClose"
      :close-on-click-modal="false">
    <div>
      <div class="uploadclass">
        <el-upload
            class="bodyd"
            ref="upload"
            action="#"
            :limit="1"
            :before-upload="beforeUpload"
            :http-request="httpUpload"
            :auto-upload="false"
            :on-change="change"
        >
          <el-button type="primary">选择文件</el-button>
          <template #tip>
            <div class="el-upload__tip"> 文件大小不能超过{{ fileMaxSize }}G，视频文件格式只支持mp4</div>
            <div class="el-upload__tip status-danger" v-if="isLargeFile">文件较大，上传需要时间，请耐心等待...</div>
          </template>
        </el-upload>
        <el-progress v-if="progressFlag" :percentage="percentage"/>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="upload" :disabled="btnText==='上传中'">{{ btnText }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import Axios from "axios";
import Queue from 'promise-queue-plus';
import {initMultipart, completeMultipart} from "@/portal/api/file";
import Constants from '@/utils/constants'
import portalConstants from "@/portal/utils/portalConstants";
import {getFileType} from "@/utils";
import {disable} from "@/sys/api/menu";

export default {
  name: 'uploadBigFileDialog',
  data() {
    return {
      file: null,
      dialogVisible: false,
      fileMaxSize: 4,
      photoFileType: Constants.photoType,
      videoType: Constants.videoType,
      percentage: 0,
      btnText: '上传',
      // partSize: 5242880 * 10, //50M
      partSize: 5242880 * 4, //5M
      queue: null,
      isLargeFile: false,
      largeFileSize:  1024 * 1024 * 1024
    };
  },
  computed: {
    progressFlag() {
      return this.percentage > 0;
    }
  },
  methods: {
    init() {
      this.btnText = '上传';
      this.percentage = 0;
      this.dialogVisible = true;
    },
    //上传文件格式
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 / 1024 < this.fileMaxSize;
      if (!isLt2M) {
        this.$message.error("上传文件大小不能超过 " + this.fileMaxSize + "GB!");
      }
      return isLt2M;
    },
    change(file) {
      this.file = file.raw
    },
    async initUpload(file) {
      let chunkSize = this.partSize, fileSize = file.size;
      if(fileSize >= this.largeFileSize){
        this.isLargeFile = true;
      }else{
        this.isLargeFile = false;
      }
      const chunkCount = Math.ceil(fileSize / chunkSize)
      console.log("文件大小：",(file.size / 1024 / 1024) + "Mb","分片数：",chunkCount)
      let params = {
        chunkSize: chunkCount,
        fileName: file.name
      };
      const response = await initMultipart(params);
      const chunkUploadUrls = response.data.chunks;
      const failArr = [];
      let start = '', end = '';
      this.queue = Queue(5, {
        "retry": 3,               //Number of retries
        "retryIsJump": false,     //retry now?
        "workReject": function(reason,queue){
          failArr.push(reason)
        },
        "queueEnd": queue=>{
          //队列处理完成
          this.btnText = '上传';
          if(failArr.length > 0){
            this.$message.error('部分分片上次失败，请尝试重新上传文件')
          }else{
            this.composeFile(response.data.uploadId, file.name, chunkCount, fileSize, file.contentType, response.data.uploadName)
          }
        }
      })
      for (let item of chunkUploadUrls) {
        item.uploadFinish = false;
        //分片开始位置
        start = (item.partNumber) * chunkSize
        //分片结束位置
        end = Math.min(fileSize, start + chunkSize)
        //取文件指定范围内的byte，从而得到分片数据
        let _chunkFile = file.slice(start, end)

        this.queue.push(() => this.uploadSinglePart(item, _chunkFile).then(res => {
          // 单片文件上传完成再更新上传进度
          this.updateProcess(chunkUploadUrls);
        }))
      }
      this.btnText = '上传中';
      this.queue.start();
    },
    //计算进度
    updateProcess(chunkUploadUrls){
      //对item分析，是否已上传成功
      let count = chunkUploadUrls.length;
      let finishCount = 0;
      chunkUploadUrls.forEach(item=>{
        if(item.uploadFinish){
          finishCount++;
        }
      })
      this.percentage = Number((finishCount / count * 100).toFixed(2))
      if(this.percentage>100){
        this.percentage = 100;
      }
      console.log('per: ' + this.percentage);
    },
    //上传分片
    async uploadSinglePart(item, _chunkFile){
      console.log("开始上传第" + item.partNumber + "个分片");
      await Axios.request({
        url: item.uploadUrl,
        method: 'PUT',
        data: _chunkFile,
        headers: {'Content-Type': 'application/octet-stream'}
      })
      //上传成功
      console.log("第" + item.partNumber + "个分片上传成功");
      item.uploadFinish = true;
      return Promise.resolve(item)
    },
    //文件上传
    async httpUpload(file) {
      await this.initUpload(file);
    },
    //分片上传完成合并
    async composeFile(uploadId, fileName, chunkSize, fileSize, contentType, uploadName) {
      let data = {
        uploadId: uploadId,
        fileName: fileName,
        chunkSize: chunkSize,
        fileSize: fileSize,
        contentType: contentType,
        module: Constants.fileModule.portal_material,
        fileType: getFileType(fileName),
        uploadName
      }
      const response = await completeMultipart(data);
      if(response.code === Constants.respCode.success){
        console.log("合并文件完成");
        this.$message.success('文件上传成功');
        this.$emit('refresh', {});
        this.closeDialog();
      }
    },
    upload() {
      if (!this.file) {
        this.$message.error('请选择需要导入的文件');
        return;
      }
      this.httpUpload(this.file)
    },
    cancel() {

      if(this.queue && this.queue.getLength() > 0){
        this.$confirm('文件正在上传中，确定要中断吗？').then(() => {
          this.closeDialog();
        })
      }else{
        this.closeDialog();
      }
    },
    closeDialog() {
      this.btnText = '上传';
      this.isLargeFile = false;
      this.$refs.upload.clearFiles();
      this.dialogVisible = false;
      this.queueClose();
      this.file = null;
    },
    beforeClose(done){
      this.queueClose();
      done();
    },
    //queue stop
    queueClose(){
      if(this.queue){
        try{
          this.queue.stop();
        }catch(e){
          console.error(e)
        }
        this.queue = null;
      }
    }
  },
};
</script>


<style scoped lang="scss">
.downloadFileTemplate {
  text-decoration: underline;
  color: #1890ff;
}

</style>
