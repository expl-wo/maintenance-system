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
        <!-- <el-button
          v-if="$isAuth('2005_btn_delete')"
          :disabled="!selectRowList.length"
          title="删除"
          type="danger"
          @click="handleDelete(null)"
        >
          <el-icon class="el-icon--left"><Delete /></el-icon> 删除
        </el-button> -->
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
                  v-if="$isAuth('2005_btn_edit')"
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
                <!-- <el-button
                  v-if="$isAuth('2005_btn_delete')"
                  :disabled="
                    ![WORK_ORDER_MAP['createOrder'].value].includes(
                      row.orderStatus
                    )
                  "
                  title="删除"
                  type="danger"
                  @click="handleDelete(row)"
                  ><el-icon><Delete /></el-icon>
                </el-button> -->
                <el-button
                  v-if="$isAuth('2005_btn_delete')"
                  type="primary"
                  :disabled="
                    [
                      WORK_ORDER_MAP['pause'].value,
                      WORK_ORDER_MAP['finish'].value,
                    ].includes(row.orderStatus)
                  "
                  title="打印二维码"
                  @click="openModal(row, 'showPrint')"
                  ><el-icon><Printer /></el-icon>
                </el-button>
                <el-button
                  v-if="$isAuth('2005_btn_finish')"
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
          :width="item.width"
          :filters="satusFilterList"
        >
          <template #default="{ row }">
            <el-tag
              v-if="row.orderStatus"
              :type="WORK_ORDER_STATUS[row.orderStatus].tagType"
            >
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
    <qr-code-modal
      v-if="showPrint"
      modalName="showPrint"
      :workOrderInfo="operateRow"
      @closeModal="closeModal"
      @printQrCode="printQrCode"
    ></qr-code-modal>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // 分页
import AddModal from "@/views/overhaul/overhaulOrder/components/addModal"; // 新增和编辑弹窗
import DetailModal from "@/views/overhaul/overhaulOrder/components/detailModal"; //工单详情
import { WORK_ORDER_STATUS, WORK_ORDER_MAP, ORDER_COLUMNS } from "./config.js";
import QrCodeModal from "./components/qrCodeModal.vue";
import QRCode from "qrcodejs2";
import {
  getWorkOrderPage,
  batchDelWorkOrder,
  setWorkOrderStatus,
} from "@/api/overhaul/workOrderApi.js";
export default {
  name: "OverhaulOrder",
  components: {
    Pagination,
    AddModal,
    DetailModal,
    QrCodeModal,
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
      showPrint: false, //二维码打印
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
      printWin: null,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //二维码打印
    printQrCode(targetValue) {
      this.showPrint = false;
      let dom = ""; // 拼接的字符串
      targetValue.forEach((item, i) => {
        dom += `<div style='page-break-after:always'>
        <table align='center' style='border: 1px solid black'> <tr style='border: 1px solid black'> <th style='border: 1px solid black' colspan='2'>${item.prodNumber}</th>
        <td rowspan='3' colspan='3'><div id='overhaul_print_${item.codeIndex}' style='text-align: center'></div></td>
        </tr>
        <tr style='border: 1px solid black'> <td colspan='2' style='border: 1px solid black;text-align: center'>${item.prodModel}</td></tr>
        <tr style='border: 1px solid black'> <td colspan='1' style='border: 1px solid black;text-align: center'>${item.projName}</td></tr>
        </table>
        </div>
        `;
      });
      this.printWin = window.open(""); // 新打开一个空窗口
      this.printWin.document.write(dom);
      setTimeout(() => {
        this.printWin.document.title = "衡变MES管理端-工单二维码打印";
        targetValue.forEach((item) => {
          new QRCode(this.printWin.document.getElementById(`overhaul_print_${item.codeIndex}`), {
            width: 80,
            height: 80,
            // text: JSON.stringify(item),
            text: `${item.prodNumber}_${item.prodModel}_${item.id}`,
            colorDark: "#000000", // 前景色
            colorLight: "#ffffff", // 背景色
            correctLevel: QRCode.CorrectLevel.M, // 降低容错级别
          });
        });
        this.printWin.addEventListener("afterprint", this.backWin);
        this.printWin.print();
      }, 100);
    },
    backWin() {
      console.log("打印结束")
      if (this.printWin) {
        this.printWin.close();
        this.printWin.removeEventListener("afterprint", this.backWin);
        this.printWin = null;
      }
    },
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
          data: { total, pageList },
        } = await getWorkOrderPage({
          pageNum: this.pageOptions.pageNum,
          pageSize: this.pageOptions.pageSize,
          workOrderType: 2,
          ...this.queryParams,
        });
        this.pageOptions.total = total;
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
<style  lang="scss">
.el-date-table__row {
  .normal {
    background-color: transparent !important;
  }
}
</style>
<style scoped lang="scss">
:deep(.main-layout_fixed-nav-bar) {
  overflow-y: auto;
}
:deep(.el-table__column-filter-trigger) {
  padding-left: 8px;
  .el-icon-arrow-down {
    transform: scale(1.5);
  }
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
