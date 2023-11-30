<template>
  <div class="deviceDetail">
    <div class="detail-wrapper el-radius">
      <div class="detail-title">
        <div class="ml-5 mr-5">{{ name }}当前状态</div>
        <el-button type="primary" icon="el-icon-refresh"  size="small">刷新</el-button>
      </div>
      <el-form ref="form"  size="small" label-position="right" label-width="180px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备运行状态："  size="small">
              <el-tag class="ml-2" type="success">{{ deviceRunningParams.status }}</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="" label="目标值（毫米）："  size="small">
              <div class="detail-desc">{{ deviceRunningParams.targetValue }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="上模直径（毫米）："  size="small">
              <div class="detail-desc">{{ deviceRunningParams.upValue }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下模直径（毫米）："  size="small">
              <div class="detail-desc">{{ deviceRunningParams.downValue }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
        <el-col :span="24">
          <el-form-item label="数据采集时间："  size="small">
            <div class="detail-desc">{{ deviceRunningParams.dateTime }}</div>
          </el-form-item>
        </el-col>

      </el-row>
      </el-form>
    </div>
    <div class="detail-wrapper el-radius">
      <div class="detail-title">
        设备参数配置
      </div>
      <el-form ref="formRef" :model="config" :rules="rules" label-position="right" label-width="180px">
        <el-row>
          <el-col :span="24">
            <el-form-item  prop="targetValue" class="el-form-item__flex" label="设置目标值（毫米）："  size="small">
              <el-input style="width: 160px;" type="number" v-model="config.targetValue"></el-input>
              <el-button type="primary" class="ml-5" @click="handleSendTargetValue">下发</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="detail-wrapper el-radius">
      <div class="detail-title">
        工单管理
      </div>
      <div>
        <el-button type="primary"  size="small" @click="handleStartWorkOrder">工单开始</el-button>
        <el-button type="success"  size="small" @click="handleEndWorkOrder">工单结束</el-button>
      </div>
      <div :class="runningWorkOrder.id?'success': 'error'" class="tipDesc">{{workHistoryDesc}}</div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import wireWrapDataHttp from "@/api/em/wireWrapData";
import wireWrapTargetValueHttp from "@/api/em/wireWrapTargetValue";
import wireWrapWorkOrderHttp from "@/api/em/wireWrapWorkOrder";

export default {
  name: "deviceDetail",
  data() {
    return {
      code: '',
      name: '',
      deviceRunningParams: {
        status: '正常',
        targetValue: '2000',
        upValue: '2000.3',
        downValue: '2000.1',
        dateTime: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      //目标下发值
      config: {
        targetValue: ''
      },
      rules: {
        targetValue: [{
          required: true,trigger: 'blur', message: '目标值不能为空'
        }]
      },
      //当前工单
      runningWorkOrder: {},
      workHistoryDesc: '',
      timer: null
    }
  },
  beforeUnmount() {
    this.clearTimer();
  },
  methods: {
    init(deviceEntity) {
      this.code = deviceEntity.code;
      this.name = deviceEntity.name;
      this.getRunningWorkDetail();
      this.startRefreshData();
    },
    //刷新当前状态数据
    startRefreshData(){
      this.clearTimer();
      this.timer = window.setInterval(()=>{
        this.getLatelyDeviceStatus();
      }, 3000);
    },
    //获取最新的数据
    getLatelyDeviceStatus(){
      console.log("123")
    },
    handleSendTargetValue() {
      this.$refs.formRef.validate(valid=>{
        if(!valid){
          return;
        }
        this.$confirm("确定下发目标值到设备？").then( ()=> {
          wireWrapTargetValueHttp.addOrUpdate({
            deviceCode: this.code,
            deviceName: this.name,
            targetValue: this.config.targetValue
          }).then(response=>{
            if(response.err_code === this.$constants.status.success){
              this.$message.success("目标值下发成功")
            }else{
              this.$message.error(response.msg);
            }
          })
        })
      })
    },
    handleStartWorkOrder() {
      if (this.runningWorkOrder.id) {
        this.$confirm("当前已有工单在运行，是否结束此工单开始新工单？").then(response => {
          this.startWorkOrder();
        })
      } else {
        this.startWorkOrder();
      }
    },
    startWorkOrder() {
      let params = {
        deviceCode: this.code,
        deviceName: this.name,
      }
      if(this.runningWorkOrder.id){
        params.id = this.runningWorkOrder.id;
      }
      wireWrapWorkOrderHttp.addOrUpdate(params).then(response=>{
        if(response.err_code === this.$constants.status.success){
          this.$message.success("开始工单");
          this.getRunningWorkDetail();
        }else{
          this.$message.error(response.msg);
        }
      })
    },
    handleEndWorkOrder() {
      if (this.runningWorkOrder.id) {
        this.$confirm("是否确定结束此工单？").then(response => {
          this.endWorkOrder();
        })
      } else {
        this.$message.warning("当前没有在运行的工单，无需结束")
      }
    },
    endWorkOrder() {
      wireWrapWorkOrderHttp.finish({
        id: this.runningWorkOrder.id
      }).then(response=>{
        if(response.err_code === this.$constants.status.success){
          this.$message.success("工单结束");
          this.getRunningWorkDetail();
        }else{
          this.$message.error(response.msg);
        }
      })
    },
    //获取当前工单
    getRunningWorkDetail() {
      wireWrapWorkOrderHttp.findLatelyWorkOrder({
        deviceCode: this.code
      }).then(response => {
        if (response.err_code === this.$constants.status.success) {
          let data = response.data;
          if (data.id) {
            this.runningWorkOrder = data;
            this.setRunningWorkOrderDesc();
            this.$emit('updateWorkOrder', this.runningWorkOrder);
            return;
          }
        }
        this.runningWorkOrder = {};
        this.setRunningWorkOrderDesc();
        this.$emit('updateWorkOrder', this.runningWorkOrder);
      }).catch(() => {
        this.runningWorkOrder = {};
        this.setRunningWorkOrderDesc();
        this.$emit('updateWorkOrder', this.runningWorkOrder);
      })
    },
    setRunningWorkOrderDesc(){
      if(this.runningWorkOrder.id){
        let startDt = this.runningWorkOrder.startDt;
        if(startDt.length > 13){
          startDt = startDt.substr(0, 13);
        }
        this.workHistoryDesc = `当前工单开始于：${startDt}时`;
      }else{
        this.workHistoryDesc = '还未开始运行工单';
      }
    },
    clearTimer(){
      if(this.timer){
        window.clearInterval(this.timer);
        this.timer = null;
      }
    }
  }

}
</script>

<style scoped>

</style>
