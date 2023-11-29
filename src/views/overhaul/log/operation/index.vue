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
          <el-input v-model="searchForm.operateUser"  @keyup.enter="onSearch">
          </el-input>
        </el-form-item>
        <el-form-item label="操作模块">
          <el-input v-model="searchForm.operateModel" @keyup.enter="onSearch">
          </el-input>
        </el-form-item>
        <el-form-item label="终端IP">
          <el-input v-model="searchForm.terminalIp"  @keyup.enter="onSearch">
          </el-input>
        </el-form-item>
        <el-form-item class="mr0">
          <el-button type="primary" @click="onSearch"
            ><el-icon class="el-icon--left"><Search /></el-icon>查询</el-button
          >
          <el-button type="primary" @click="onReset"
            ><el-icon class="el-icon--left"><RefreshLeft /></el-icon>
            重置</el-button
          >
          <!-- <el-button type="primary"
            ><el-icon class="el-icon--left"><Download /></el-icon
            >导出</el-button
          > -->
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrapper">
      <el-table
        v-loading="loading"
        :data="tableData"
        size="medium"
        border
        @sort-change="sortChange"
        @filter-change="filterChange"
      >
      <template v-for="item in columns">
        <el-table-column
          v-if="!item.needSlot"
          :key="item.key"
          :prop="item.prop"
          :label="item.label"
          :type="item.type"
          :sortable="item.sortable"
          :width="item.width"
          :min-width="item.minWidth"
          :filters="item.filters"
          :filter-multiple="item.filterMultiple"
          :column-key="item.columnKey"
        >
        </el-table-column>
        <el-table-column
          v-else
          :key="item.key"
          :prop="item.prop"
          :label="item.label"
          :type="item.type"
          :sortable="item.sortable"
          :width="item.width"
          :min-width="item.minWidth"
          :filters="item.filters"
          :filter-multiple="item.filterMultiple"
          :column-key="item.columnKey"
        >
          <template #default="scope">
            <div v-if="scope.column.columnKey === 'terminalType'">
              <span>{{ terminalTypeMap[scope.row.terminalType] }}</span>
            </div>
            <div v-if="scope.column.columnKey === 'operateType'">
              <span>{{ operateTypeMap[scope.row.operateType] }}</span>
            </div>
            <div v-if="scope.column.columnKey === 'operateTime'">
              <span>{{ moment(scope.row.operateTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
            </div>
          </template>
        </el-table-column>
      </template>
      </el-table>
    </div>
    <div class="pagination-wrapper">
      <el-pagination
        v-if="total"
        layout="total, sizes, prev, pager, next, jumper"
        background
        :current-page="pageNum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        :total="total"
        @size-change="sizeChange"
        @current-change="pageChange"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import { getOperationList } from '@/api/overhaul/logApi';

const terminalTypeOptions = [
  { text: "移动端", value: 1 },
  { text: "WEB端", value: 2 },
];
const operateTypeOptions = [
  { text: "新增", value: 1 },
  { text: "修改", value: 2 },
  { text: "删除", value: 3 },
  { text: '导入', value: 4 },
  { text: '导出', value: 5 },
  { text: '上传', value: 6 },
  { text: '下载', value: 7 }
];

export default {
  data() {
    return {
      searchForm: {
        operateTime: [
          moment().startOf("day").valueOf(),
          moment().endOf("day").valueOf(),
        ],
        operateUser: "",
        operateModel: "",
        terminalIp: "",
        operateType: ""
      },
      columns: [
        {
          label: "操作时间",
          key: "operateTime",
          prop: "operateTime",
          columnKey: "operateTime",
          sortable: true,
          needSlot: true
        },
        {
          label: "操作用户",
          key: "operateUser",
          prop: "operateUser",
        },
        {
          label: "终端IP",
          key: "terminalIp",
          prop: "terminalIp"
        },
        {
          label: "终端类型",
          key: "terminalType",
          prop: "terminalType",
          columnKey: "terminalType",
          needSlot: true,
          filters: terminalTypeOptions,
          filterMultiple: true
        },
        {
          label: "操作模块",
          key: "operateModel",
          prop: "operateModel"
        },
        {
          label: "操作类型",
          key: "operateType",
          prop: "operateType",
          needSlot: true,
          columnKey: "operateType",
          filters: operateTypeOptions,
          filterMultiple: true
        },
        {
          label: "操作入参",
          key: "operateParam",
          prop: "operateParam"
        },
        { label: "操作描述", key: "operateDesc", prop: "operateDesc" },
        { label: "操作结果", key: "operateResult", prop: "operateResult" },
        { label: "操作耗时", key: "operateCost", prop: "operateCost" }
      ],
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      sortInfo: {},
      filterInfo: {},
    };
  },
  computed: {
    terminalTypeMap() {
      let tempObj = {};
      terminalTypeOptions.map(item => {
        tempObj[item.value] = item.text;
      })
      return tempObj;
    },
    operateTypeMap() {
      let tempObj = {};
      operateTypeOptions.map(item => {
        tempObj[item.value] = item.text;
      })
      return tempObj;
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    moment,
    // 获取列表数据
    onSearch() {
      this.pageNum = 1;
      this.getData();
    },
    // 重置
    onReset() {
      this.searchForm = {
        operateTime: [
          moment().startOf("day").valueOf(),
          moment().endOf("day").valueOf(),
        ],
        operateUser: "",
        operateModel: "",
        terminalIp: "",
        operateType: ""
      }
      this.onSearch();
    },
    // 获取数据
    getData() {
      this.loading = true;
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        startTime: moment(this.searchForm.operateTime[0]).format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(this.searchForm.operateTime[1]).format('YYYY-MM-DD HH:mm:ss'),
        operateUser: this.searchForm.operateUser,
        terminalIp: this.searchForm.terminalIp,
        operateModel: this.searchForm.operateModel,
        ...this.filterInfo,
        ...this.sortInfo
      }
      getOperationList(params)
      .then(res => {
        if (res.success && res.data) {
          this.tableData = res.data.pageList || [];
          this.total = res.data.total;
        } else {
          this.$message.error(res.errMsg);
        }
      })
      .finally(() => {
        this.loading = false;
      })
    },
    // 列表排序
    sortChange({ column, prop, order }) {
      this.sortInfo = null;
      if (order && prop) {
        this.sortInfo = {
          sort: prop,
          sortType: order === "ascending" ? "ASC" : "DESC",
        };
      }
      this.pageNum = 1;
      this.getData();
    },
    // 列表筛选
    filterChange(filters) {
      let objKey = Object.keys(filters)[0];
      this.filterInfo[`${objKey}List`] = filters[objKey];
      this.pageNum = 1;
      this.getData();
    },
    // 每页条数发生变化
    sizeChange(size) {
      this.pageSize = size;
      this.pageNum = 1;
      this.getData();
    },
    // 页码发生变化
    pageChange(page) {
      this.pageNum = page;
      this.getData();
    },
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
::v-deep(.el-form-item) {
  margin-bottom: 0;
}
::v-deep(.el-table) {
  overflow: auto;
  width: 100%;
  height: 100%;
}
::v-deep(.el-table__header-wrapper) {
  position: sticky;
  top: 0;
  z-index: 10;
}
::v-deep(.el-table__body-wrapper) {
  height: calc(100% - 56px);
  width: 100%;
  overflow-y: auto;
}
.mr0 {
  margin-right: 0;
}
</style>
