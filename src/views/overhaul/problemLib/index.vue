<template>
  <div class="full-content">
    <!-- <div class="search-wrapper">
        <el-form :inline="true">
          <el-form-item label="模板名称">
            <el-input  v-model="searchKey"> </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"  icon="el-icon-search" @click="onSearch">查询</el-button>
            <el-button icon="el-icon-plus" type="primary"  @click="openModal(null, null, 'add')">新增</el-button>
          </el-form-item>
        </el-form>
      </div> -->
    <div class="table-wrapper">
      <el-table
        v-loading="loading"
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
          <template #default="scope">
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

// import { getTemplateList, editTemplate, deleteTemplate } from '@/api/templateLib';
import { Delete, View } from "@element-plus/icons-vue";
const columns = [
  { prop: "", label: "序号", width: "80", type: "index" },
  { prop: "orderName", label: "工单名称" },
  { prop: "ownership", label: "工序所属" },
  { prop: "submitTime", label: "提交时间", sortable: "custom" },
  { prop: "submitter", label: "复核提交人" },
];
export default {
  components: {
    PreviewModal,
    Delete,
    View,
  },
  data() {
    return {
      searchKey: "",
      columns: Object.freeze(columns),
      tableData: [
        {
          orderName: "测试工单",
          ownership: "A->B",
          submitTime: "2023-11-13 12:00:00",
          submitter: "测试人员",
        },
      ],
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 1,
      recordInfo: null,
      previewModalFlag: false,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    // 获取列表数据
    getData() {
      // this.loading = true;
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        docName: this.searchKey,
      };
      // getTemplateList(params)
      // .then(res => {
      //   if (res && res.success) {
      //     this.tableData = res.data.value || [];
      //     this.total = res.data.totalRows || 0;
      //   }
      // })
      // .finally(() => {
      //   this.loading = false;
      // })
    },
    // 搜索
    onSearch() {
      this.pageNum = 1;
      this.getData();
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
    // 排序
    sortChange() {},
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
    onDelete() {
      this.$confirm("此操作将永久删除该问题记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
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
  height: calc(100% - 32px);
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
::v-deep(.el-table__body-wrapper) {
  height: calc(100% - 56px);
  width: 100%;
  overflow-y: auto;
}
</style>
