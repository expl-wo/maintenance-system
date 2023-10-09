<template>
  <div class="xui-attach-list">
    <xui-upload class="mb-5" v-if="isEdit" simple btnText="上传附件" @uploadSuccess="handleSuccess">新增</xui-upload>
    <el-table highlight-current-row
        ref="multipleTable"
        :data="dataList"
        border stripe>
      <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
      <el-table-column label="附件名称" prop="fileName" min-width="200" align="center">
      </el-table-column>
      <el-table-column prop="stage" width="300" label="操作" align="center">
        <template #default="{row}">
          <el-button type="primary" icon="Edit" @click="handleDownload(row)">
            下载
          </el-button>
          <el-button v-if="isEdit" icon="Delete" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import {
  defineComponent,
  computed,
  onMounted,
  ref,
  reactive,
  defineEmits,
  toRef,
  watch,
  nextTick,
  watchEffect
} from "vue";
import constants from "@/utils/constants";
import {downloadClick, addFilePrev} from "@/utils";

const dataList = ref([]);

const props = defineProps({
  attachFile: String,
  isEdit: Boolean
})

const dealFileList = () => {
  if (constants.isNotEmpty(props.attachFile)) {
    try {
      dataList.value = JSON.parse(props.attachFile);
    } catch (e) {
      console.error(e);
    }
  } else {
    dataList.value = [];
  }
}

const canPreview = (row) => {
  const fileType = row.fileType;
  return fileType === constants.fileType.video || fileType === constants.fileType.photo;
}

//监听
watchEffect(dealFileList);

const handleSuccess = (fileName, resData) => {
  dataList.value.push({
    fileUrl: resData.filePath,
    fileName
  })
}

const handleDownload = row => {
  downloadClick(addFilePrev(row.fileUrl), row.fileName);
}

const handleDelete = row => {
  const index = dataList.value.indexOf(row);
  if (index >= 0) {
    dataList.value.splice(index, 1);
  }
}

const getAttachList = () => {
  if (dataList.value && dataList.value.length > 0) {
    return JSON.stringify(dataList.value);
  } else {
    return ''
  }
}

defineExpose({
  getAttachList
})

</script>

<style scoped>

</style>
