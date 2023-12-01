<template>
  <el-dialog draggable  appendToBody :title="model.id? '编辑': '新增'" width="300px" v-model="dialogVisible" modal>
    <el-form :model="model" ref="form" :rules="rules" label-width="140px">
      <el-row>
        <el-col :span="12">
          <el-form-item prop="operationName" label="操作项名称：" >
            <el-input v-model="model.operationName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="lowerLimit" label="上限：" >
            <el-input v-model="model.upperLimit"  ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="upperLimit" label="下限：" >
            <el-input v-model="model.lowerLimit"  ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="correctValue" label="正确值：" >
            <el-input v-model="model.correctValue " ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="maximumContentLength" label="内容最大长度：">
            <el-input v-model="model.maximumContentLength"  ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="dataUnit" label="数据单位：" >
            <el-input v-model="model.dataUnit " ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="requireImageFile" label="是否需要上传图片/文件：" >
            <el-input v-model="model.requireImageFile"  ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="isMultiline" label="是否多行：" >
            <el-input v-model="model.isMultiline " ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="standardWorkingHour" label="标准工时：" >
              <el-input v-model="model.standardWorkingHour"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="equipmentTypeName" label="设备名称：" >
              <el-input v-model="model.equipmentTypeName"  ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="24">
          <el-form-item prop="isRequired" label="是否必填：" size="small">
            <el-input v-model="model.isRequired"  ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <el-button  @click="dialogVisible=false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">保存</el-button>
    </div>

  </el-dialog>
</template>

<script>
import Constants from "@/utils/constants";
import {insertCraftsDe} from "@/api/plan";


export default {
  name: 'addOrUpdateDialog',
  data() {
    return {
      initModel: {
        operationName:'',
        lowerLimit:'',
        upperLimit:'',
        correctValue:'',
        dataUnit:'',
        maximumContentLength:'',
        requireImageFile:'',
        isMultiline:'',
        isRequired:'',
        standardWorkingHour: '', //标准工时
        equipmentTypeName:'',//设备名称
      },
      model: {},
      dialogVisible: false,
      rules: {
        operationName: [{
          required: true, message: '参数编码不能为空', trigger: 'blur'
        }],
        correctValue: [{
          required: true, message: '参数名称不能为空', trigger: 'blur'
        }],
        dataUnit: [{
          required: true, message: '参数值不能为空', trigger: 'blur'
        }],
        requireImageFile: [{
          required: true, message: '参数名称不能为空', trigger: 'blur'
        }],
        isMultiline: [{
          required: true, message: '参数名称不能为空', trigger: 'blur'
        }],
      }
    }
  },
  methods: {
    init(obj) {
      if (obj === null || obj === undefined) {
        //是新增
        this.model = {
          ...this.initModel
        }
      } else {
        this.model = {
          ...this.initModel,
          ...obj
        }
      }
      this.$refs.form && this.$refs.form.clearValidate();
      this.dialogVisible = true
    },
    handleSubmit(){
      this.$refs.form.validate(val=>{
        if(!val){
          return;
        }
        insertCraftsDe(this.model).then(resoponse=>{
          if(resoponse.err_code === Constants.statusCode.success){
            this.$message.success("数据保存成功");
            this.dialogVisible = false;
            this.$emit('refresh', {})
          }else{
            this.$message.error(resoponse.err_msg);
          }
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
