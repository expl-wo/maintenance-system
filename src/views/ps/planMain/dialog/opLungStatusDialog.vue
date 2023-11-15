<template>
  <el-dialog v-dialogDrag  appendToBody title="报工信息" width="800" v-model="dialogVisible" modal>
    <el-table stripe  ref="tableDataRef" height="400" highlight-current-row border :data="dataList"
              style="font-size: 0.7rem">
      <el-table-column
        header-align="center"
        align="center"
        label="工序"
        property="opName"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="进度(-1代表无需生产)"
        property="ratios"
      >
      </el-table-column>
    </el-table>
    <template #footer>
      <div class="dialog-footer">
      <el-button size="mini" @click="dialogVisible=false">关闭</el-button>
    </div>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'opLungStatusDialog',
  data(){
    return {
      dialogVisible: false,
      dataList: [],
    }
  },
  methods: {
    init(opList){
      this.dialogVisible = true;
      this.dataList = opList;
    },
  }
}
</script>

<style scoped>

</style>
