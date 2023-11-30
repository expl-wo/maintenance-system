<template>
  <el-dialog draggable  appendToBody title="预排检查" width="800px" v-model="dialogVisible" modal>
    <div class="otherCon wp">
      <div class="xui-check-panel">
        <div class="xui-check-panel__item" v-for="(opItem,index) in dataList" :key="'op' + index">
          <div class="xui-check-panel__title">{{opItem.name }}</div>
          <div class="xui-check-panel__content">
            <el-radio-group v-model="opItem.v" @change="val=>handleChangeRadio(val, opItem)">
              <el-radio v-for="item in opItem.sub" :label="item.id" :key="item.id">{{ item.opName }}</el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
      <el-button @click="dialogVisible=false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </div>
    </template>
  </el-dialog>
</template>

<script>
import planWeek from '@/api/plan/planWeek'

export default {
  name: 'submitApprovalDialog',
  data() {
    return {
      dialogVisible: false,
      dataList: [],
      rowData: {},
      params: {},
    }
  },
  methods: {
    initData(rowData, params) {
      this.rowData = rowData
      this.params = params
      this.getData()
    },
    getData() {
      planWeek.opSmallGx({
        nodeId: this.params.nodeId,
        pl14Id: this.rowData.productPlanId
      }).then(response => {
        if (response.err_code === this.$constants.status.success) {
          this.formatData(response.data)
          this.dialogVisible = true;
        }
      })
    },
    formatData(dataList) {
      let level = this.getLevel(dataList);
      let data = []
      if(level === 2){
        dataList.forEach(item => {
          data.push({
            id: item.id,
            name: item.opName,
            sub: item.sub,
            v: '',
            vName: ''
          })
        })
      }else if(level === 3){
        dataList.forEach(item => {
          item.sub && item.sub.forEach(subItem => {
            let secondObj = {
              id: item.id + ',' + subItem.id,
              name: item.opName + ' > ' + subItem.opName,
              sub: subItem.sub,
              v: '',
              vName: ''
            }
            data.push(secondObj)
          })
        })
      }
      this.dataList = data
    },
    getLevel(dataList){
      let level = 2;
      try{
        dataList.forEach(item=>{
          if(item.sub && item.sub.length > 0){
            let subItem1 = item.sub[0];
            if(subItem1.sub && subItem1.sub.length > 0){
              level = 3;
              throw new Error()
            }else{
              level = 2;
              throw new Error()
            }
          }
        })
      }catch (e){
        console.error(e)
      }
      return level;
    },
    handleSubmit() {
      let commitData = [];
      this.dataList.forEach(item=>{
        commitData.push({
          id: item.id,
          name: item.name,
          v: item.v,
          vName: item.vName
        })
      })
      this.rowData._condition = JSON.stringify(commitData);
      this.dialogVisible = false;
    },
    handleChangeRadio(val, obj){
      let label = '';
      obj.sub.some(item=>{
        if(item.id === val){
          label  = item.opName;
          return true;
        }else{
          return false;
        }
      })
      obj.vName = label;
    }
  }
}
</script>

<style lang="scss" src="@/styles/xui/check-panel.scss"></style>
<style scoped>

</style>
