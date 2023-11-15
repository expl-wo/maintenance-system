<template>
  <el-dialog v-dialogDrag  appendToBody title="计划生产完工时间修改申请" v-model="dialogVisible" modal>
    <el-form :model="model" class="element-list" ref="formRef"
             :rules="rules" label-width="120px"
    >
      <div class="col-md-12">
        <el-form-item prop="newDeliveryDate" label="计划生产完工时间" required size="mini">
          <el-date-picker
            v-model="model.newDeliveryDate"
            style="width: 100%;"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="col-md-12">
        <el-form-item prop="changeReason" label="修改原因" size="mini">
          <el-input v-model="model.changeReason" type="textarea" :rows="4"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
      <el-button size="mini" @click="dialogVisible=false">取消</el-button>
      <el-button size="mini"  v-if="$isAuth('mesGYBD50031.submit')" type="primary" @click="handleSubmit">提交</el-button>
    </div>
    </template>
  </el-dialog>
</template>

<script>
  import moment from 'moment'
  import planWeekHttp from '@/api/plan/planWeek'
  import { getToken } from '@/utils/auth'

  export default {
    name: 'changePlanCompletimeDialog',
    data() {
      return {
        dialogVisible: false,
        initModel: {
          proPlanId:'',
          newDeliveryDate: '',
          changeReason: '',
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
      initData(selectedData) {
        this.model = {
          ...this.initModel,
          proPlanId: selectedData.id,
          timeLimitId:selectedData.timeLimitId
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
            timeLimitId:this.model.timeLimitId,
            proPlanId: this.model.proPlanId,
            newDeliveryDate: moment(this.model.newDeliveryDate).format('YYYY-MM-DD'),
            changeReason: this.model.changeReason
          }
          planWeekHttp.changePlanComple(formData).then(response=>{
            if(response.err_code === this.$constants.statusCode.success){
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
