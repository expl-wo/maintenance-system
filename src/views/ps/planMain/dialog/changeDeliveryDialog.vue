<template>
  <el-dialog v-dialogDrag  appendToBody title="厂内完工时间修改申请" v-model="dialogVisible" modal>
    <el-form :model="model" class="element-list" ref="formRef"
             :rules="rules" label-width="120px"
    >
      <div class="col-md-12">
        <el-form-item prop="newDeliveryDate" label="申请完工时间" required>
          <el-date-picker
            v-model="model.newDeliveryDate"
            style="width: 100%;"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="col-md-12">
        <el-form-item prop="changeReason" label="申请原因">
          <el-input v-model="model.changeReason" type="textarea" :rows="4"></el-input>
        </el-form-item>
      </div>
      <div class="col-md-12">
        <el-form-item prop="freezeReason" label="附件">
          <el-upload
            class="upload-demo"
            ref="uploadRef"
            multiple
            :headers="uploadHeader"
            :action="action"
            :data="uploadMoreData"
            :before-upload="handleBeforeUpload"
            :on-success="handleUploadSuccess"
            :file-list="model.files">
            <el-button v-slot="trigger" size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">文件大小不能超过10M</div>
          </el-upload>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
      <el-button @click="dialogVisible=false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </div>
    </template>
  </el-dialog>
</template>

<script>
import moment from 'moment'
import planWeekHttp from '@/api/plan/planWeek'
import file from '@/api/file/file'
import { getToken } from '@/utils/auth'

export default {
  name: 'changeDeliveryDialog',
  data() {
    return {
      dialogVisible: false,
      action: '',
      initModel: {
        proPlanId:'',
        newDeliveryDate: '',
        changeReason: '',
        files: [],
      },
      uploadMoreData: {
        appid: 'mesupload'
      },
      uploadHeader:{
        token: getToken()
      },
      model: {},
      rules: {
        newDeliveryDate: [{
          required: true, message: '申请时间不能为空'
        }],
      },
    }
  },
  created(){
    this.action = '/api' + file.url.uploadSingle
  },
  methods: {
    init(selectedData) {
      this.model = {
        ...this.initModel,
        proPlanId: selectedData.id
      }
      this.dialogVisible = true;
      this.$nextTick(()=>{
        this.$refs.formRef && this.$refs.formRef.clearValidate();
      })
    },
    //文件上传校验处理
    handleBeforeUpload(file){
      let isLegal = true;
      const isLt2M = file.size / 1024 / 1024;
      if(isLt2M > 10){
        isLegal = false;
        this.$message({
          message:'上传的文件大小不能超过10M',
          type: 'warning'
        });
        return false;
      }else{
        return true;
      }
    },
    //文件上传成功处理
    handleUploadSuccess(response, file){
      file._id = response.id
    },
    handleSubmit() {
      this.$refs.formRef.validate(valid => {
        if (!valid) {
          return
        }
        let {uploadFiles} = this.$refs.uploadRef;
        let filesId = uploadFiles.map(item=>{
          return item._id;
        })
        let formData = {
          fileIds: filesId,
          proPlanId: this.model.proPlanId,
          newDeliveryDate: moment(this.model.newDeliveryDate).format('YYYY-MM-DD'),
          changeReason: this.model.changeReason
        }
        //修改厂内完工日期
        planWeekHttp.changeDelivery(formData).then(response=>{
          if(response.err_code === this.$constants.statusCode.success){
            this.$message.success('数据提交成功');
            this.$emit('refresh', {});
            this.dialogVisible = false;
          }else{
            this.$message.error(response.err_msg);
          }
        })
      })
    },
  }
}
</script>

<style scoped>

</style>
