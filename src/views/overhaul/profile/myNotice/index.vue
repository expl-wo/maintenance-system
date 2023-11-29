<template>
  <div class="full-content">
    <div class="search-wrapper">
      <el-form :inline="true">
        <el-form-item label="通知接收时间">
          <el-date-picker
            v-model="searchForm.receiveTime"
            
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="通知标题">
          <el-input
            
            placeholder="请输入"
            v-model="searchForm.searchKey"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="onSearch"
            ><el-icon class="el-icon--left"><Search /></el-icon>查询</el-button
          >
          <el-button
            type="primary"
            
            :disabled="disabled"
            @click="markAll(true)"
            >全部标记为已读</el-button
          >
          <el-button
            type="primary"
            
            :disabled="disabled"
            @click="markAll(false)"
            >全部标记为未读</el-button
          >
          <el-button type="primary"  @click="searchAll"
            >搜索所有通知</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrapper">
      <el-table
        ref="noticeTable"
        v-loading="loading"
        size="medium"
        border
        :data="tableData"
        :highlight-current-row="true"
        :highlight-selection-row="true"
        @sort-change="sortChange"
        @selection-change="selectionChange"
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
            <template  #default="scope">
              <div v-if="scope.column.columnKey === 'status'">
                <span>{{ scope.row.status === 0 ? "未读" : "已读" }}</span>
                <span class="mark-btn mark" @click="mark(scope.row)"
                  >标为{{ scope.row.status ? "未读" : "已读" }}</span
                >
              </div>
            </template>
          </el-table-column>
        </template>
        <el-table-column label="操作" width="100">
          <template  #default="scope">
            <el-button-group>
              <el-button
                type="primary"
                title="查看"
                @click="watchDeatail(scope.row)"
                ><el-icon><View /></el-icon
              ></el-button>
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
        @current-change="pageChange"
      >
      </el-pagination>
    </div>
    <detail-modal
      :visible="detailModalFlag"
      :info="recordInfo"
      @closeModal="closeModal"
    />
  </div>
</template>
<script>
import DetailModal from "./components/detailModal.vue";
import moment from "moment";
import { Search, View } from "@element-plus/icons-vue";
const statusOptions = [
  { value: 0, text: "未读" },
  { value: 1, text: "已读" },
];
const typeOptions = [
  { value: 0, text: "复核任务" },
  { value: 1, text: "工单管理" },
];
export default {
  components: {
    DetailModal,
    Search,
    View,
  },
  data() {
    return {
      searchForm: {
        receiveTime: [
          moment().startOf("day").subtract(1, "month").valueOf(),
          moment().endOf("day").valueOf(),
        ],
        searchKey: "",
      },
      columns: [
        { type: "selection", width: "55" },
        { prop: "title", key: "title", label: "通知标题", minWidth: "160px" },
        {
          prop: "source",
          key: "source",
          label: "通知来源",
          minWidth: "100px",
          needSlot: false,
        },
        {
          prop: "handleDate",
          key: "handleDate",
          label: "通知接收时间",
          sortable: "custom",
          minWidth: "100px",
          needSlot: false,
        },
        {
          prop: "type",
          key: "noticeType",
          label: "通知类型",
          minWidth: "160px",
          columnKey: "type",
          filters: typeOptions,
          needSlot: false,
        },
        {
          prop: "status",
          key: "status",
          label: "通知状态",
          minWidth: "100px",
          columnKey: "status",
          filters: statusOptions,
          needSlot: true,
        },
      ],
      loading: false,
      tableData: [
        {
          id: 1,
          title: "测试通知标题1",
          source: "测试来源1",
          handleDate: "2023-11-01 12:00:00",
          type: "复核任务",
          status: 0,
        },
        {
          id: 2,
          title: "测试通知标题2",
          source: "测试来源2",
          handleDate: "2023-11-01 12:00:00",
          type: "复核任务",
          status: 1,
        },
      ],

      pageNum: 1,
      pageSize: 10,
      total: 100,
      selectList: [],
      sortInfo: {},
      filterInfo: {},
      detailModalFlag: false,
      recordInfo: null,
    };
  },
  computed: {
    disabled() {
      return !this.selectList.length;
    },
  },
  methods: {
    //
    formatterStatus(row, column, cellValue, index) {
      debugger;
    },
    // 查询列表数据
    getData() {
      this.selectList = [];
      // 清除表格选中行
      this.$refs.noticeTable && this.$refs.noticeTable.clearSelection();
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        searchKey: this.searchForm.searchKey,
        startTime: moment(this.searchForm.receiveTime[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        endTime: moment(this.searchForm.receiveTime[1]).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        ...this.sortInfo,
        ...this.filterInfo,
      };
      console.log("我的通知----", params);
    },
    // 搜索
    onSearch() {
      this.pageNum = 1;
      this.getData();
    },
    // 标记
    mark(row) {
      debugger;
    },
    // 标记所有通知
    markAll(flag) {
      let unReadData = this.selectList.filter((item) => item.status === 0);
      // 标记已读
      if (flag && !unReadData.length) {
        this.$message.warning("没有需要标注为已读的通知，请重新选择");
        return;
      }
      if (!flag && unReadData.length === this.selectList.length) {
        this.$message.warning("没有需要标注为未读的通知，请重新选择");
        return;
      }
      // TODO
    },
    // 搜索所有通知
    searchAll() {
      //
    },
    // 列表排序
    sortChange({ column, prop, order }) {
      debugger;
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
      this.filterInfo[objKey] = filters[objKey];
      this.pageNum = 1;
      this.getData();
    },
    // 列表选中
    selectionChange(val) {
      this.selectList = val;
    },
    // 查看通知详情
    watchDeatail(record) {
      this.recordInfo = record;
      this.detailModalFlag = true;
    },
    // 关闭详情框
    closeModal() {
      this.detailModalFlag = false;
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
  .el-table__body tr:hover {
    .mark-btn {
      display: inline;
    }
  }
}
.pagination-wrapper {
}
.search-wrapper :deep(.el-form-item) {
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
:deep(.el-table__column-filter-trigger) {
  padding-left: 8px;
  .el-icon-arrow-down {
    transform: scale(1.5);
  }
}
:deep(.el-table__header) tr th {
  background-color: rgba(102, 102, 102, 0.1);
}
:deep(.el-table__body-wrapper) {
  height: calc(100% - 56px);
  width: 100%;
  overflow-y: auto;
}
</style>
