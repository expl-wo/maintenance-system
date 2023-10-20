<template>
  <el-dialog v-dialogDrag  appendToBody :title="model.id? '编辑': '新增'" width="800px" v-model="dialogVisible" modal>
    <el-form :model="model" ref="form" :rules="rules" label-width="140px">
      <el-row>
        <el-col :span="12">
          <el-form-item prop="dryingTankCode" label="炉号：" size="mini">
            <el-input v-model="model.dryingTankCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="serialNumber" label="序号：" size="mini">
            <el-input v-model="model.serialNumber"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="deviceId" label="设备：" size="mini">
           <el-input @click.native="handleSelectDevice" :title="model.deviceName" v-model="model.deviceName" readonly class="cursorPointer">
             <el-button slot="append" type="primary">选择</el-button>
           </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="classification" label="分类：" size="mini">
            <xui-dict-select style="width: 100%;" v-model="model.classification" item-code="dryingClassification"
            ></xui-dict-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="dryingMethod" label="干燥方式：" size="mini">
            <xui-dict-select style="width: 100%;" v-model="model.dryingMethod" item-code="dryingMethod"
            ></xui-dict-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="height" label="高(M)：" size="mini">
            <el-input v-model="model.height" type="number"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="flatcarLength" label="平车长(M)：" size="mini">
            <el-input v-model="model.flatcarLength" type="number"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="flatcarWidth" label="平车宽(M)：" size="mini">
            <el-input v-model="model.flatcarWidth" type="number"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="tankLength" label="罐体长(M)：" size="mini">
            <el-input v-model="model.tankLength" type="number"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="tankWidth" label="罐体宽(M)：" size="mini">
            <el-input v-model="model.tankWidth" type="number"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="testSite" label="试验场所：" size="mini">
            <el-input v-model="model.testSite"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button size="mini" @click="dialogVisible=false">取消</el-button>
      <el-button size="mini" type="primary" @click="handleSubmit">保存</el-button>
    </span>
    </template>
    <device-select-dialog ref="deviceSelectDialogRef" @select="emitSelectDevice"></device-select-dialog>
  </el-dialog>
</template>

<script>
import dryingManage from '@/api/plan/dryingManage'
import deviceSelectDialog from '@/views/ps/baseData/dryingManage/addOrUpdate/deviceSelectDialog.vue'
import Constants from "../../../../../utils/constants";

export default {
  name: 'addOrUpdateDialog',
  components: {
    deviceSelectDialog,
  },
  data() {
    return {
      initModel: {
        'id': '',
        'dryingTankCode': '',
        'classification': '',
        'dryingMethod': '',
        'flatcarLength': '',
        'flatcarWidth': '',
        'tankLength': '',
        'tankWidth': '',
        'height': '',
        'serialNumber': '',
        'workshopId': '',
        'teamId': '',
        'gasphaseCost': '',
        'traditionalCost': '',
        'testSite': '',
        'deviceId': '',
        deviceName: '',
        workshopName: '',
        teamName: ''
      },
      model: {},
      dialogVisible: false,
      rules: {
        dryingTankCode: [{
          required: true, message: '炉号不能为空', trigger: 'blur'
        }],
        classification: [{
          required: true, message: '分类不能为空', trigger: 'change'
        }],
        dryingMethod: [{
          required: true, message: '干燥方式不能为空', trigger: 'change'
        }],
        flatcarLength: [{
          required: true, message: '平车长不能为空', trigger: 'blur'
        }],
        flatcarWidth: [{
          required: true, message: '平车宽不能为空', trigger: 'blur'
        }],
        tankLength: [{
          required: true, message: '罐体长不能为空', trigger: 'blur'
        }],
        tankWidth: [{
          required: true, message: '罐体宽不能为空', trigger: 'blur'
        }],
        height: [{
          required: true, message: '高不能为空', trigger: 'blur'
        }],
        serialNumber: [{
          required: true, message: '序号不能为空', trigger: 'blur'
        }],
        workshopId: [{
          required: true, message: '所在车间不能为空', trigger: 'change'
        }],
        teamId: [{
          required: true, message: '干燥班组不能为空', trigger: 'change'
        }],
        deviceId: [{
          required: true, message: '设备不能为空', trigger: 'change'
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
          deviceName: obj.equipmentName,
          ...obj
        }
      }
      this.$nextTick(()=>{
        this.$refs.form && this.$refs.form.clearValidate();
        this.dialogVisible = true
      })
    },
    handleSubmit(){
      this.$refs.form.validate(val=>{
        if(!val){
          return;
        }
        dryingManage.insertDryingTank(this.model).then(resoponse=>{
          if(resoponse.err_code === Constants.respCode.success){
            this.$message.success("数据保存成功");
            this.dialogVisible = false;
            this.$emit('refresh', {})
          }else{
            this.$message.error(resoponse.err_msg);
          }
        })
      })
    },
    handleSelectDevice(){
      this.$refs.deviceSelectDialogRef.init();
    },
    emitSelectDevice(rowData){
      this.model.deviceId = rowData.id;
      this.model.deviceName = rowData.name;
    }
  }
}
</script>

<style scoped>

</style>
