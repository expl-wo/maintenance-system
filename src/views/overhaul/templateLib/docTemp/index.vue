<template>
  <div class="full-content">
    <div class="search-wrapper">
      <el-form :inline="true">
        <el-form-item label="模板名称">
          <el-input  v-model="searchKey"> </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            
            @click="onSearch"
            ><el-icon class="el-icon--left"><Search /></el-icon>查询</el-button
          >
          <el-button
            type="primary"
            
            @click="openModal(null, null, 'add')"
            ><el-icon class="el-icon--left"><Plus /></el-icon>新增</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrapper">
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        fit
        highlight-current-row
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
            <template  #default="scope">
              <span>{{ docTypeList[scope.row.type] }}</span>
            </template>
          </el-table-column>
        </template>

        <el-table-column label="操作" width="240">
          <template  #default="scope">
            <el-button-group>
              <el-button
                title="预览"
                type="primary"
                @click="openModal(scope.$index, scope.row, 'preview')"
              ><el-icon><Platform /></el-icon
              > </el-button>
              <el-button
                title="预览"
                type="primary"
                @click="openModal(scope.$index, scope.row, 'add')"
              > <el-icon><Edit /></el-icon
              ></el-button>
              <el-button
                title="复制"
                type="primary"
                @click="openModal(scope.$index, scope.row, 'copy')"
              > <el-icon><DocumentCopy /></el-icon
              ></el-button>
              <el-button
                title="删除"
                type="danger"
                @click="onDelete(scope.$index, scope.row)"
              >  <el-icon><Delete /></el-icon
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
    <preview-modal
      :visible="previewModalFlag"
      :info="recordInfo"
      @closeModal="closeModal"
    />
    <copy-modal
      :visible="copyModalFlag"
      :info="recordInfo"
      @closeModal="closeModal"
    />
  </div>
</template>
<script>
import AddModal from "./components/addModal";
import PreviewModal from "./components/previewModal";
import CopyModal from "./components/copyModal";
import {
  Delete,
  Edit,
  Search,
  Plus,
  DocumentCopy,
  Platform
} from "@element-plus/icons-vue";
import {
  getTempData,
  deleteTemplate,
  getTemplateTypeList,
  getTemplateById,
} from "@/api/overhaul/templateLib";

const columns = [
  { prop: "", label: "序号", width: "80", type: "index" },
  { prop: "name", label: "模板名称" },
  { prop: "templateType", label: "模板类型", needSlot: true },
  { prop: "createrName", label: "创建人" },
  { prop: "updateTime", label: "更新时间", sortable: "custom" },
];
export default {
  components: {
    AddModal,
    PreviewModal,
    CopyModal,
    Delete,
    Edit,
    Platform,
    Search,
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
      sortInfo: {},
      docTypeList: [],
    };
  },
  async mounted() {
    let res = await getTemplateTypeList();
    if (res.success) {
      this.docTypeList = res.data || [];
    }
    this.getData();
  },
  methods: {
    // 获取列表数据
    getData() {
      this.loading = true;
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        docName: this.searchKey,
      };
      getTempData(params)
        .then((res) => {
          if (res && res.success) {
            this.tableData = res.data.pageList || [];
            this.total = res.data.total || 0;
          } else {
            this.$message.error(res.errMsg || '数据获取失败');
          }
        })
        .catch(() => {
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
    // 打开弹框
    async openModal(index, record, type) {
      if (!record && type === "add") {
        this.recordInfo = null;
      } else {
        let params = { docId: record.docId };
        let res = await getTemplateById(params);
        if (res.success) {
          this.recordInfo = res.data || record;
        }
      }
      this[`${type}ModalFlag`] = true;
    },
    // 关闭弹框
    closeModal(type, flag) {
      this[`${type}ModalFlag`] = false;
      this.recordInfo = null;
      flag && this.getData();
    },
    // 删除
    onDelete(index, row) {
      this.$confirm("此操作将永久删除该模板, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            docId: row.docId,
          };
          deleteTemplate(params).then((res) => {
            if (res.success) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getData();
            } else {
              this.$message.error(res.errMsg || '操作失败');
            }
          });
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
