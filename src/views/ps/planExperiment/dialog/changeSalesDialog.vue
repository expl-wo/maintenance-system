<template>
  <el-dialog v-dialogDrag  appendToBody title="销售回复时间填写" v-model="dialogVisible" modal>
    <el-form :model="model" class="element-list" ref="formRef"
             :rules="rules" label-width="100px"
    >
      <div class="col-md-12">
        <el-form-item prop="newDeliveryDate" label="销售回复时间" required size="mini">
          <el-date-picker
            v-model="model.newDeliveryDate"
            type="datetimerange" range-separator="至" style="width: 330px;" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
    <div>
      <el-button size="mini" @click="dialogVisible=false">取消</el-button>
      <el-button size="mini" type="primary" @click="handleSubmit">提交</el-button>
    </div>
    </template>
  </el-dialog>
</template>

<script>
  import moment from 'moment'
  import planWeekHttp from '@/api/plan/planWeek'
  import { timeTranslate } from '@/utils/common'

  import { getToken } from '@/utils/auth'
  export default {
    name: "changeSalesDialog",
    data() {
      return {
        dialogVisible: false,
        action: '',
        initModel: {
          proPlanId:'',
          newDeliveryDate: [],
        },
        model: {},
        rules: {
          newDeliveryDate: [{
            required: true, message: '申请时间不能为空'
          }],
        },
      }
    },
    created(){
    },
    methods: {
      init(selectedData) {
        this.model = {
          ...this.initModel,
          proPlanId: selectedData.id,
        }
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
          let formData = {
            proPlanId: this.model.proPlanId,
            salesStartReply: moment(this.model.newDeliveryDate[0]).format('YYYY-MM-DD HH:mm:ss'),
            salesEndReply: moment(this.model.newDeliveryDate[1]).format('YYYY-MM-DD HH:mm:ss'),
          }
          planWeekHttp.updateSales(formData).then(response=>{
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
