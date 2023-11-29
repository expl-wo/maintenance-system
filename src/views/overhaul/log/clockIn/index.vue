<template>
  <div class="full-content">
    <div class="table-top">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input placeholder="请输入" v-model="searchForm.userName">
          </el-input>
        </el-form-item>
        <el-form-item label="工号">
          <el-input placeholder="请输入" v-model="searchForm.userCode">
          </el-input>
        </el-form-item>
        <el-form-item label="签到时间">
          <el-date-picker
            v-model="searchForm.signInTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item class="mr0">
          <el-button type="primary" @click="onSearch"
            ><el-icon class="el-icon--left"><Search /></el-icon>查询</el-button
          >
          <el-button type="primary" @click="onReset">
            <el-icon class="el-icon--left"><RefreshLeft /></el-icon>
            重置</el-button
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
import { Search, RefreshLeft } from "@element-plus/icons-vue";
const typeOptions = [
  { text: "WEB", value: 1 },
  { text: "APP", value: 2 },
];
export default {
  components: {
    Search,
    RefreshLeft,
  },
  data() {
    return {
      searchForm: {
        userName: "",
        userCode: "",
        signInTime: "",
        type: "",
        object: "",
      },
      columns: [
        { label: "序号", key: "optTime", prop: "optTime", sortable: true },
        { label: "姓名", key: "userName", prop: "userName", sortable: true },
        {
          label: "工号",
          key: "terminalIp",
          prop: "terminalIp",
          sortable: true,
        },
        {
          label: "所属部门",
          key: "terminalType",
          prop: "terminalType",
          sortable: false,
          columnKey: "terminalType",
          filters: typeOptions,
          filterMultiple: true,
          filterHandler: this.handleFilter,
        },
        {
          label: "岗位",
          key: "moduleCode",
          prop: "moduleCode",
          sortable: true,
        },
        {
          label: "签到地点",
          key: "optEvent",
          prop: "optEvent",
          sortable: true,
        },
        {
          label: "所在项目",
          key: "bisTargetName",
          prop: "bisTargetName",
          sortable: false,
        },
        { label: "签到时间", key: "memo", prop: "memo", sortable: false },
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
    onSerach() {},
    onReset() {},
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
  .table-top {
    display: flex;
    align-items: center;
    justify-content: flex-start;
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