<template>
  <el-dialog v-dialogDrag  appendToBody :title="model.id? '编辑': '新增'" width="600px" v-model="dialogVisible" modal>
    <el-form :model="model" ref="form" :rules="rules" label-width="140px">
      <el-row>
        <el-col :span="12">
          <el-form-item prop="code" label="参数名称：" size="mini">
            <el-input v-model="model.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="name" label="参数编码：" size="mini">
            <el-input v-model="model.code"  ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item prop="value" label="参数值：" size="mini">
            <el-input v-model="model.value"  ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item prop="remark" label="备注：" size="mini">
            <el-input v-model="model.remark " type="textarea" rows="5"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button size="mini" @click="dialogVisible=false">取消</el-button>
      <el-button size="mini" type="primary" @click="handleSubmit">保存</el-button>
    </div>

  </el-dialog>
</template>

<script>
import {insert} from '@/api/sys/element'
import Constants from "@/utils/constants";


export default {
  name: 'addOrUpdateDialog',
  data() {
    return {
      initModel: {
        code: '',
        name: '',
        value:'',
      },
      model: {},
      dialogVisible: false,
      rules: {
        code: [{
          required: true, message: '参数编码不能为空', trigger: 'blur'
        }],
        name: [{
          required: true, message: '参数名称不能为空', trigger: 'blur'
        }],
        value: [{
          required: true, message: '参数值不能为空', trigger: 'blur'
        }]
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
       insert(this.model).then(resoponse=>{
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
