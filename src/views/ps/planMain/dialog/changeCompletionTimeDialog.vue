<template>
  <div class="app-container">
  <el-dialog draggable  appendToBody title="生产完工时间修改" v-model="dialogVisible" modal>
    <el-form ref="formRef" :model="formList" :rules="rules">
      <el-table stripe  ref="tableRef" height="360" highlight-current-row border :data="formList.dataList"
                style="font-size: 0.7rem">
        <el-table-column label="序号" width="50" align="center">
          <template v-slot="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="生产号"
          property="productNo"
          width="140"
        >
        </el-table-column>
        <el-table-column  align="center" label="生产完工时间" >
          <template v-slot="scope">
            <el-form-item :prop="'dataList.' + scope.$index + '.completionTime'" :rules="rules.completionTime">
              <el-date-picker
                v-model="scope.row.completionTime"
                style="width: 100%;"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
      <el-button @click="dialogVisible=false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </div>
    </template>
  </el-dialog>

  <el-dialog draggable  appendToBody title="生产完工时间修改" v-model="dialogVisibleSingle" modal>
    <el-form :model="model" class="element-list" ref="formRef" :rules="rules" label-width="120px">
      <div class="col-md-12">
        <el-form-item prop="newDeliveryDate" label="生产完工时间" required>
          <el-date-picker
            v-model="model.newDeliveryDate"
            style="width: 100%;"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
      <el-button @click="dialogVisibleSingle=false">取消</el-button>
      <el-button type="primary" @click="handleSubmitSingle">提交</el-button>
    </div>
    </template>
  </el-dialog>

  </div>
</template>

<script>
  import moment from 'moment'
  import planWeekHttp from '@/api/plan/planWeek'
  import { getToken } from '@/utils/auth'

  export default {
    name: 'changeCompletionTimeDialog',
    data() {
      return {
        dialogVisible: false,
        initModel: {
          proPlanId:'',
          newDeliveryDate: '',
        },
        model: {},
        rules: {
          newDeliveryDate: [{
            required: true, message: '生产完工时间不能为空'
          }],
          completionTime:[{
            required: true, message: '生产完工时间不能为空'
          }]
        },

        dialogVisibleSingle:false,
        formList:{
          dataList:[]
        }
      }
    },
    methods: {
      init(selectedData) {
        this.formList.dataList = selectedData;
        this.dialogVisible = true;
        this.$nextTick(()=>{
          this.$refs.formRef && this.$refs.formRef.clearValidate();
        })
      },
      initData(selectedData){
        this.model = {
          ...this.initModel,
          proPlanId: selectedData.id,
          newDeliveryDate:selectedData.completionTime
        }
        this.dialogVisibleSingle = true;
        this.$nextTick(()=>{
          this.$refs.formRef && this.$refs.formRef.clearValidate();
        })
      },
      handleSubmitSingle() {
        this.$refs.formRef.validate(valid => {
          if (!valid) {
            return
          }
          let formData = {
            planId: this.model.proPlanId,
            completionTime: moment(this.model.newDeliveryDate).format('YYYY-MM-DD'),
          }
          planWeekHttp.updateTime(formData).then(response=>{
            if(response.err_code === this.$constants.statusCode.success){
              if (this.model.newDeliveryDate === response.data) {
                this.$message.success('修改完工时间为'+response.data);
              }else {
                this.$message.success('所选月份产能已满修改完工时间改为'+response.data);
              }
              this.$emit('refresh', {});
              this.dialogVisibleSingle = false;
            }else{
              this.$message.error(response.err_msg);
            }
          })
        })
      },
      handleSubmit(){
        this.$refs.formRef.validate(valid => {
          if (!valid) {
            return
          }
          let selectList = this.formList.dataList;
          planWeekHttp.updateTimeList({ productPlans:selectList}).then(res=>{
            if(res.err_code === 10000) {
              this.$message.success("批量修改成功");
              this.$emit('refresh', {});
              this.dialogVisible=false
            } else this.$message.error("补录报工失败"+res.err_msg)
          })
        })
      },
    }
  }
</script>

<style scoped>

</style>
