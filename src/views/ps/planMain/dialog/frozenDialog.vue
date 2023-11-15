<template>
  <el-dialog v-dialogDrag appendToBody title="冻结工单" v-model="dialogVisible" modal>
    <el-form :model="model" class="element-list" ref="formRef"
             :rules="rules" label-width="100px"
    >
      <div class="col-md-12">
        <el-form-item prop="reasonId" label="冻结原因" required size="mini">
          <el-select v-model="model.reasonId" style="width: 100%;">
            <el-option v-for="(item, index ) in reasonList" :key="index" :value="item.id" :label="item.reasonName">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="col-md-12">
        <el-form-item prop="freezeReason" label="备注" size="mini">
          <el-input v-model="model.freezeReason" type="textarea" :rows="5"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
      <el-button size="mini" @click="dialogVisible=false">取消</el-button>
      <el-button size="mini" type="primary" @click="handleSubmit">提交</el-button>
    </div>
    </template>
  </el-dialog>
</template>

<script>
// import planWeekHttp from '@/api/plan/planWeek'
// import freezeReason from '@/api/plan/freezeReason'

export default {
  name: 'frozenDialog',
  data() {
    return {
      dialogVisible: false,
      initModel: {
        reasonId: '',
        freezeReason: ''
      },
      model: {},
      rules: {
        reasonId: [{
          required: true, message: '冻结原因不能为空'
        }]
      },
      selectedData: [],
      reasonList: []
    }
  },
  methods: {
    init(selectedData) {
      this.selectedData = selectedData;
      this.getReasonList();
      this.model = {
        ...this.initModel,
      }
      this.dialogVisible = true;
      this.$nextTick(()=>{
        this.$refs.formRef && this.$refs.formRef.clearValidate();
      })
    },
    getReasonList(){
      freezeReason.findAllFreezeReason({
        reasonName: '',
        pageNum: 1,
        pageSize: this.$constants.pageEntryCount
      }).then(response => {
        if (response.err_code === this.$constants.statusCode.success) {
          this.reasonList = response.data;
        }
      })
    },
    handleSubmit() {
      this.$refs.formRef.validate(valid => {
        if (!valid) {
          return
        }
        let list = [];
        this.selectedData.forEach(item=>{
          list.push({
            planId: item.id,
            ...this.model
          })
        })
        planWeekHttp.freezeWork(list).then(response => {
          if (response.err_code === this.$constants.statusCode.success) {
            this.$message.success('数据保存成功')
            this.$emit('refresh', {});
            this.dialogVisible = false
          } else {
            this.$message.error(response.err_msg)
          }
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
