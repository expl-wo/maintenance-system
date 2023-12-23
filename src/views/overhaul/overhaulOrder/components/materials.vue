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
          v-if="item.prop === 'materialNum'"
          :key="item.prop"
          v-bind="item"
        >
          <template #default="{ row }">
            <el-input-number
              v-model="row.materialNum"
              :min="0"
              :max="10000000"
              :value-on-clear="0"
            />
          </template>
        </el-table-column>
        <el-table-column
          :key="item.prop"
          v-bind="item"
          v-else-if="item.prop === 'operation'"
        >
          <template #default="{ row }">
            <el-button
              v-if="$isAuth(`2005_${onlyTabName.split('-')[0]}_materials_edit`)"
              :disabled="
                [
                  COMMOM_WORK_ORDER_MAP['pause'].value,
                  COMMOM_WORK_ORDER_MAP['finish'].value,
                ].includes(workOrderInfo.orderStatus)
              "
              type="primary"
              @click="updateNum(row)"
            >
              保存
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
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // 分页
import { getMaterials, editMaterialsNum } from "@/api/overhaul/workOrderApi.js";
import { MATERIALS_COLUMNS } from "../config.js";
import { COMMOM_WORK_ORDER_MAP } from "@/views/overhaul/constants.js";
export default {
  name: "Materials",
  components: {
    Pagination,
  },
  props: {
    onlyTabName: {
      type: String,
      default: "",
    },
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
      COMMOM_WORK_ORDER_MAP,
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
    updateNum(row) {
      editMaterialsNum({
        changeId: row.materialId,
        changeNum: row.materialNum || 0,
      }).then((res) => {
        if (res.code !== "0") {
          this.$message.error(res.errMsg);
        } else {
          this.$message.success("保存成功！");
        }
      });
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
        this.tableData = (pageList || []).map((item, index) => ({
          ...item,
          id: index + 1,
        }));
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
