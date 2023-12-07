<template>
  <el-dialog draggable  appendToBody title="修改干燥罐" width="500px" v-model="dialogVisible" modal>
    <el-form :model="model" ref="form" :rules="rules" label-width="140px">
      <el-row>
        <el-col :span="24">
          <el-form-item prop="pl14Id" label="生产号：">
           <el-select v-model="model.pl14Id" placeholder="请选择生产号" style="width: 100%;" v-if="productNos.length>1">
             <el-option v-for="item in productNos" :key="item.pl14Id" :label="item.productNo" :value="item.pl14Id"></el-option>
           </el-select>
           <span v-if="productNos.length==1">{{productNo}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item prop="tankId" label="干燥罐：">
            <el-select v-model="model.tankId" style="width: 100%;">
              <el-option v-for="item in selectData" :key="item.id" :label="item.tableName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item prop="dateValue" label="计划时间：" >
            <el-date-picker
              v-model="model.dateValue"
              type="datetimerange"
              align="right"
              start-placeholder="开始日期"
              range-separator="至"
              end-placeholder="结束日期"

              style="width: 330px;"
              :clearable="false">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div  >
      <el-button @click="dialogVisible=false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import planWeek from '@/api/plan/planWeek'
import moment from "moment/moment";

export default {
  name: 'editTankDialog',
  data() {
    return {
      initModel: {
        pl14Id: '',
        nodeId: '',
        tankId: '',
        dateValue: '',
      },
      model: {},
      dialogVisible: false,
      rules: {
        pl14Id: [{required: true, message: '生产号不能为空', trigger: 'blur'}],
        tankId: [{required: true, message: '干燥罐不能为空', trigger: 'blur'}],
        dateValue: [{required: true, message: '计划时间不能为空', trigger: 'change'}],
      },
      //原干燥罐ID
      beforeTableId: '',
      selectData: [],
      productNos: [],
      productNo: ''
    }
  },
  watch: {
    "model.pl14Id": {
      handler(newValue, oldValue) {
        if(newValue) {
          let data = this.productNos.filter(item=>item.pl14Id == newValue)[0]
          this.model.dateValue = []
          this.model.dateValue[0] = data.startDate
          this.model.dateValue[1] = data.nodeDate
        }
      }
    }
  },
  methods: {
    init(obj) {
      console.log(obj)
      this.beforeTableId = obj.tank.tableId;
      this.model = {
        ...this.initModel,
        tankId: obj.tank.tableId,
        ...obj
      }
      this.productNos = obj.tank.children
      if(this.productNos.length == 1) {
        this.model.pl14Id = this.productNos[0].pl14Id
        this.productNo = this.productNos[0].productNo
        this.model.dateValue = []
        this.model.dateValue[0] = this.productNos[0]
        this.model.dateValue[1] = this.productNos[0]
      }

      // this.selectData = obj.tankList.filter(item=>item.id != this.beforeTableId)
      this.selectData = obj.tankList
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
        //判断所选时间段是否冲突
        let selectTank = this.selectData.filter(item=>item.id == this.model.tankId)[0]
        let flag = true;
        console.log(selectTank.chartDataList)
        selectTank.chartDataList.forEach(item=>{
          debugger
          let strDate = moment(this.model.dateValue[0]).format('YYYY-MM-DD')
          let endDate = moment(this.model.dateValue[1]).format('YYYY-MM-DD')
          if(strDate>=item.startDate&&endDate<=item.nodeDate&&item.isEmpty) {
            if(item.children.length>0) {
              this.model.dateValue[0] = item.startDate;
              this.model.dateValue[1] = item.nodeDate;
            }
            flag = false
            return
          }
        })
        if(flag) {
          this.$message.error("修改失败,该时间区间无法加入");
          return;
        }
        let submitModel = {
          tankId: this.model.tankId,
          pl14Id: this.model.pl14Id,
          nodeId: this.model.nodeId,
          startDate: moment(this.model.dateValue[0]).format('YYYY-MM-DD HH:mm:ss'),
          endDate: moment(this.model.dateValue[1]).format('YYYY-MM-DD HH:mm:ss')
        }
        console.log(submitModel)
        planWeek.updateTank(submitModel).then(resoponse=>{
          if(resoponse.err_code === this.$constants.statusCode.success){
            this.$message.success("数据保存成功");
            this.dialogVisible = false;
            this.$emit('refresh', {})
          }else{
            this.$message.error(resoponse.err_msg);
          }
        })
      })
    },
  }
}
</script>

<style scoped>

</style>
