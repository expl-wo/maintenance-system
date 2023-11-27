<template>
  <div class="full-content">
    <div class="search-wrapper">
      <el-form :inline="true">
        <el-form-item label="任务接收时间">
          <el-date-picker
            v-model="searchForm.receiveTime"
            
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="工单名">
          <el-input
            
            placeholder="请输入"
            v-model="searchForm.searchKey"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="onSearch"><el-icon class="el-icon--left"><Search /></el-icon>查询</el-button>
          <el-button type="primary"  @click="searchAll">搜索所有任务</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrapper">
      <el-table
        ref="taskTable"
        v-loading="loading"
        size="medium"
        border
        :data="tableData"
        :highlight-current-row="true"
        :highlight-selection-row="true"
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
            <span v-if="scope.column.columnKey === 'type'">{{ typeMap[scope.row.type] }}</span>
            <span v-if="scope.column.columnKey === 'status'">{{ statusMap[scope.row.status] }}</span>
          </template>
          </el-table-column>
        </template>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button-group>
              <el-button type="primary" title="查看" @click="jumpTo(scope.row)">
                <el-icon><View /></el-icon>
              </el-button>
            </el-button-group>
          </template>
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
        @size-change="sizeChange"
        @current-change="pageChange">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { Search,View } from "@element-plus/icons-vue";
import moment from 'moment'

const statusOptions = [
  { value: 0, text: '未完成' },
  { value: 1, text: '完成' }
]
const typeOptions = [
  { value: 0, text: '文档审批' },
  { value: 1, text: '复核' },
  { value: 2, text: '工序执行' }
]
export default {
  components:{
    Search,
    View
  },
  data() {
    return {
      searchForm: {
        receiveTime: [moment().startOf('day').subtract(1, 'month').valueOf(), moment().endOf('day').valueOf()],
        searchKey: ''
      },
      columns: [
        { prop: 'name', key: 'name', label: '工单名', minWidth: '160px' },
        { prop: 'type', key: 'type', label: '任务类型', minWidth: '160px', columnKey: 'type', filters: typeOptions, needSlot: true },
        { prop: 'location', key: 'location', label: '任务位置', minWidth: '200px' },
        { prop: 'time', key: 'time', label: '任务接收时间', sortable: 'custom', minWidth: '100px' },
        { prop: 'status', key: 'status', label: '任务状态', minWidth: '100px', columnKey: 'status', filters: statusOptions, needSlot: true }
      ],
      loading: false,
      tableData: [
        { id: 1, name: '检修任务1', time: '2023-11-01 12:00:00', location: '车间一', type: 0, status: 0 },
        { id: 2, name: '检修任务2', time: '2023-11-01 12:30:00', location: '车间二', type: 1, status: 1 }
      ],
      pageNum: 1,
      pageSize: 10,
      total: 100,
      sortInfo: {},
      filterInfo: {},
    }
  },
  computed: {
    statusMap() {
      let resultObj = {};
        statusOptions.map(item => {
          resultObj[item.value] = item.text;
        })
        return resultObj;
    },
    typeMap() {
      let resultObj = {};
        typeOptions.map(item => {
          resultObj[item.value] = item.text;
        })
        return resultObj;
    }
  },
  methods: {
    // 查询列表数据
    getData() {
      this.selectList = [];
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        searchKey: this.searchForm.searchKey,
        startTime: moment(this.searchForm.receiveTime[0]).format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(this.searchForm.receiveTime[1]).format('YYYY-MM-DD HH:mm:ss'),
        ...this.sortInfo,
        ...this.filterInfo
      }
      console.log('我的通知----', params);
    },
    // 搜索
    onSearch() {
      this.pageNum = 1;
      this.getData();
    },
    // 搜索所有任务
    searchAll() {
      //
    },
    // 列表排序
    sortChange({column, prop, order}) {
      debugger;
      this.sortInfo = null;
      if (order && prop) {
        this.sortInfo = {
          sort: prop,
          sortType: order === 'ascending' ? 'ASC' : 'DESC'
        }
      }
      this.pageNum = 1;
      this.getData();
    },
    // 列表筛选
    filterChange(filters) {
      let objKey = Object.keys(filters)[0];
      this.filterInfo[objKey] = filters[objKey];
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
    // 跳转
    jumpTo(row) {
      debugger;
    }
  }
}
</script>
<style lang="scss" scoped>
.full-content {
  width: 100%;
  height: 100%;
  padding: 20px;
}
.table-wrapper {
  position: relative;
  width: 100%;
  height: calc(100% - 84px);
  margin-top: 12px;
  .mark {
    padding-left: 12px;
    color: #1890ff;
    cursor: pointer;
  }
  .mark-btn {
    display: none;
  }
  .el-table__body tr:hover{
    .mark-btn {
      display: inline;
    }
  }
}
.search-wrapper ::v-deep(.el-form-item) {
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
::v-deep(.el-table__column-filter-trigger) {
  padding-left: 8px;
  .el-icon-arrow-down {
    transform: scale(1.5);
  }
}
::v-deep(.el-table__header) tr th {
  background-color: rgba(102, 102, 102, 0.1);
}
::v-deep(.el-table__body-wrapper) {
  height: calc(100% - 56px);
  width: 100%;
  overflow-y: auto;
}
</style>
