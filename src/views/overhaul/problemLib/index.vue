<template>
  <div class="full-content">
    <div class="search-wrapper">
        <el-form :inline="true">
          <el-form-item label="工单名">
            <el-input  v-model="searchKey" @keyup.enter="onSearch" />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="recordTime"
              :clearable="false"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch"><el-icon class="el-icon--left"><Search /></el-icon>查询</el-button>
            <el-button type="primary" @click="onReset"><el-icon class="el-icon--left"><RefreshLeft /></el-icon>重置</el-button>
            <el-button type="danger" :disabled="disabled" @click="batchDelete"><el-icon class="el-icon--left"><Delete /></el-icon
              >删除</el-button>
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
        @selection-change="selectionChange"
      >
        <el-table-column
          v-for="item in columns"
          :key="item.key"
          :prop="item.prop"
          :label="item.label"
          :type="item.type"
          :sortable="item.sortable"
          :width="item.width"
          :filters="item.filters"
          :filter-multiple="item.filterMultiple"
          :column-key="item.columnKey"
          :filter-method="item.filterHandler"
        >
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template  #default="scope">
            <el-button-group>
              <el-button
                type="primary"
                @click="openModal(scope.$index, scope.row, 'preview')"
              >
                <el-icon><View /></el-icon>
              </el-button>
              <el-button
                type="danger"
                @click="onDelete(scope.$index, scope.row)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
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
    <preview-modal
      :visible="previewModalFlag"
      :info="recordInfo"
      @closeModal="closeModal"
    />
  </div>
</template>
<script>
import PreviewModal from "./components/previewModal";
import moment from 'moment';
import { getProblemList, delProblem } from '@/api/overhaul/problemLabApi';
const columns = [
  { type: 'selection', width: '55' },
  { prop: "createTime", label: "创建时间", sortable: "custom" },
  { prop: "reviewer", label: "复核提交人" },
  { prop: "workOrderName", label: "工单名称" },
  { prop: "processOwnerShip", label: "工序所属" }
];
export default {
  components: {
    PreviewModal
  },
  data() {
    return {
      searchKey: "",
      recordTime: [
        moment().startOf("day").valueOf(),
        moment().endOf("day").valueOf(),
      ],
      columns: Object.freeze(columns),
      tableData: [],
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      recordInfo: null,
      previewModalFlag: false,
      sortInfo: {},
      selectList: []
    };
  },
  computed: {
    disabled() {
      return !this.selectList.length;
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    // 获取列表数据
    getData() {
      this.selectList = [];
      this.loading = true;
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        searchKey: this.searchKey,
        startTime: moment(this.recordTime[0]).format("YYYY-MM-DD HH:mm:ss"),
        endTime: moment(this.recordTime[1]).format("YYYY-MM-DD HH:mm:ss"),
        ...this.sortInfo
      };
      getProblemList(params)
      .then(res => {
        if (res && res.success) {
          this.tableData = res.data.pageList || [];
          this.total = res.data.total || 0;
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
    // 重置
    onReset() {
      this.searchKey = "";
      this.recordTime = [
        moment().startOf("day").valueOf(),
        moment().endOf("day").valueOf(),
      ];
      this.onSearch();
    },
    // 批量删除
    batchDelete() {
      this.delProblem(this.selectList.map(item => item.id));
    },
    // 删除
    delProblem(list) {
      let params = {id: list};
      delProblem(params)
      .then(res => {
        if (res.success) {
            this.$message.success('操作成功');
            this.getData();
          } else {
            this.$message.error(res.errMsg);
          }
      })
    },
    // 表格选中
    selectionChange(val) {
      this.selectList = val;
    },
    sizeChange(size) {
      this.pageSize = size;
      this.pageNum = 1;
      this.getData();
    },
    pageChange(page) {
      this.pageNum = page;
      this.getData();
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
    // 打开弹框
    openModal(index, record, type) {
      this.recordInfo = record;
      this[`${type}ModalFlag`] = true;
    },
    // 关闭弹框
    closeModal(type, flag) {
      this[`${type}ModalFlag`] = false;
      flag && this.getData();
    },
    // 删除
    onDelete(index, row) {
      this.$confirm("此操作将永久删除该问题记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {
        this.delProblem([row.id]);
      })
      .catch(() => {});
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
:deep(.el-table__body-wrapper) {
  height: calc(100% - 56px);
  width: 100%;
  overflow-y: auto;
}
</style>
