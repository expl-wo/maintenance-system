<template>
  <el-dialog draggable appendToBody title="大修计划审批"  v-model="dialogVisible" modal>
    <el-form :model="model" class="element-list" ref="formRef"
             :rules="rules" label-width="120px"
    >
      <div class="col-md-12">
        <el-form-item prop="checkBasis" label="验收依据"  size="small">
          <el-input v-model="model.checkBasis" type="textarea" :rows="2"></el-input>
        </el-form-item>
        <el-form-item prop="checkRecord" label="验收记录"  size="small">
          <el-input v-model="model.checkRecord" type="textarea" :rows="4"></el-input>
        </el-form-item>
      </div>
      <div class="col-md-12">
        <el-form-item  label="大修任务书"  size="small">
        <el-tooltip
          class="item"
          effect="dark"
          content="请选择word格式文档"
          placement="top">
          <el-button @click="upload('assignment')" icon="el-icon-upload" type="primary"  size="small"></el-button>
        </el-tooltip>
        <input  ref="fileA" type="file" style="display:none" accept=".doc, .docx" @change="updateAssignment('assignment',$event )">
        <el-button-group>
          <el-button  size="small" title="" type="primary" icon="el-icon-folder"
                     @click="viewFile('assignment' )">
            查看任务书
          </el-button>
        </el-button-group>
        </el-form-item>
      </div>
      <div class="col-md-12">
        <el-form-item  label="大修改造验收"  size="small">
        <el-tooltip
          class="item"
          effect="dark"
          content="请选择word格式文档"
          placement="top">
          <el-button @click="upload('reform')" icon="el-icon-upload" type="primary"  size="small"></el-button>
        </el-tooltip>
        <input ref="fileR" type="file" style="display:none" accept=".doc, .docx" @change="updateAssignment('reform',$event)">
        <el-button-group>
          <el-button  size="small" title="" type="primary" icon="el-icon-folder"
                     @click="viewFile('reform')">
            查看改造验收
          </el-button>
        </el-button-group>
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
  import { getOverHaulTopList, getOverHaulTopUpdate, deleteOverHaulTop, getUploadFileUpdate,overhaulCheckOa } from '@/api/em/overHaul'
  import { getSingleUpload } from '@/api/endpoint'
  import { $rooturl } from '@/utils/common.js'

  export default {
    name: 'approvalOverhaulDialog',
    data() {
      return {
        dialogVisible: false,
        initModel: {
          id:'',
          files: [],
          checkRecord:'',
          checkBasis:'',
          isSecondCheck:''
        },
        selectModel:{
          id:'',
          assignmentPath:'',
          reformPath:''
        },
        model: {},
        rules: {
          // newDeliveryDate: [{
          //   required: true, message: '申请时间不能为空'
          // }],
        },
        rooturl:''
      }
    },
    // created(){
    //   this.action = '/api' + file.url.uploadSingle
    // },
    mounted() {
      $rooturl().then(response =>{
        this.rooturl = response.data
      })
    },
    methods: {
      init(selectedData,row) {
        this.model = {
          ...this.initModel,
          id: selectedData.id
        }
        if (row === 'oaApproval') {
          this.model.isSecondCheck ='0'
        }else if (row === 'secondApproval'){
          this.model.isSecondCheck ='1'
        }
        console.log(this.model)
        this.selectModel = selectedData
        this.dialogVisible = true;
        this.$nextTick(()=>{
          this.$refs.formRef && this.$refs.formRef.clearValidate();
        })
      },
      handleSubmit() {
        this.$refs.formRef.validate(valid => {
          if (!valid) {
            return
          }
          const files = []
          if (this.selectModel.assignmentPath!=null){
            files.push(this.selectModel.assignmentPath)
          }
          if (this.selectModel.reformPath!=null) {
            files.push(this.selectModel.reformPath)
          }
          let formData = {
            fileIds: files,
            id: this.model.id,
            checkBasis:this.model.checkBasis,
            checkRecord:this.model.checkRecord,
            isSecondCheck: parseInt(this.model.isSecondCheck)
          }
          overhaulCheckOa(formData).then(response=>{
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
      viewFile(type){
        if (type==='assignment'){
          if (this.selectModel.assignmentPath ==null){
            this.$message.warning('未上传文件')
          }else {
            window.location.href = this.rooturl + this.selectModel.assignmentPath
          }
        }else if (type==='reform'){
          if (this.selectModel.reformPath==null){
            this.$message.warning('未上传文件')
          }else {
            window.location.href = this.rooturl + this.selectModel.reformPath
          }
        }
      },
      updateAssignment(type,e) {
        const file = e.target.files[0]
        const param = new FormData() // 创建form对象
        param.append('file', file) // 通过append向form对象添加数据
        param.append('appid', 'mesupload') // 添加form表单中其他数据
        const name = file.name + ''
        // 防止用户手动更改选择类型
        if (name.indexOf('.doc') === -1 && name.indexOf('.docx') === -1) {
          this.$message.warning('请选择正确的文件类型')
          return
        }
        // 上传word
        getSingleUpload(param).then(response => {
          // word更新
          console.log(type)
          if (type==='assignment'){
            this.selectModel.assignmentPath=response.path
            getUploadFileUpdate({ id: this.selectModel.id, assignmentPath: response.path}).then(responseUp => {
              this.$message({ message: '更新成功', type: 'success' })
            })
          }else if (type==='reform'){
            this.selectModel.reformPath=response.path
            getUploadFileUpdate({ id: this.selectModel.id, reformPath: response.path}).then(responseUp => {
              this.$message({ message: '更新成功', type: 'success' })
            })
          }
        })
      },
      upload(type) {
        if (type==='assignment'){
          this.$refs.fileA.click()
        }else if (type==='reform'){
          this.$refs.fileR.click()
        }
      },
    }
  }
</script>

<style scoped>

</style>
