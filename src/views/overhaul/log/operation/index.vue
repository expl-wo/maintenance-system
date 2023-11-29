<template>
  <div class="full-content">
    <div class="table-top">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="操作时间">
          <el-date-picker
            v-model="searchForm.operateTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="操作用户">
          <el-input placeholder="请输入" v-model="searchForm.user"> </el-input>
        </el-form-item>
        <el-form-item label="操作模块">
          <el-input placeholder="请输入" v-model="searchForm.module">
          </el-input>
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select v-model="searchForm.type" placeholder="请选择">
            <el-option label="餐厅名" value="1"></el-option>
            <el-option label="订单号" value="2"></el-option>
            <el-option label="用户电话" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作对象">
          <el-input placeholder="请输入" v-model="searchForm.object">
          </el-input>
        </el-form-item>
        <el-form-item class="mr0">
          <el-button type="primary" @click="onSubmit"
            ><el-icon class="el-icon--left"><Search /></el-icon>查询</el-button
          >
          <el-button type="primary" @click="onSubmit"
            ><el-icon class="el-icon--left"><RefreshLeft /></el-icon>
            重置</el-button
          >
          <el-button type="primary"
            ><el-icon class="el-icon--left"><Download /></el-icon
            >导出</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrapper">
      <el-table
        :data="tableData"
        size="medium"
        border
        @sort-change="sortChange"
      >
        <el-table-column
          v-for="item in columns"
          :key="item.key"
          :prop="item.prop"
          :label="item.label"
          :sortable="item.sortable"
          :width="item.width"
          :filters="item.filters"
          :filter-multiple="item.filterMultiple"
          :column-key="item.columnKey"
          :filter-method="item.filterHandler"
        >
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-wrapper">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        background
        :current-page="pageNum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { Search, RefreshLeft, Download } from "@element-plus/icons-vue";
const typeOptions = [
  { text: "WEB", value: 1 },
  { text: "APP", value: 2 },
];
export default {
  components: {
    Search,
    RefreshLeft,
    Download,
  },
  data() {
    return {
      searchForm: {
        operateTime: "",
        user: "",
        module: "",
        type: "",
        object: "",
      },
      columns: [
        { label: "操作时间", key: "optTime", prop: "optTime", sortable: true },
        {
          label: "操作用户",
          key: "userName",
          prop: "userName",
          sortable: true,
        },
        {
          label: "终端IP",
          key: "terminalIp",
          prop: "terminalIp",
          sortable: true,
        },
        {
          label: "终端类型",
          key: "terminalType",
          prop: "terminalType",
          sortable: false,
          columnKey: "terminalType",
          filters: typeOptions,
          filterMultiple: true,
          filterHandler: this.handleFilter,
        },
        {
          label: "操作模块",
          key: "moduleCode",
          prop: "moduleCode",
          sortable: true,
        },
        {
          label: "操作类型",
          key: "optEvent",
          prop: "optEvent",
          sortable: true,
        },
        {
          label: "操作对象",
          key: "bisTargetName",
          prop: "bisTargetName",
          sortable: false,
        },
        { label: "操作描述", key: "memo", prop: "memo", sortable: false },
        { label: "操作结果", key: "status", prop: "status", sortable: false },
      ],
      tableData: [
        {
          id: 1,
          optTime: "2023-10-25 12:00:00",
          userName: "system",
          terminalIp: "124.228.34.36",
          terminalType: 1,
          moduleCode: "EVOBRM_001002",
          optEvent: "登录",
          bisTargetName: "system",
          status: 1,
        },
      ],
      pageNum: 1,
      pageSize: 10,
      total: 100,
    };
  },
  methods: {
    sortChange({ column, prop, order }) {
      debugger;
    },
    handleFilter(value, row, column) {
      debugger;
    },
    //
    handleSizeChange() {},
    handlePageChange() {},
  },
};
</script>
<style lang="scss" scoped>
.full-content {
  width: 100%;
  height: 100%;
  padding: 20px;
  //   border: 1px solid red;
  .table-top {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .search-wrapper {
      margin-left: auto;
    }
  }
  .table-wrapper {
    position: relative;
    width: 100%;
    height: calc(100% - 84px);
    margin-top: 12px;
  }
}
:deep(.el-form-item) {
  margin-bottom: 0;
}
:deep(.el-table) {
  overflow: auto;
  width: 100%;
  height: 100%;
}
:deep(.el-table__header-wrapper) {
  position: sticky;
  top: 0;
  z-index: 10;
}
:deep(.el-table__body-wrapper) {
  height: calc(100% - 56px);
  width: 100%;
  overflow-y: auto;
}
.mr0 {
  margin-right: 0;
}
</style>