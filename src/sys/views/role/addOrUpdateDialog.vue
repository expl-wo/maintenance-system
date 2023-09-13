<template>
  <el-dialog draggable :close-on-click-modal="false" :title="model.id?'修改': '新增'" width="800" 
  v-if="dialogFormVisible" v-model="dialogFormVisible" class="roleDialog">
    <el-form ref="formRef" label-width="160px" :rules="rules" :model="model">
      <el-form-item prop="code" label="角色名称">
        <el-input v-model="model.rName"></el-input>
      </el-form-item>
      <el-form-item prop="name" label="角色备注">
        <el-input v-model="model.rIntro"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveData">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import Constants from '@/_public/utils/constants'
import {insertRoleInfo} from "@/sys/api/role";

export default {
  name: "addOrUpdateDialog",
  data(){
    return {

      dialogFormVisible: false,
      initModel: {
        
      },
      model: {},
      departmentTree: [],
    }
  },
  methods: {
    init(selectData){
		this.initModel = {
		id: '',
		rName: '', //角色名称
		rIntro: '', //角色介绍
    }
      if (selectData !==null){
        this.initModel = selectData
      }
      this.model = {
        ...this.initModel
      }
      this.dialogFormVisible = true;
      this.$nextTick(()=>{
        this.$refs.formRef.clearValidate();
      })
    },
    saveData(){
      this.$refs.formRef.validate(valid=>{
        if(!valid){
          return;
        }
        insertRoleInfo(this.model).then(response=>{
          if(response.code == Constants.respCode.success){
            this.$message.success('保存/修改成功');
            this.dialogFormVisible = false;
            this.$emit('refresh', {});
          }
          else{
            this.$message.error(response.msg);
          }
        })
      })
    },
  }
}
</script>

<style scoped>

</style>
