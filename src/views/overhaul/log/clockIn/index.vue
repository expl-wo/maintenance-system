<template>
  <div class="full-content">
    <div class="table-top">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="searchForm.userName" @keyup.enter="onSearch">
          </el-input>
        </el-form-item>
        <el-form-item label="工号">
          <el-input v-model="searchForm.userId" @keyup.enter="onSearch">
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
        v-loading="loading"
        border
        @sort-change="sortChange"
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
              <div v-if="scope.column.columnKey === 'clockInTime'">
                <span>{{ moment(scope.row.clockInTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
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
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { Search, RefreshLeft } from "@element-plus/icons-vue";
import { getClockInList } from '@/api/overhaul/logApi';
import moment from "moment";

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
        userId: "",
        signInTime: [
          moment().startOf("day").valueOf(),
          moment().endOf("day").valueOf(),
        ]
      },
      columns: [
        { prop: "", label: "序号", width: "80", type: "index" },
        { label: "姓名", key: "userName", prop: "userName", width: "120" },
        { label: "工号", key: "userId", prop: "userId", width: "120" },
        {
          label: "所属部门",
          key: "userDepartment",
          prop: "userDepartment"
        },
        { label: "签到时间", key: "clockInTime", prop: "clockInTime", sortable: 'custom', columnKey: "clockInTime", needSlot: true },
        {
          label: "签到地点",
          key: "clockInAddress",
          prop: "clockInAddress"
        },
        {
          label: "所在项目编号",
          key: "clockInProjNo",
          prop: "clockInProjNo",
          // sortable: 'custom'
        },
        {
          label: "所在项目名称",
          key: "clockInProjName",
          prop: "clockInProjName"
        }
      ],
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      sortInfo: {}
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    moment,
    onSearch() {
      this.pageNum = 1;
      this.getData();
    },
    onReset() {
      this.searchForm = {
        userName: "",
        userId: "",
        signInTime: [
          moment().startOf("day").valueOf(),
          moment().endOf("day").valueOf(),
        ]
      }
      this.pageNum = 1;
      this.getData();
    },
    // 获取数据
    getData() {
      this.loading = true;
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        userName: this.searchForm.userName,
        userId: this.searchForm.userId,
        startTime: moment(this.searchForm.signInTime[0]).format("YYYY-MM-DD HH:mm:ss"),
        endTime: moment(this.searchForm.signInTime[1]).format("YYYY-MM-DD HH:mm:ss"),
        ...this.sortInfo
      }
      getClockInList(params)
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