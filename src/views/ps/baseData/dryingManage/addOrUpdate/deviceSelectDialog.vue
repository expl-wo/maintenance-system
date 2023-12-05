<template>
  <el-dialog draggable  appendToBody title="选择设备" width="800px" v-model="dialogVisible" modal>
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="设备名称">
          <el-input v-model="listQuery.equipmentName" @keyup.enter="handleSearch"
                    class="filter-item" clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleSearch" icon="Search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="otherCon wp">
      <el-table stripe  ref="tableRef" height="500px" highlight-current-row border :data="dataList"
                style="font-size: 0.7rem"
      >
        <el-table-column
          header-align="center"
          align="center"
          label="设备编号"
          property="id"
          width="100"
        >
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="设备名称"
          property="name"
        >
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="设备分类"
          property="clazz"
        >
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="100">
          <template #default="scope">
            <el-button type="primary"
                       @click="handleSelect(scope.row)"
            >选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total" :page="pageNum" :limit="pageSize" @pagination="handlePagination" class="searchCon wp"/>
    </div>
  </el-dialog>
</template>

<script>
import dryingManage from '@/api/plan/dryingManage'
import Pagination from '@/components/Pagination/index.vue'
export default {
  name: 'deviceSelectDialog',
  components: {
    Pagination
  },
  data() {
    return {
      dialogVisible: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      dataList: [],
      listQuery: {
        equipmentName: ''
      }
    }
  },
  methods: {
    init() {
      this.dialogVisible = true
      this.getDataList()
    },
    handleSearch() {
      this.pageNum = 1;
      this.getDataList()
    },
    getDataList() {
      let params = {
        ...this.listQuery,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      dryingManage.getEquipmentList(params).then(response => {
        this.dataList = response.data
        this.total = response.total_count
      })
    },
    handlePagination({ page, limit }) {
      this.pageNum = page
      this.pageSize = limit
      this.getDataList()
    },
    handleSelect(rowData) {
      this.$emit('select', rowData);
      this.dialogVisible = false;
    }
  }
}
</script>

<style scoped>

</style>
