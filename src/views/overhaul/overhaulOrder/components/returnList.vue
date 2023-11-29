<template>
  <div class="app-container order-list-box" v-if="!showInfo">
    <el-row class="mrb15" type="flex" align="middle" justify="start">
      <el-button  type="primary" @click="getList">
        <el-icon  class="el-icon--left"><Refresh /></el-icon> 根据BOM同步
      </el-button>
      <el-button  type="primary" @click="getList">
        <el-icon  class="el-icon--left"><Download /></el-icon> 导出
      </el-button>
    </el-row>
    <el-table
      :data="tableData"
      v-loading="listLoading"
      stripe
      
      style="width: 100%"
      height="510px"
    >
      <template v-for="item in RETURN_COLUMNS">
        <el-table-column
          :key="item.prop"
          v-bind="item"
          v-if="item.prop === 'operation'"
        >
          <template #default="{ row }">
            <el-button  type="primary" title="复核">
              <el-icon ><Stamp /></el-icon>
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
              {{ row.status | statusFilter }}
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
   
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // 分页
import { RETURN_COLUMNS, BOM_STATUS } from "../config.js";
import { Download, Refresh, Stamp } from "@element-plus/icons-vue";
export default {
  name: "ReturnList",
  components: {
    Pagination,
    Download,
    Refresh,
    Stamp,
  },
  filters: {
    statusFilter(status) {
      return BOM_STATUS[status];
    },
  },
  data() {
    return {
      RETURN_COLUMNS: Object.freeze(RETURN_COLUMNS),
      listLoading: true,
      tableData: [],
      //分页参数
      pageOptions: {
        total: 1,
        pageNum: 1,
        pageSize: 20,
      },
      //查询参数
      queryParams: {
        deviceName: "",
      },
      dialogStatus: "add",
      operateRow: null, //操作行
    };
  },
  created() {
    this.getList();
  },
  methods: {

    /**
     * 关闭弹窗
     */
    closeModal(modeName, isSearch = false) {
      this[modeName] = false;
      isSearch && this.getList();
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
      this.listLoading = false;
      new Array(10).fill(1).forEach((item, index) => {
        this.tableData.push({
          id: index,
          productNumber: "123132321",
          materialName: "物料名称",
          pipelineCode: "4564646456",
          classifyName: "hhhh",
          status: 1,
          demo: "2023-10-23 12:00:00",
        });
      });
      this.pageOptions.total = 1;
    },
  },
};
</script>
<style scoped lang="scss">
:deep(.pagination-container) {
  padding: 0;
}
.mrb15 {
  margin-bottom: 15px;
}
</style>
