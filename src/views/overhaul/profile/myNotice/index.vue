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
          <!-- <el-button type="primary"  @click="searchAll"
            >搜索所有通知</el-button
          > -->
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrapper">
      <el-table
        ref="noticeTable"
        v-loading="loading"
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
            <template #default="scope">
              <div v-if="scope.column.columnKey === 'noticeStatus'">
                <span>{{ scope.row.noticeStatus === 0 ? "未读" : "已读" }}</span>
                <span class="mark-btn mark" @click="mark(scope.row)"
                  >标为{{ scope.row.noticeStatus ? "未读" : "已读" }}</span
                >
              </div>
              <div v-if="scope.column.columnKey === 'noticeType'">
                <span>{{ typeMap[scope.row.noticeType] }}</span>
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
    <div v-if="total" class="pagination-wrapper">
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
import { getNoticeList, markNotice } from '@/api/overhaul/profileApi';
const statusOptions = [
  { value: 0, text: "未读" },
  { value: 1, text: "已读" },
];
const typeOptions = [
  { value: 1, text: "任务通知" },
  { value: 2, text: "超时通知" },
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
        {
          prop: "createTime",
          key: "createTime",
          label: "通知接收时间",
          sortable: "custom",
          minWidth: "100px",
          needSlot: false,
        },
        {
          prop: "noticeType",
          key: "noticeType",
          label: "通知类型",
          minWidth: "80px",
          columnKey: "noticeType",
          filters: typeOptions,
          needSlot: true,
        },
        {
          prop: "noticeContent",
          key: "noticeContent",
          label: "通知内容",
          minWidth: "160px"
        },
        {
          prop: "noticeStatus",
          key: "noticeStatus",
          label: "通知状态",
          minWidth: "100px",
          columnKey: "noticeStatus",
          filters: statusOptions,
          needSlot: true,
        },
      ],
      loading: false,
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
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
    typeMap() {
      let tempObj = {};
      typeOptions.forEach(item => {
        tempObj[item.value] = item.text;
      })
      return tempObj;
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    // 查询列表数据
    getData() {
      this.selectList = [];
      // 清除表格选中行
      this.$refs.noticeTable && this.$refs.noticeTable.clearSelection();
      this.loading = true;
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
      getNoticeList(params)
      .then(res => {
        if (res.success && res.data) {
          this.tableData = res.data.pageList || [];
          this.total = res.data.total || 0;
        } else {
          this.$message.error(res.errMsg);
        }
      })
      .finally(() => {
        this.loading = false;
      })
    },
    // 搜索
    onSearch() {
      this.pageNum = 1;
      this.getData();
    },
    // 标记
    mark(row) {
      this.markNotice([row.id], !row.noticeStatus);
    },
    // 标记所有通知
    markAll(flag) {
      let unReadData = this.selectList.filter((item) => item.noticeStatus === 0);
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
      this.markNotice(this.selectList.map(item => item.id), flag);
    },
    // 标记通知
    markNotice(idList, flag) {
      let params = {
        idList,
        noticeStatus: +flag
      }
      markNotice(params)
      .then(res => {
        if (res.success) {
          this.$message.success('操作成功');
          this.getData();
        } else {
          this.$message.error('操作失败');
        }
      })
    },
    // 搜索所有通知
    // searchAll() {
    //   //
    // },
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
// :deep(.el-table__header-wrapper) {
//   position: sticky;
//   top: 0;
//   z-index: 10;
// }
:deep(.el-table__column-filter-trigger) {
  padding-left: 8px;
  .el-icon-arrow-down {
    transform: scale(1.5);
  }
}
// :deep(.el-table__header) tr th {
//   background-color: rgba(102, 102, 102, 0.1);
// }
:deep(.el-table__body-wrapper) {
  height: calc(100% - 56px);
  width: 100%;
  overflow-y: auto;
}
</style>
