<template>
  <el-dialog draggable  append-to-body title="开始时间处理" v-model="dialogVisible" modal>
    <el-form
      ref="formRef"
      :model="model"
      class="element-list"
      :rules="rules"
      label-width="100px"
    >
      <div v-if="!(isRepair===1&&model.isCancel===1)" class="col-md-12">
        <el-form-item prop="startDate" required label="新计划开始时间" label-width="110px">
          <el-date-picker
            v-model="model.startDate"
            value-format="YYYY-MM-DD"
            style="width: 100%;"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
      </div>
      <div v-if="isRepair===1" class="col-md-12">
        <el-form-item prop="newDeliveryDate" label="是否取消该节点" label-width="110px">
          <el-radio-group v-model="model.isCancel">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <div class="col-md-12">
        <el-form-item prop="describe" required label="修改原因" label-width="110px">
          <el-input type="text" placeholder="请输入修改原因" v-model="model.describe"></el-input>
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
// import planWeekHttp from '@/api/plan/planWeek'
export default {
  name: 'opStartDateDialog',
  data() {
    return {
      dialogVisible: false,
      model: {
        startDate: '',
        isCancel: 0,
        finishDate: '',
        pl14Id: '',
        nodeId: '',
        describe:''
      },
      oldStrDate: '',
      isRepair: 0,
      rules: {
        startDate:[{
          required: true, message: '申请时间不能为空'
        }],
        describe:[{
          required: true, message: '申请原因不能为空'
        }]
      }
    }
  },
  methods: {
    init(row, column) {
      this.dialogVisible = true
      this.model.nodeId = column.property.split('_')[1]
      var nodeList = row.nodeList
      nodeList.forEach(node => {
        if (node.nodeId === this.model.nodeId) {
          this.model.finishDate = node.nodeDate
          this.model.pl14Id = row.id
          this.model.startDate = node.startDate
          this.oldStrDate = node.startDate
        }
      })
      this.isRepair = row.isRepair
      this.model.isCancel = 0
      console.log(this.model)
    },
    handleSubmit() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          planWeekHttp.changeNodeStartDateOrCancel(this.model).then(response => {
            if (response.err_code === this.$constants.statusCode.success) {
              this.$message.success('数据提交成功')
              this.$emit('refresh', {})
              this.dialogVisible = false
            } else {
              this.$message.error(response.err_msg)
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
