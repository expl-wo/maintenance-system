<template>
  <el-dialog draggable  appendToBody :title="model.id? '编辑': '新增'" width="600px" v-model="dialogVisible" modal>
    <el-form :model="model" ref="form" :rules="rules" label-width="140px">
      <el-row>
        <el-col :span="24">
          <el-form-item prop="equipmentTypeName" label="设备类型名称：" >
            <el-input v-model="model.equipmentTypeName"  ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div  >
      <el-button  @click="dialogVisible=false">取消</el-button>
      <el-button  type="primary" @click="handleSubmit">保存</el-button>
    </div>

  </el-dialog>
</template>

<script>
import Constants from "@/utils/constants";
import {saveEquipmentType} from "@/api/eqpLedger";


export default {
  name: 'equipmentAddOrUpdateDialog',
  data() {
    return {
      initModel: {
        equipmentTypeName:''
      },
      model: {},
      dialogVisible: false,
      rules: {
        equipmentTypeName: [{
          required: true, message: '设备类型名称不能为空', trigger: 'blur'
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
       saveEquipmentType(this.model).then(resoponse=>{
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
