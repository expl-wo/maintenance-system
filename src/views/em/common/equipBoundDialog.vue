<template>
  <el-dialog draggable :close-on-click-modal="false" title="编辑设备"  v-model="dialogVisible" class="roleBigDialog">
    <div>
      <div class="filter-container searchCon">
        <el-form :inline="true" :model="params" class="demo-form-inline demo-form-zdy">
          <el-form-item label="设备编号"  size="small">
            <el-input v-model="params.id" placeholder="设备编号" style="width: 180px;" class="filter-item" clearable />
          </el-form-item>
          <el-form-item label="设备名称"  size="small">
            <el-input v-model="params.name" placeholder="设备名称" style="width: 180px;" class="filter-item" clearable />
          </el-form-item>
          <el-form-item label="绑定其他配置"  size="small">
            <el-radio-group v-model="params.isLinked">
              <el-radio :label="-1">全部</el-radio>
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item  size="small">
            <el-button type="primary" icon="el-icon-search" @click="onBtnEqpQuery()">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="app-containerR wp" style="height:350px;">
        <div class="hp otherCon">
          <el-card shadow="hover" class="hp">
            <div  class="clearfix">
              <span>未绑定设备</span>
            </div>
            <div class="wp hp app-containerC">
              <el-tree
                ref="dataTreeNo"
                class="otherCon wp"
                :data="notLinkedEquip"
                :props="props"
                show-checkbox
                default-expand-all
                highlight-current
                :expand-on-click-node="false"
              />
            </div>
          </el-card>
        </div>
        <div class="hp leftSmallRCon app-containerC cc">
          <el-button type="primary" size="small" plain icon="el-icon-arrow-left" @click="rightClick()" />
          <el-button type="primary" size="small" plain icon="el-icon-arrow-right" style="margin: 10px 0 0;" @click="leftClick()" />
        </div>
        <div class="hp otherCon">
          <el-card shadow="hover" class="hp">
            <div  class="clearfix">
              <span>已绑定设备</span>
            </div>
            <div class="wp hp app-containerC">
              <el-tree
                ref="dataTree"
                class="otherCon wp"
                :data="linkedEquip"
                :props="props2"
                show-checkbox
                default-expand-all
                highlight-current
                :expand-on-click-node="false"
              />
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <div   class="dialog-footer">
      <el-button  size="small" @click="dialogVisible = false">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getEqpConfUpdate, getEqpConf} from '@/api/em/eqpCheck'
import { eqpConfDaily,eqpConfDailyUpdate} from '@/api/em/eqpMtc'
export default {
  name: 'equipBoundDialog',
  data(){
    return {
      typeOfDialog:'',
      dialogVisible: false,
      notLinkedEquip:[],
      linkedEquip:[],
      props: {
        value: 'id', // ID字段名
        label: 'name', // 显示名称
        children: 'sub', // 子级字段名
        disabled: function(data, node) {
          if (data.fid == null && data.sub.length == 0) {
            return true
          }
          return false
        }
      },
      props2: {
        value: 'id', // ID字段名
        label: 'name', // 显示名称
        children: 'sub' // 子级字段名
      },
      params:{
        mainId:'',
        id:'',
        name:'',
        isLinked:0
      }
    }
  },
  methods: {
    initData(initData){
      this.params.mainId = initData.mainId
      this.typeOfDialog = initData.typeOfDialog
      this.dialogVisible = true;
      this.equipSearch()
    },
    // getParams(){

    // },
    equipSearch(){
      if(this.typeOfDialog == 'check'){
        getEqpConf(this.params).then(response => {
          this.notLinkedEquip = response.data.notLinked // 未绑定数据
          this.linkedEquip = response.data.linkedEqp // 已绑定数据
        })
      }else if(this.typeOfDialog == 'maintain'){
        eqpConfDaily(this.params).then(response => {
          this.notLinkedEquip = response.data.notLinked // 未绑定数据
          this.linkedEquip = response.data.linkedEqp // 已绑定数据
        })
      }
    },
    onBtnEqpQuery(){
      this.equipSearch()
    },
    rightClick(){
      const data = this.$refs.dataTree.getCheckedNodes()
      const req = { mainId: this.params.mainId, eqps: [] }
      if (data.length == 0) {
        this.$message({ message: '请选择右侧设备', type: 'warning' })
      } else {
        data.forEach(item => {
          req.eqps.push({ 'eqpId': item.id })
        })
        this.updateTransferData(req)
      }
    },
    leftClick(){
      const dataNo = this.$refs.dataTreeNo.getCheckedNodes()
      const req = { mainId: this.params.mainId, eqps: [] }
      if (dataNo.length == 0) {
        this.$message({ message: '请选择左侧设备', type: 'warning' })
      } else {
        if (this.transferData && this.transferData.length > 0) {
          // 现有已绑定的
          this.transferData.forEach(item => {
            req.eqps.push({ 'eqpId': item.id, 'eqpName': item.name })
          })
        }
        // 新添加的
        dataNo.forEach(item => {
          if (!(item.fid == null)) {
            req.eqps.push({ 'eqpId': item.id, 'eqpName': item.name })
          }
        })
        this.updateTransferData(req)
      }
    },
    updateTransferData(req) {
      if(this.typeOfDialog == 'check') {
        // 点检配置设备挂接
        getEqpConfUpdate(req).then(res => {
          if (res.err_code === 10000) {
            this.$message.success("处理成功");
          } else {
            this.$message.error("绑定失败，" + res.err_msg);
          }
          this.equipSearch()
        })
      }else if(this.typeOfDialog == 'maintain'){
        eqpConfDailyUpdate(req).then(res => {
          if (res.err_code === 10000) {
            this.$message.success("处理成功");
          } else {
            this.$message.error("绑定失败，" + res.err_msg);
          }
          this.equipSearch()
        })
      }
    },
  }
}
</script>

<style scoped>

</style>
