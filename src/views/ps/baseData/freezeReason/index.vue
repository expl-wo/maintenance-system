<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="冻结原因">
          <el-input v-model="listQuery.reasonName" @keyup.enter="handleSearch"
                    class="filter-item" clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleSearch"  icon="Search">查询</el-button>
          <el-button type="primary"  icon="Plus"  @click="handleAdd">新增
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="app-container app-containerC">
      <div class="otherCon wp">
        <el-table stripe  ref="tableRef" :height="'100%'" highlight-current-row border :data="dataList"
                  style="font-size: 0.7rem"
        >
        <!--  <el-table-column
            header-align="center"
            align="center"
            type="selection"
            fixed
            width="45"
          >
          </el-table-column>-->
          <el-table-column
            header-align="center"
            align="center"
            label="序号"
            width="50"
          >
            <template #default="scope">
              <span>{{ scope.$index+1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="原因名称"
            property="reasonName"
            width="400"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="原因描述"
            property="reasonDescribe"
          >
          </el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template #default="scope">
              <el-button-group>
                <el-button  type="primary" icon="Edit"
                            @click="handleEdit(scope.row)">
                </el-button>
                <el-button type="danger" icon="Delete"
                           @click="handleDelete(scope.row)">
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <xui-pagination :total="total" :page="pageNum" :limit="pageSize" @pagination="handlePagination" class="searchCon wp"/>
    </div>
    <add-or-update-dialog @refresh="handleSearch" ref="addOrUpdateDialogRef"></add-or-update-dialog>
  </div>
</template>

<script>
import freezeReason from '@/api/plan/freezeReason'
import addOrUpdateDialog from '@/views/ps/baseData/freezeReason/addOrUpdate/addOrUpdateDialog'
import Constants from "../../../../utils/constants";

export default {
  name: 'index',
  components: {
    addOrUpdateDialog
  },
  data() {
    return {
      dataList: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      listQuery: {
        reasonName: '',
      }
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    getDataList() {
      let params = this.getParams()
      freezeReason.findAllFreezeReason(params).then(response => {
        if (response.err_code === Constants.statusCode.success) {
          this.dataList = response.data
          this.total = response.total_count
        } else {
          this.$message.error(response.err_msg)
        }
      })
    },
    //新增
    handleAdd(){
      this.$refs.addOrUpdateDialogRef.init();
    },
    handleEdit(rowData){
      this.$refs.addOrUpdateDialogRef.init(rowData);
    },
    handleDelete(rowData){
      this.$confirm(Constants.deleteTip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        freezeReason.deleteFreezeReason({ id: rowData.id}).then(response => {
          this.$message.success( '删除成功');
          this.handleSearch()
        })
      })
    },
    handleSearch() {
      this.pageNum = 1
      this.getDataList()
    },
    getParams() {
      return {
        ...this.listQuery,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
    },
    handlePagination({ page, limit }) {
      this.pageNum = page
      this.pageSize = limit
      this.getDataList()
    }
  }
}
</script>

<style scoped>

</style>
