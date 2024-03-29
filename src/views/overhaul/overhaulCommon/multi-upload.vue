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
      :disabled="disabled"
      :accept="accept"
    >
      <template #trigger>
        <el-button type="primary" :disabled="disabled"
          ><el-icon class="el-icon--left"><UploadFilled /></el-icon
          >{{ btnText }}</el-button
        >
      </template>
      <template #tip>
        <div class="tip-content">
          <div v-if="!simple" class="el-upload__tip">
            文件大小不能超过{{ fileMaxSize }}M
          </div>
          <div v-if="!simple && limit > 1" class="el-upload__tip canMulti">
            / 可最多上传{{ limit }}个文件
          </div>
        </div>
        <div class="el-upload__tip status-danger" v-if="isLargeFile">
          文件较大，上传需要时间，请耐心等待...
        </div>
      </template>
    </el-upload>
    <!-- 通用的filelist -->
    <file-list
      v-if="fileListMode"
      :fileList="fileList"
      :isCanDelete="isCanDelete"
      @onDelete="handleDelete"
    ></file-list>
    <!-- 工作内容的filelist -->
    <work-step-content-file-list
      v-else
      :aiAppendixDTOList="aiAppendixDTOList"
      :unusualFlagList="unusualFlagList"
      :isCanDelete="isCanDelete"
      @onDelete="handleDelete"
      @aiAppendixDTOListChange="
        (val, index) => {
          $emit('aiAppendixDTOListChange', val, index);
        }
      "
    ></work-step-content-file-list>
    <el-progress v-if="!simple && progressFlag" :percentage="percentage" />
  </div>
</template>

<script>
import { ref, nextTick, computed, watchEffect } from "vue";
import FileList from "@/views/overhaul/overhaulCommon/fileList.vue";
import WorkStepContentFileList from "@/views/overhaul/overhaulCommon/workStepContent/fileList.vue";
import { completeMultipart, initMultipart, upload } from "@/api/file";
import { getFileType } from "@/utils";
import Constants from "@/utils/constants";
import { ElMessageBox, useFormItem, ElMessage } from "element-plus";
import { addFilePrev } from "@/utils/index";
import { genFileId } from "element-plus";
import constants from "@/utils/constants";
import Queue from "promise-queue-plus";
import Axios from "axios";

