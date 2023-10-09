<template>
  <div class="uploadclass">
    <el-upload
        class="bodyd"
        ref="uploadRef"
        action="#"
        :limit="limit"
        :before-upload="beforeUploadFun"
        :http-request="httpUpload"
        :show-file-list="false"
    >
      <template #trigger>
        <el-button type="primary">{{btnText}}</el-button>
      </template>
      <template #tip>
        <div class="tip-content">
          <div v-if="!simple" class="el-upload__tip"> 文件大小不能超过{{ fileMaxSize }}G</div>
          <div v-if="!simple && limit>1" class="el-upload__tip canMulti"> / 可最多上传{{ limit }}个文件</div>
        </div>
        <div class="el-upload__tip status-danger" v-if="isLargeFile">文件较大，上传需要时间，请耐心等待...</div>
      </template>
    </el-upload>
    <div class="uploadOperator">
      <div class="uploadOperatorItem" v-for="item in fileList">
        <xui-download v-if="!simple && fileName" :href="item.fileUrl" :fileName="item.fileName"></xui-download>
        <el-button v-if="!simple && canDelete" class="deleteBtn" @click="handleDelete(item)" type="danger">删除</el-button>
      </div>
    </div>
    <el-progress v-if="!simple && progressFlag" :percentage="percentage"/>
  </div>
</template>

<script>
import {ref, nextTick, computed, watchEffect} from 'vue'
import {completeMultipart, initMultipart, upload} from '@/api/file'
import {getFileType} from "@/utils";
import Constants from '@/utils/constants'
import {ElMessageBox, useFormItem} from "element-plus";
import {ElMessage} from 'element-plus';
import {addFilePrev} from '@/utils/index'
import { genFileId } from 'element-plus'
import constants from "@/utils/constants";
import Queue from "promise-queue-plus";
import Axios from "axios";

export default {
  name: "multiUpload",
  props: {
    limit: {
      type: Number,
      default: 1
    },
    simple: {
      type: Boolean,
      default: false
    },
    btnText: {
      type: String,
      default: '选择文件'
    },
    //默认4G
    fileMaxSize: {
      type: Number,
      default: 4
    },
    canDelete: {
      type: Boolean,
      default: true
    },
    module: {
      type: String,
      default: ''
    },
    fileUrl: {
      type: String,
      default : ''
    },
    fileName: {
      type: String,
      default : ''
    },
    beforeUpload: {
      type: Function,
      default: null
    }
  },
  emits: ['update:modelValue', 'uploadSuccess'],
  setup(props, {emit}) {
    const uploadRef = ref();
    const {formItem} = useFormItem();
    const percentage = ref(0);
    const partSize = 5242880 * 4;
    const btnText = ref("上传");
    let queue = null;
    const isLargeFile = ref(false);
    let largeFileSize =  1024 * 1024 * 1024;
    const fileList = ref([]);

    watchEffect(() => {
      const fileUrls = props.fileUrl;
      const fileNames = props.fileName;
      let tmpFileList = [];
      if(constants.isNotEmpty(fileUrls)){
        let fileUrlArr = fileUrls.split('|');
        let fileNameArr = fileNames.split('|');
        for(let i=0; i< fileUrlArr.length; i++){
          tmpFileList.push({
            fileUrl: fileUrlArr[i],
            fileName: fileNameArr[i],
          })
        }
      }
      fileList.value = tmpFileList;
    })

    const beforeUploadFun = (file) => {
      const isLt2M = file.size / 1024 / 1024 / 1024 < props.fileMaxSize;
      if (!isLt2M) {
        ElMessage.error("上传文件大小不能超过 " + parseInt(props.fileMaxSize ) + "G!");
      }
      if (props.beforeUpload) {
        return isLt2M && props.beforeUpload(file);
      } else {
        return isLt2M;
      }
    }

    const progressFlag = computed(() => {
      return percentage.value > 0 && percentage.value < 100;
    });

    const emitData = ()=>{
      let filePathArr = [], fileNameArr = [];
      fileList.value.forEach(item=>{
        filePathArr.push(item.fileUrl);
        fileNameArr.push(item.fileName);
      })
      emit('update:modelValue', filePathArr.join('|'));
      emit('uploadSuccess', fileNameArr.join('|'), fileList.value);
    }

    const initUpload = async (file) =>{
      let chunkSize = partSize, fileSize = file.size;
      if(fileSize >= largeFileSize){
        isLargeFile.value = true;
      }else{
        isLargeFile.value = false;
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
      queue = Queue(5, {
        "retry": 3,               //Number of retries
        "retryIsJump": false,     //retry now?
        "workReject": function(reason,queue){
          failArr.push(reason)
        },
        "queueEnd": queue=>{
          //队列处理完成
          btnText.value = '上传';
          if(failArr.length > 0){
            $message.error('部分分片上次失败，请尝试重新上传文件')
          }else{
            composeFile(response.data.uploadId, file.name, chunkCount, fileSize, file.contentType, response.data.uploadName)
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

        queue.push(() => uploadSinglePart(item, _chunkFile).then(res => {
          // 单片文件上传完成再更新上传进度
          updateProcess(chunkUploadUrls);
        }))
      }
      btnText.value = '上传中';
      queue.start();
    }
    //计算进度
    const updateProcess = (chunkUploadUrls)=>{
      //对item分析，是否已上传成功
      let count = chunkUploadUrls.length;
      let finishCount = 0;
      chunkUploadUrls.forEach(item=>{
        if(item.uploadFinish){
          finishCount++;
        }
      })
      percentage.value = Number((finishCount / count * 100).toFixed(2))
      if(percentage>100){
        percentage.value = 100;
      }
      console.log('per: ' + percentage.value);
    }
    //上传分片
    const uploadSinglePart = async (item, _chunkFile)=>{
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
    }
    //文件上传
    const httpUpload = async(params)=> {
      await initUpload(params.file);
    }
    //分片上传完成合并
    const composeFile = async (uploadId, fileName, chunkSize, fileSize, contentType, uploadName) =>{
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
        emitData();
        uploadRef.value?.clearFiles()
        nextTick(() => {
          formItem?.validate('');
        })
      }
    }

    const handleDelete = (item) => {
      ElMessageBox.confirm(
          '确定删除？',
          '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(response=>{
        let index = fileList.value.indexOf(item);
        if(index >= 0){
          fileList.value.splice(index , 1);
        }
        emitData();
        nextTick(() => {
          formItem?.validate('');
        })
      })
    }

    return {
      formItem,
      uploadRef,
      percentage,
      progressFlag,
      fileList,
      beforeUploadFun,
      handleDelete,
      httpUpload,
      emitData
    }
  }
}
</script>

<style scoped lang="scss">
.uploadclass {
  flex: 1;
}

.uploadOperatorItem{
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .deleteBtn{
    margin-right: 10px;
  }
}

.deleteBtn{
  margin-left: 4px;
  margin-top: -2px;
}

.tip-content{
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .canMulti{
    margin-left: 5px;
  }
}

</style>
