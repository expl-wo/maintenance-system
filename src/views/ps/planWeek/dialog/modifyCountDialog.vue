<template>
  <el-dialog draggable  appendToBody title="BOM数量编辑" width="600px" v-model="dialogVisible" modal>
    <div class="otherCon wp">
      <el-table stripe  ref="tableRef" height="500px" highlight-current-row border :data="bomInfoList"
                style="font-size: 0.7rem"
      >
        <el-table-column
          header-align="center"
          align="center"
          label="序号"
          width="100"
        >
          <template  #default="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="图纸名称"
          property="name"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="数量"
          property="amount"
        >
          <template  #default="scope">
            <el-input-number v-model="scope.row.amount" :min="0"></el-input-number>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer">
      <el-button @click="dialogVisible=false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { deepClone } from '@/utils'
import common from '@/views/ps/planWeek/dialog/common'

export default {
  name: 'modifyCountDialog',
  data(){
    return {
      dialogVisible: false,
      bomInfoList: [],
      rowData: {}
    }
  },
  methods: {
    initData(rowData){
      this.rowData = rowData;
      this.bomInfoList = deepClone(rowData.bomInfo);
      this.dialogVisible = true;
    },
    handleSubmit(){
      this.rowData.bomInfo = this.bomInfoList;
      common.setBomInfoDesc(this.rowData);
      this.dialogVisible = false;
    }
  }
}
</script>

<style scoped>

</style>
