<template>
  <div class="full-content">
    <div class="search-wrapper">
      <el-form :inline="true">
        <el-form-item label="模板名称">
          <el-input  v-model="searchKey" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="onSearch">
            <el-icon class="el-icon--left"><Search /></el-icon> 查询</el-button
          >
          <el-button
            type="primary"
            
            @click="openModal(null, null, 'add')"
          >
            <el-icon class="el-icon--left"><Plus /></el-icon>新增</el-button
          >
          <!-- <el-button icon="Delete" type="danger"  :disabled="disabled" @click="batchDelete">删除</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrapper">
      <el-table
        ref="deviceTempTable"
        v-loading="loading"
        :data="tableData"
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
        >
        </el-table-column>
        <el-table-column label="操作" width="240">
          <template  #default="scope">
            <el-button-group>
              <el-button
                type="primary"
                title="查看"
                @click="openModal(scope.$index, scope.row, 'preview')"
              >
                <el-icon><View /></el-icon
              ></el-button>
              <el-button
                type="primary"
                title="编辑"
                @click="openModal(scope.$index, scope.row, 'add')"
              >
                <el-icon><Edit /></el-icon
              ></el-button>
              <el-button
                type="primary"
                title="复制"
                @click="openModal(scope.$index, scope.row, 'copy')"
                ><el-icon><DocumentCopy /></el-icon
              ></el-button>
              <el-button
                type="danger"
                title="删除"
                @click="singleDel(scope.$index, scope.row)"
                ><el-icon><Delete /></el-icon
              ></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-wrapper" v-if="total">
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
    <add-modal
      :visible="addModalFlag"
      :info="recordInfo"
      @closeModal="closeModal"
    />
    <copy-modal
      :visible="copyModalFlag"
      :info="recordInfo"
      @closeModal="closeModal"
    />
    <preview-modal
      :visible="previewModalFlag"
      :info="recordInfo"
      @closeModal="closeModal"
    />
  </div>
</template>
<script>
import AddModal from "./components/addModal";
import CopyModal from "./components/copyModal";
import PreviewModal from "./components/previewModal";
import {
  Delete,
  Edit,
  Search,
  View,
  Plus,
  DocumentCopy,
} from "@element-plus/icons-vue";
import {
  getDeviceTempList,
  delDeviceTemp,
  getDeviceTempById,
} from "@/api/overhaul/templateLib";

const columns = [
  { type: "selection", width: "55" },
  { prop: "", label: "序号", width: "80", type: "index" },
  { prop: "templateName", label: "模板名称" },
  { prop: "creator", label: "创建人" },
  { prop: "updateTime", label: "更新时间", sortable: "custom" },
];
export default {
  components: {
    AddModal,
    CopyModal,
    PreviewModal,
    Delete,
    Edit,
    Search,
    View,
    Plus,
    DocumentCopy,
  },
  data() {
    return {
      searchKey: "",
      columns: Object.freeze(columns),
      tableData: [],
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      addModalFlag: false,
      recordInfo: null,
      previewModalFlag: false,
      copyModalFlag: false,
      selectList: [],
      sortInfo: {},
    };
  },
  computed: {
    disabled() {
      return !this.selectList.length;
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    // 获取列表数据
    getData() {
      this.selectList = [];
      this.$refs.deviceTempTable && this.$refs.deviceTempTable.clearSelection();
      this.loading = true;
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        templateName: this.searchKey,
        ...this.sortInfo,
      };
      console.log(params);
      getDeviceTempList(params)
        .then((res) => {
          if (res.success && res.data) {
            this.tableData = res.data.pageList || [];
            this.total = res.data.total;
          }
        })
        .catch((err) => {
          this.tableData = [];
          this.total = 0;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 搜索
    onSearch() {
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
    // 排序
    sortChange({ column, prop, order }) {
      this.sortInfo = {};
      if (order && prop) {
        this.sortInfo = {
          sort: prop,
          sortType: order === "ascending" ? "ASC" : "DESC",
        };
      }
      this.pageNum = 1;
      this.getData();
    },
    // 表格选中
    selectionChange(val) {
      this.selectList = val;
    },
    // 打开弹框
    async openModal(index, record, type) {
      if (!record && type === "add") {
        this.recordInfo = null;
      } else {
        let params = { templateId: record.templateId };
        let res = await getDeviceTempById(params);
        if (res.success) {
          this.recordInfo = res.data || record;
        }
      }
      this[`${type}ModalFlag`] = true;
    },
    // 关闭弹框
    closeModal(type, flag) {
      this[`${type}ModalFlag`] = false;
      flag && this.getData();
    },
    // 批量删除
    batchDelete() {
      this.delDeviceTemp(this.selectList.map((item) => item.templateId));
    },
    // 单个删除
    singleDel(index, row) {
      this.delDeviceTemp(row.templateId);
    },
    // 删除
    delDeviceTemp(id) {
      this.$confirm("此操作将永久删除所选模板, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let params = { templateId: id };
        delDeviceTemp(params)
          .then((res) => {
            if (res.success) {
              this.$message.success("操作成功");
              this.getData();
            }
          })
          .catch(() => {
            this.$message.error("操作失败");
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
