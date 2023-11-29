<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" class="demo-form-inline demo-form-zdy">
        <el-form-item >
          <el-button @click="handleSearch" icon="refresh" >刷新</el-button>
          <el-button type="primary" @click="handleAdd" icon="plus" >新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="app-container app-containerC">
      <div class="otherCon wp">
        <el-table stripe   :data="tableData" class="otherCon wp" :stripe=true style="width: 100%;font-size:0.7rem;" row-key="id">
          <el-table-column align="center" width="110" label="工步Id" property="stepId"></el-table-column>
          <el-table-column align="center" label="工步编码"  property="stepCode"></el-table-column>
          <el-table-column  align="center" label="工步名称"  property="stepName"></el-table-column>
          <el-table-column align="center" width="110" label="操作项名称" property="operationName"></el-table-column>
          <el-table-column  align="center" label="标准工时"  property="standardWorkingHour"></el-table-column>
          <el-table-column align="center" label="设备名称" property="equipmentTypeName"></el-table-column>
          <el-table-column align="center" label="下限"  property="lowerLimit"></el-table-column>
          <el-table-column  align="center" label="上限"  property="upperLimit"></el-table-column>
          <el-table-column  align="center" label="正确值" width="100" property="correctValue"></el-table-column>
          <el-table-column  align="center" label="数据单位" width="100" property="dataUnit"></el-table-column>
          <el-table-column  align="center" label="内容最大长度" width="100" property="maximumContentLength"></el-table-column>
          <el-table-column prop="requireImageFile" align="center" width="100" label="是否需要上传图片/文件">
            <template v-slot="{row}">
              <div v-if="row.requireImageFile == 0">否</div>
              <div v-if="row.requireImageFile == 1">是</div>
            </template>
          </el-table-column>
          <el-table-column prop="isMultiline" align="center" width="100" label="是否多行">
            <template v-slot="{row}">
              <div v-if="row.isMultiline == 0">否</div>
              <div v-if="row.isMultiline == 1">是</div>
            </template>
          </el-table-column>
          <el-table-column prop="isRequired" align="center" width="100" label="是否必填">
            <template v-slot="{row}">
              <div v-if="row.isRequired == 0">否</div>
              <div v-if="row.isRequired == 1">是</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300" align="center" header-align="center">
            <template v-slot="scope">
              <el-button-group>
                <el-button type="primary "  icon ="Edit"
                           @click="handleEdit(scope.row)">
                </el-button>
                <el-button type="danger"   icon="Delete"
                           @click="handleItemDeleteDict(scope.row)">
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <check-item-form-dialog ref="checkItemFormDialogRef"  @refresh="getDataList"></check-item-form-dialog>

  </div>
</template>

<script>
import checkItemFormDialog from './components/checkItemFormDialog.vue'

import {deleteWorkContent,  getWorkContent} from "@/api/plan";

export default {
  name: 'Table',
  components: {checkItemFormDialog},
  data() {
    return {
      entity: {},
      dataList: [],
      listQuery:{
        stepId:'',
        stepName:'',
        stepCode:'',
        operationName:'',
        lowerLimit:'',
        upperLimit:'',
        correctValue:'',
        dataUnit:'',
        maximumContentLength:'',
        requireImageFile:'',
        isMultiline:'',
        isRequired:'',
        standardWorkingHour: '', //标准工时
        equipmentTypeName:'',//设备名称
      },
      tableData:[]
    }
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    handleSearch(){
      this.getDataList();
    },
    handleAdd(){
      this.$refs.checkItemFormDialogRef.init();
    },
    getDataList() {
      this.tableData = []
      getWorkContent(this.listQuery).then(response => {
        this.tableData = response.data
        this.total = response.total_count
      })
    },

    handleEdit(row){
      this.$refs.checkItemFormDialogRef.init(row);
    },
    handleItemDeleteDict(row) {
      this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteWorkContent({
          id: row.id
        }).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    initData() {
      getWorkContent({
        stepId: '',
        stepCode: '',
        stepName:'',
        pageNum: 1,
        pageSize: 10
      })
        this.getDataList()
    },
  }
}
</script>

<style scoped>

</style>