export default {
  name: "multiUpload",
  props: {
    //是否开启异常信息标识 通过url来进行判断
    unusualFlagList: {
      type: Array,
      default() {
        return [];
      },
    },
    //ai识别信息 仅工步使用
    aiAppendixDTOList: {
      type: Array,
      default() {
        return [];
      },
    },
    //展示的filelist模式
    fileListMode: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    limit: {
      type: Number,
      default: 1,
    },
    accept: {
      type: String,
      default: ".doc,.docx,.pdf,.xlsx,.xls,.jpg,.png,.jpeg",
    },
    simple: {
      type: Boolean,
      default: false,
    },
    btnText: {
      type: String,
      default: "选择文件",
    },
    isCanDelete: {
      type: Boolean,
      default: true,
    },
    //默认100M
    fileMaxSize: {
      type: Number,
      default: 100,
    },
    canDelete: {
      type: Boolean,
      default: true,
    },
    module: {
      type: String,
      default: "",
    },
    fileUrl: {
      type: String,
      default: "",
    },
    fileName: {
      type: String,
      default: "",
    },
    beforeUpload: {
      type: Function,
      default: null,
    },
  },
  components: {
    FileList,
    WorkStepContentFileList,
  },
  emits: ["update:modelValue", "uploadSuccess", "aiAppendixDTOListChange"],
  setup(props, { emit }) {
    const uploadRef = ref();
    const { formItem } = useFormItem();
    const percentage = ref(0);
    const partSize = 50 * 1024 * 1024;
    const btnText = ref("上传");
    let queue = null;
    const isLargeFile = ref(false);
    let largeFileSize = 50 * 1024 * 1024;
    const fileList = ref([]);

    watchEffect(() => {
      const fileUrls = props.fileUrl;
      const fileNames = props.fileName;
      let tmpFileList = [];
      if (constants.isNotEmpty(fileUrls)) {
        let fileUrlArr = fileUrls.split("|");
        let fileNameArr = fileNames.split("|");
        for (let i = 0; i < fileUrlArr.length; i++) {
          tmpFileList.push({
            fileUrl: fileUrlArr[i],
            fileName: fileNameArr[i],
          });
        }
      }
      fileList.value = tmpFileList;
    });

    const beforeUploadFun = (file) => {
      const fileFix = file.name.split(".").pop().toLowerCase();
      if (props.accept.indexOf(fileFix) === -1) {
        ElMessage.error(`上传格式不支持,仅支持${props.accept}`);
        return false;
      }
      if (fileList.value.length + 1 > props.limit) {
        ElMessage.error(`最多上传${props.limit}个附件 `);
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < props.fileMaxSize;
      if (!isLt2M) {
        ElMessage.error(
          "上传文件大小不能超过 " + parseInt(props.fileMaxSize) + "M!"
        );
      }
      if (props.beforeUpload) {
        return isLt2M && props.beforeUpload(file);
      } else {
        return isLt2M;
      }
    };

    const progressFlag = computed(() => {
      return percentage.value > 0 && percentage.value < 100;
    });

    const emitData = (uploadUrlObj) => {
      let filePathArr = [],
        fileNameArr = [];
      fileList.value.forEach((item) => {
        filePathArr.push(item.fileUrl);
        fileNameArr.push(item.fileName);
      });
      emit("update:modelValue", filePathArr.join("|"));
      emit(
        "uploadSuccess",
        fileNameArr.join("|"),
        fileList.value,
        uploadUrlObj
      );
    };

    const initUpload = async (file) => {
      let chunkSize = partSize,
        fileSize = file.size;
      if (fileSize >= largeFileSize) {
        isLargeFile.value = true;
      } else {
        isLargeFile.value = false;
      }
      const chunkCount = Math.ceil(fileSize / chunkSize);
      console.log(
        "文件大小：",
        file.size / 1024 / 1024 + "Mb",
        "分片数：",
        chunkCount
      );
      let params = {
        chunkSize: chunkCount,
        fileName: file.name,
      };
      const response = await initMultipart(params);
      const chunkUploadUrls = response.data.chunks;
      const failArr = [];
      let start = "",
        end = "";
      queue = Queue(5, {
        retry: 3, //Number of retries
        retryIsJump: false, //retry now?
        workReject: function (reason, queue) {
          failArr.push(reason);
        },
        queueEnd: (queue) => {
          //队列处理完成
          btnText.value = "上传";
          if (failArr.length > 0) {
            ElMessage.error("部分分片上次失败，请尝试重新上传文件");
          } else {
            composeFile(
              response.data.uploadId,
              file.name,
              chunkCount,
              fileSize,
              file.contentType,
              response.data.uploadName
            );
          }
        },
      });
      for (let item of chunkUploadUrls) {
        item.uploadFinish = false;
        //分片开始位置
        start = item.partNumber * chunkSize;
        //分片结束位置
        end = Math.min(fileSize, start + chunkSize);
        //取文件指定范围内的byte，从而得到分片数据
        let _chunkFile = file.slice(start, end);

        queue.push(() =>
          uploadSinglePart(item, _chunkFile).then((res) => {
            // 单片文件上传完成再更新上传进度
            updateProcess(chunkUploadUrls);
          })
        );
      }
      btnText.value = "上传中";
      queue.start();
    };
    //计算进度
    const updateProcess = (chunkUploadUrls) => {
      //对item分析，是否已上传成功
      let count = chunkUploadUrls.length;
      let finishCount = 0;
      chunkUploadUrls.forEach((item) => {
        if (item.uploadFinish) {
          finishCount++;
        }
      });
      percentage.value = Number(((finishCount / count) * 100).toFixed(2));
      if (percentage.value > 100) {
        percentage.value = 100;
      }
      console.log("per: " + percentage.value);
    };
    //上传分片
    const uploadSinglePart = async (item, _chunkFile) => {
      console.log("开始上传第" + item.partNumber + "个分片");
      await Axios.request({
        url: item.uploadUrl,
        method: "PUT",
        data: _chunkFile,
        headers: { "Content-Type": "application/octet-stream" },
      });
      //上传成功
      console.log("第" + item.partNumber + "个分片上传成功");
      item.uploadFinish = true;
      return Promise.resolve(item);
    };
    //文件上传
    const httpUpload = async (params) => {
      await initUpload(params.file);
    };
    //分片上传完成合并
    const composeFile = async (
      uploadId,
      fileName,
      chunkSize,
      fileSize,
      contentType,
      uploadName
    ) => {
      let data = {
        uploadId: uploadId,
        fileName: fileName,
        chunkSize: chunkSize,
        fileSize: fileSize,
        contentType: contentType,
        module: Constants.fileModule.portal_material,
        fileType: getFileType(fileName),
        uploadName,
      };
      const response = await completeMultipart(data);
      if (response.code === Constants.respCode.success) {
        console.log("合并文件完成", response);
        fileList.value.push({
          fileUrl: response.data.filePath,
          fileName: response.data.fileName,
        });
        emitData({
          type: "upload",
          url: {
            fileUrl: response.data.filePath,
            fileName: response.data.fileName,
          },
        });
        uploadRef.value?.clearFiles();
        nextTick(() => {
          formItem?.validate("");
        });
      }
    };

    const handleDelete = (item) => {
      ElMessageBox.confirm("确定删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then((response) => {
        let index = fileList.value.findIndex(
          (el) => el.fileUrl === item.fileUrl
        );
        let delurl;
        if (index >= 0) {
          delurl = fileList.value[index];
          fileList.value.splice(index, 1);
        }
        emitData({ type: "del", url: delurl });
        nextTick(() => {
          formItem?.validate("");
        });
      });
    };

    return {
      formItem,
      uploadRef,
      percentage,
      progressFlag,
      fileList,
      beforeUploadFun,
      handleDelete,
      httpUpload,
      emitData,
      isLargeFile,
    };
  },
};
</script>

<style scoped lang="scss">
.uploadclass {
  flex: 1;
}
.tip-content {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .canMulti {
    margin-left: 5px;
  }
}
</style>
