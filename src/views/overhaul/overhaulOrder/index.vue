<template>
  <div class="app-container order-list-box">
    <el-form :inline="true">
      <el-form-item label="生产号">
        <el-input
          v-model="queryParams.prodNumber"
          clearable
          @keyup.enter="handleFilter"
      /></el-form-item>
      <el-form-item label="项目名称">
        <el-input
          v-model="queryParams.projName"
          clearable
          @keyup.enter="handleFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">
          <el-icon class="el-icon--left"><Search /></el-icon> 查询
        </el-button>
        <el-button
          :disabled="!selectRowList.length"
          title="删除"
          type="danger"
          @click="handleDelete(null)"
        >
          <el-icon class="el-icon--left"><Delete /></el-icon> 删除
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="listLoading"
      stripe
      border
      fit
      highlight-current-row
      style="width: 100%"
      height="calc(100% - 150px)"
      @selection-change="handleSelectionChange"
      @sort-change="sortChanged"
      @filter-change="filterChanged"
    >
      <template v-for="item in ORDER_COLUMNS" :key="item.prop">
        <el-table-column
          :key="item.prop"
          v-bind="item"
          v-if="item.prop === 'operation'"
        >
          <template #default="{ row }">
            <div class="operate-wrap">
              <el-button-group>
                <!-- 一直能操作 -->
                <el-button
                  title="编辑"
                  type="primary"
                  :disabled="
                    [WORK_ORDER_MAP['pause'].value].includes(row.orderStatus)
                  "
                  @click="handleCreate(row, 'update')"
                >
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-button
                  title="详情"
                  type="primary"
                  @click="openModal(row, 'showInfo')"
                >
                  <el-icon><View /></el-icon>
                </el-button>
                <!-- 工单审批之后就不能删除了 -->
                <el-button
                  :disabled="
                    ![WORK_ORDER_MAP['createOrder'].value].includes(
                      row.orderStatus
                    )
                  "
                  title="删除"
                  type="danger"
                  @click="handleDelete(row)"
                  ><el-icon><Delete /></el-icon>
                </el-button>
                <el-button
                  title="结束"
                  type="danger"
                  :disabled="
                    [
                      WORK_ORDER_MAP['pause'].value,
                      WORK_ORDER_MAP['finish'].value,
                    ].includes(row.orderStatus)
                  "
                  @click="closeTask(row)"
                  ><el-icon><CircleClose /></el-icon>
                </el-button>
              </el-button-group>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.type === 'selection'"
          type="selection"
          :width="item.width"
          :selectable="selectable"
        >
        </el-table-column>
        <el-table-column
          v-else-if="item.prop === 'orderStatus'"
          :label="item.label"
          class-name="status-col"
          :column-key="item.prop"
          width="100"
          :filters="satusFilterList"
        >
          <template #default="{ row }">
            <el-tag :type="WORK_ORDER_STATUS[row.orderStatus].tagType">
              {{ WORK_ORDER_STATUS[row.orderStatus].text }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          v-bind="item"
          :column-key="item.prop"
          show-overflow-tooltip
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
    <add-modal
      v-if="showAdd"
      :operateRow="operateRow"
      modalName="showAdd"
      :dialogStatus="dialogStatus"
      @closeModal="closeModal"
    ></add-modal>
    <!-- 详情界面 -->
    <detail-modal
      v-if="showInfo"
      class="order-info"
      :operateRow="operateRow"
      modalName="showInfo"
      @closeModal="closeModal"
    ></detail-modal>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // 分页
import AddModal from "@/views/overhaul/overhaulOrder/components/addModal"; // 新增和编辑弹窗
import DetailModal from "@/views/overhaul/overhaulOrder/components/detailModal"; //工单详情
import { WORK_ORDER_STATUS, WORK_ORDER_MAP, ORDER_COLUMNS } from "./config.js";
import {
  getWorkOrderPage,
  batchDelWorkOrder,
  setWorkOrderStatus,
} from "@/api/overhaul/workOrderApi.js";
import {
  Delete,
  Edit,
  Search,
  View,
  CircleClose,
} from "@element-plus/icons-vue";
export default {
  name: "OverhaulOrder",
  components: {
    Pagination,
    AddModal,
    DetailModal,
    Delete,
    Edit,
    Search,
    View,
    CircleClose,
  },
  data() {
    return {
      WORK_ORDER_STATUS: Object.freeze(WORK_ORDER_STATUS),
      WORK_ORDER_MAP,
      dialogStatus: "add",
      showAdd: false,
      operateRow: null, //操作行
      showInfo: false, //详情
      showAppoint: false, //指派
      showPause: false, //暂停
      //表格相关
      listLoading: true,
      tableData: [],
      ORDER_COLUMNS: Object.freeze(ORDER_COLUMNS),
      //分页参数
      pageOptions: {
        total: 1,
        pageNum: 1,
        pageSize: 20,
      },
      selectRowList: [],
      //查询参数
      queryParams: {
        prodNumber: "",
        projName: "",
        orderStatusList: [],
      },
      //状态下拉筛选
      satusFilterList: Object.values(WORK_ORDER_MAP),
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /**
     * row 所选行 审批之后不能删除
     */
    selectable(row, index) {
      return [WORK_ORDER_MAP["createOrder"].value].includes(row.orderStatus);
    },
    filterChanged(val) {
      this.queryParams = {
        ...this.queryParams,
        orderStatusList: val.orderStatus,
      };
      this.handleFilter();
    },
    //排序
    sortChanged({ column, prop, order }) {
      let sortParmas = {};
      if (order) {
        sortParmas = {
          sort: prop,
          sortType: order === "descending" ? "DESC" : "ASC",
        };
      }
      this.queryParams = {
        ...this.queryParams,
        ...sortParmas,
      };
      this.handleFilter();
    },
    /**
     * 批量select
     */
    handleSelectionChange(val) {
      this.selectRowList = val;
    },
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
    /**
     * 新增和编辑
     */
    handleCreate(row = null, type = "add") {
      this.operateRow = row;
      this.dialogStatus = type;
      this.showAdd = true;
    },
    //结束工单
    closeTask(row) {
      this.$confirm("此操作将结束工单流程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "error",
      })
        .then(() => {
          setWorkOrderStatus({
            orderId: row.id,
            orderStatus: WORK_ORDER_MAP["finish"].value,
          })
            .then(() => {
              this.$message({
                type: "success",
                message: "操作成功!",
              });
              this.getList();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "操作已取消!",
          });
        });
    },
    //删除工单
    handleDelete(row, index) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "error",
      })
        .then(() => {
          let ids = [];
          if (row) {
            ids = [row.id];
          } else {
            ids = this.selectRowList.map((item) => item.id);
          }
          batchDelWorkOrder(ids)
            .then(() => {
              this.getList();
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            })
            .catch((err) => {
              console.warn(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "操作已取消!",
          });
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
    async getList() {
      this.listLoading = true;
      try {
        const {
          data: { allPageNum, pageList },
        } = await getWorkOrderPage({
          pageNum: this.pageOptions.pageNum,
          pageSize: this.pageOptions.pageSize,
          workOrderType: 2,
          ...this.queryParams,
        });
        this.pageOptions.total = allPageNum;
        this.tableData = pageList;
      } catch (error) {
        console.error(error);
        this.tableData = [];
        this.pageOptions.total = 0;
      }
      this.selectRowList = [];
      this.listLoading = false;
    },
    handleFilter() {
      this.pageOptions.pageNum = 1;
      this.getList();
    },
  },
};
</script>
<style scoped lang="scss">
::v-deep(.main-layout_fixed-nav-bar) {
  overflow-y: auto;
}
.mrb15 {
  margin-bottom: 15px;
}
.mrl25 {
  margin-left: 25px;
}
.mrl10 {
  margin-left: 10px;
}
.operate-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
}
.order-list-box {
  position: relative;
  .order-info {
    position: absolute;
    inset: 0;
    width: 100%;
    min-width: 1700px;
    padding: 0;
    z-index: 999;
  }
}
</style>
