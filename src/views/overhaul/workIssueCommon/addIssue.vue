<template>
  <el-dialog
    draggable
    title="添加问题"
    :model-value="true"
    :destroy-on-close="true"
    @close="handleClose"
  >
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="form"
      label-position="right"
      label-width="100px"
    >
      <el-row type="flex" align="middle" justify="space-between">
        <el-col :span="12">
          <el-form-item label="问题类别" required>
            <el-select
              v-model="form.issue"
              class="filter-item"
              placeholder="请选择"
              @change="issueChange"
            >
              <el-option
                v-for="item in issueOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="异常项" required>
            <el-select
              v-model="form.exceptionItem"
              class="filter-item"
              placeholder="请选择"
              @change="exceptionChange"
            >
              <el-option
                v-for="item in exceptionItemOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" justify="space-between">
        <el-col :span="12">
          <el-form-item label="通知人" required>
            <el-select
              v-model="form.notifier"
              class="filter-item"
              placeholder="请选择"
            >
              <el-option
                v-for="item in notifierOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="问题描述" prop="issueDescription" >
            <el-input
              v-model="form.issueDescription"
              type="textarea"
              :maxlength="500"
              :rows="2"
              placeholder="请输入问题描述"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" justify="start">
        <el-col :span="12">
          <el-form-item label="问题图片上传">
            <multi-upload-vue
              :limit="3"
              :fileUrl="imgFileUrl"
              :fileName="imgFileName"
              :fileMaxSize="MAX_IMG_SIZE"
              btnText="选择图片"
              accept="image/*"
              @uploadSuccess="uploadSuccess"
            ></multi-upload-vue>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="问题视频上传">
            <multi-upload-vue
              :limit="1"
              :fileUrl="videoFileUrl"
              :fileName="videoFileName"
              btnText="选择视频"
              :fileMaxSize="MAX_VIDEO_SZIE"
              accept="video/*"
              @uploadSuccess="videoUploadSuccess"
            ></multi-upload-vue>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click.stop="handleClose"> 取消 </el-button>
        <el-button type="primary" @click="handleOk"> 保存 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { safeLimit } from "@/common/js/validator";
import multiUploadVue from "@/views/overhaul/overhaulCommon/multi-upload.vue";
import { MAX_IMG_SIZE, MAX_VIDEO_SZIE } from "@/views/overhaul/constants.js";
import { addIssueInfo } from "@/api/overhaul/workOrderApi.js";
import { getAndonType, getAndonIssue } from "@/api/overhaul/andonIssueApi.js";
export default {
  components: {
    multiUploadVue,
  },
  props: {
    sceneType: {
      type: String,
      default: "",
    },
    //操作行
    operateRow: {
      type: Object,
      default() {
        return null;
      },
    },
    workCode: {
      type: String,
      default: "",
    },
    modalName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      MAX_IMG_SIZE,
      MAX_VIDEO_SZIE,
      form: {
        issue: undefined,
        exceptionItem: undefined,
        notifier: undefined,
        issueDescription: "",
        imgFileUrl: "",
        imgFileName: "",
        videoFileUrl: "",
        videoFileName: "",
      },
      imgFileUrl: "",
      imgFileName: "",
      videoFileUrl: "",
      videoFileName: "",
      rules: {
        issueDescription: safeLimit("", false),
      },
      issueOptions: [],
      exceptionItemOptions: [],
      notifierOptions: [],
      allExceprion: [],
    };
  },
  mounted() {
    this.getAndonTypeList();
  },
  methods: {
    //选择类别发生异常时
    issueChange() {
      this.form.exceptionItem = undefined;
      this.form.notifier = undefined;
      this.exceptionItemOptions = [];
      this.notifierOptions = [];
      this.getExceptionItemOptions();
    },
    //异常项查询时
    exceptionChange() {
      this.form.notifier = undefined;
      this.notifierOptions = [];
      let target = this.allExceprion.find((item) => {
        return item.id === this.form.exceptionItem;
      });
      if (target) {
        this.notifierOptions = target.responders.map((item) => ({
          value: item.id,
          label: item.name,
        }));
      }
    },
    getAndonTypeList() {
      getAndonType().then((res) => {
        this.issueOptions = res.data.value.map((item) => ({
          label: item.cateName,
          value: item.id,
        }));
      });
    },
    getExceptionItemOptions() {
      getAndonIssue({ cateId: this.form.issue }).then((res) => {
        this.allExceprion = res.data.value;
        this.exceptionItemOptions = res.data.value.map((item) => ({
          label: item.abnormalName,
          value: item.id,
        }));
      });
    },
    //工序保存
    handleOk() {
      const problemTypeObj = this.issueOptions.find(
        (item) => item.value === this.form.issue
      )||{};
      const problemItemObj = this.exceptionItemOptions.find(
        (item) => item.value === this.form.exceptionItem
      )||{};
      const notifierIdObj = this.notifierOptions.find(
        (item) => item.value === this.form.notifier
      )||{};
      let params = {
        workCode: this.workCode,
        workProcedureCode: this.operateRow.workProcedureCode.split("_")[1],
        workProcedureType: this.operateRow.workProcedureType,
        workScene:this.sceneType,
        cateName: problemTypeObj.label,
        cateId: problemTypeObj.value,
        abnormalName: problemItemObj.label,
        abnormalId:problemItemObj.value,
        problemDesc: this.form.issueDescription,
        reporterId: localStorage.getItem("userId"),
        notifierId: notifierIdObj.value,
        notifierName:notifierIdObj.label,
        pictureUrl: this.form.imgFileUrl,
        videoUrl: this.form.videoFileUrl,
      };
      addIssueInfo(params).then((res) => {
        if (res.code !== "0") {
          this.$message.error(res.errMsg);
        } else {
           this.$message.success("添加成功！")
          this.handleClose();
        }
      });
    },
    videoUploadSuccess(fileName, fileList) {
      this.form.videoFileName = fileName;
      this.form.videoFileUrl = fileList
        .map((item) => item.fileUrl || [])
        .join("|");
    },
    uploadSuccess(fileName, fileList) {
      this.form.imgFileName = fileName;
      this.form.imgFileUrl = fileList
        .map((item) => item.fileUrl || [])
        .join("|");
    },
    handleClose(isSearch = false) {
      this.$emit("closeModal", this.modalName, isSearch);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
