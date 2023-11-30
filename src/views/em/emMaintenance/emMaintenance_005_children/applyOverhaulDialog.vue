<template>
  <el-dialog v-draggable  appendToBody title="大修计划申请"  v-model="dialogVisible" modal>
    <el-form :model="model" class="element-list" ref="formRef" :rules="rules" label-width="120px">
      <div class="col-md-12">
        <el-form-item label="项目分类:">
          <el-radio-group v-model="model.proClass">
            <el-radio label="性能恢复">性能恢复</el-radio>
            <el-radio label="技术升级">技术升级</el-radio>
            <el-radio label="节能环保">节能环保</el-radio>
            <el-radio label="本质安全提升">本质安全提升</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="freezeReason" label="附件"  size="small">
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
            <el-button  size="small" type="primary">选取文件</el-button>
            <div   class="el-upload__tip">文件大小不能超过10M</div>
          </el-upload>
        </el-form-item>
      </div>
    </el-form>
    <div  >
      <el-button  size="small" @click="dialogVisible=false">取消</el-button>
      <el-button  size="small" type="primary" @click="handleSubmit">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import planWeekHttp from '@/api/plan/planWeek'
  import file from '@/api/file/file'
  import { getToken } from '@/utils/auth'
  import {overhaulOa}   from '@/api/em/overHaul'

  export default {
    name: 'applyOverhaulDialog',
    data() {
      return {
        dialogVisible: false,
        action: '',
        initModel: {
          ids:[],
          files: [],
          proClass:''
        },
        uploadMoreData: {
          appid: 'mesupload'
        },
        uploadHeader:{
          token: getToken()
        },
        model: {},
        selectData:[],
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
        this.selectData = selectedData
        this.model = {
          ...this.initModel,
        }
        const ids = []
        this.selectData.forEach(item => {
          ids.push(item.id)
        })
        this.model.ids = ids
        console.log(this.model)
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
            ids: this.model.ids,
            proClass: this.model.proClass
          }
          overhaulOa(formData).then(response=>{
            if(response.err_code === this.$constants.status.success){
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
