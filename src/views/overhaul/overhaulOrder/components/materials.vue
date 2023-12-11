<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="材料名称">
        <el-input
          v-model="queryParams.name"
          clearable
          @keyup.enter="handleFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">
          <el-icon class="el-icon--left"><Search /></el-icon> 查询
        </el-button></el-form-item
      >
    </el-form>
    <el-table
      :data="tableData"
      v-loading="listLoading"
      stripe
      style="width: 100%"
      height="610px"
    >
      <template v-for="item in COLUMNS">
        <el-table-column
          :key="item.prop"
          v-bind="item"
          v-if="item.prop === 'operation'"
        >
          <template #default="{ row }">
            <el-button
              type="primary"
              title="编辑数量"
              @click="openModal(row, 'editModal')"
            >
              <el-icon><Edit /></el-icon>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.prop === 'status'"
          :label="item.label"
          :key="item.prop"
          class-name="status-col"
          width="100"
        >
          <template #default="{ row }">
            <el-tag>
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          :key="item.prop"
          v-bind="item"
          v-else
        ></el-table-column>
      </template>
    </el-table>
    <pagination
      v-show="pageOptions.total"
      :total="pageOptions.total"
      :page="pageOptions.pageNum"
      :limit="pageOptions.pageSize"
      @pagination="pageChange"
    />
    <el-dialog
      title="编辑"
      :model-value="editModal"
      width="400"
      :destroy-on-close="true"
      @close="closeModal('editModal')"
    >
      <el-form :inline="true" ref="dataForm" :model="form">
        <el-form-item label="数量">
          <el-input-number v-model="form.num" :min="0" :max="100000" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
          <el-button @click.stop="closeModal('editModal')"> 取消 </el-button>
          <el-button type="primary" @click="updateNum"> 保存 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // 分页
import { getMaterials, editMaterialsNum } from "@/api/overhaul/workOrderApi.js";
import { MATERIALS_COLUMNS } from "../config.js";
export default {
  name: "Materials",
  components: {
    Pagination,
  },
  props: {
    //当前工单的详情
    workOrderInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    sceneType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      COLUMNS: Object.freeze(MATERIALS_COLUMNS),
      listLoading: true,
      tableData: [],
      //分页参数
      pageOptions: {
        total: 0,
        pageNum: 1,
        pageSize: 20,
      },
      //查询参数
      queryParams: {
        name: "",
      },
      form: {
        num: 1,
      },
      editModal: false,
      operateRow: null, //操作行
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleFilter() {
      this.pageOptions.pageNum = 1;
      this.getList();
    },
    /**
     * 关闭弹窗
     */
    closeModal(modeName, isSearch = false) {
      this[modeName] = false;
      isSearch && this.getList();
    },
    updateNum() {
      editMaterialsNum({
        changeId: this.operateRow.materialId,
        changeNum: this.form.num,
      }).then((res) => {
        if (res.code !== "0") {
          this.$message.error(res.errMsg);
        } else {
          this.$message.success("保存成功！");
          this.closeModal("closeModal", true);
        }
      });
    },
    /**
     * 打开弹窗
     */
    openModal(row = null, modeName) {
      this.operateRow = row;
      this[modeName] = true;
    },
    //分页发生改变时
    pageChange({ limit, page }) {
      this.pageOptions.pageNum = page;
      if (limit) {
        this.pageOptions.pageSize = limit;
      }
      this.getList();
    },
    getList() {
      this.listLoading = true;
      getMaterials({
        pageNum: this.pageOptions.pageNum,
        pageSize: this.pageOptions.pageSize,
        workCode: this.workOrderInfo.id,
        workOrderSceneType: this.sceneType,
        searchInfo: this.queryParams.name,
      }).then((res) => {
        const { total, pageList } = res.data;
        this.tableData = pageList || [];
        this.pageOptions.total = total;
        this.listLoading = false;
      });
    },
  },
};
</script>
<style scoped lang="scss">
::v-deep(.pagination-container) {
  padding: 0;
}
.mrb15 {
  margin-bottom: 15px;
}
</style>
