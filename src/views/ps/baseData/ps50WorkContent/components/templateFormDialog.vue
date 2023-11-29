<template>
  <el-dialog v-dialogDrag  appendToBody :title="model.id? '编辑': '新增'" width="600px" v-model="dialogVisible" modal>
    <el-form :model="model" ref="form" :rules="rules" label-width="140px">
      <el-row>
        <el-col :span="24">
          <el-form-item prop="craftsDeCode" label="子工艺模板行编码：" size="mini">
            <el-input v-model="model.craftsDeCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item prop="craftsDeName" label="子工艺模板行名称：" size="mini">
            <el-input v-model="model.craftsDeName"  ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item prop="standardWorkingHour" label="标准工时：" size="mini">
            <el-input v-model="model.standardWorkingHour"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item prop="equipmentTypeName" label="设备名称：" size="mini">
            <el-input v-model="model.equipmentTypeName"></el-input>
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
import {insertCraftsDe} from '@/api/plan'
import Constants from "@/utils/constants";


export default {
  name: 'addOrUpdateDialog',
  data() {
    return {
      initModel: {
        craftsDeCode: '',
        craftsDeName: '',
        equipmentTypeName:'',//设备名称
        standardWorkingHour: '', //标准工时

      },
      model: {},
      dialogVisible: false,
      rules: {
        craftsDeCode: [{
          required: true, message: '子工艺模板行编码不能为空', trigger: 'blur'
        }],
        craftsDeName: [{
          required: true, message: '子工艺模板行名称不能为空', trigger: 'blur'
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
