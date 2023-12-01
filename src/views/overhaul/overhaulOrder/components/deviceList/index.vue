<template>
  <div class="app-container order-list-box">
    <el-row class="mrb15" type="flex" align="middle" justify="start">
      <span class="mrl10">设备名称:</span
      ><el-input
        
        style="width:unset"
        v-model="queryParams.deviceName"
        clearable
        @keyup.enter="handleFilter"
      />
      <el-button  class="mrl10" type="primary" @click="getList">
        <el-icon class="el-icon--left"><Search /></el-icon> 查询
      </el-button>
      <el-button
        
        class="mrl10"
        type="primary"
        @click="openModal(null, 'showAdd')"
      >
        <el-icon class="el-icon--left"><Plus /></el-icon> 新增
      </el-button>
      <el-button
        
        class="mrl10"
        type="primary"
        @click="openModal(null, 'showTemplate')"
      >
        <el-icon class="el-icon--left"><SetUp /></el-icon> 模板选择
      </el-button>
      <el-button  class="mrl10" type="primary" @click="getList">
        <el-icon class="el-icon--left"><Download /></el-icon> 导出
      </el-button>
      <el-button
        
        class="mrl10"
        type="primary"
        @click="handleApproval"
      >
        <el-icon class="el-icon--left"><Stamp /></el-icon> 发起审核
      </el-button>
      <el-button
        
        type="danger"
        title="删除"
        :disabled="!selectRowList.length"
        @click="handleDelete(null)"
      >
        <el-icon class="el-icon--left"><Delete /></el-icon> 删除
      </el-button>
    </el-row>
    <el-table
      :data="tableData"
      v-loading="listLoading"
      stripe
      
      style="width: 100%"
      height="510px"
      @selection-change="handleSelectionChange"
    >
      <template v-for="item in DEVICE_COLUMNS">
        <el-table-column
          :key="item.prop"
          v-bind="item"
          v-if="item.prop === 'operation'"
        >
          <template #default="{ row }">
            <el-button
              
              type="primary"
              title="编辑"
              @click="openModal(row, 'showEdit')"
            >
              <el-icon ><Edit /></el-icon>
            </el-button>
            <el-button
              
              type="danger"
              title="删除"
              @click="handleDelete(row)"
            >
              <el-icon><Delete /></el-icon>
            </el-button>
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
      v-model:page="pageOptions.pageNum"
      v-model:limit="pageOptions.pageSize"
      @pagination="pageChange"
    />

    <!-- 领用人编辑 -->
    <edit-modal
      v-if="showEdit"
      :operateRow="operateRow"
      modalName="showEdit"
      @closeModal="closeModal"
    ></edit-modal>
    <!-- 添加模板弹窗 -->
    <template-modal
      v-if="showTemplate"
      :operateRow="operateRow"
      modalName="showTemplate"
      @closeModal="closeModal"
    ></template-modal>
    <!-- 添加 -->
    <add-modal
      v-if="showAdd"
      :operateRow="operateRow"
      modalName="showAdd"
      @closeModal="closeModal"
    ></add-modal>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // 分页
import { DEVICE_COLUMNS } from "../../config.js";
import EditModal from "./editModal.vue";
import AddModal from "./addModal";
import TemplateModal from "./templateModal.vue";
export default {
  name: "DeviceList",
  components: {
    Pagination,
    EditModal,
    TemplateModal,
    AddModal
  },
  data() {
    return {
      showAdd: false,
      showEdit: false, //编辑
      showTemplate: false,
      DEVICE_COLUMNS: Object.freeze(DEVICE_COLUMNS),
      listLoading: true,
      tableData: [],
      //选中项
      selectRowList: [],
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
      operateRow: null, //操作行
    };
  },
  created() {
    this.getList();
  },
  methods: {
                //分页发生改变时
    pageChange({ limit, page }) {
      this.pageOptions.pageNum = page;
      if (limit) {
        this.pageOptions.pageSize = limit;
      }
      this.getList();
    },
    //发起审核
    handleApproval(row) {
      this.$confirm("确认将该数据发起审核?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "error",
      })
        .then(() => {
          setWorkOrderStatus({
            orderId: row.id,
            orderStatus: WORK_ORDER_MAP["check"].value,
          })
            .then(() => {
              this.$message({
                type: "success",
                message: "暂停成功!",
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
    /**
     * 批量select
     */
    handleSelectionChange(val) {
      this.selectRowList = val;
    },
    //删除设备清单
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
    /**
     * 打开弹窗
     */
    openModal(row = null, modeName) {
      this.operateRow = row;
      this[modeName] = true;
    },
    /**
     * 关闭弹窗
     */
    closeModal(modeName, isSearch = false) {
      this[modeName] = false;
      isSearch && this.getList();
    },
    /**
     * 新增和编辑
     */
    handleCreate(row = null, type = "add") {
      this.operateRow = row;
      this.dialogStatus = type;
      this.showAdd = true;
    },
    getList() {
      this.listLoading = false;
      new Array(10).fill(1).forEach((item, index) => {
        this.tableData.push({
          id: index,
          deviceName: "干燥空气发生器",
          model: "ABC型号",
          num: 100,
          isUse: "是",
          user: "文罗江",
          useTime: "2023-10-23 12:00:00",
        });
      });
      this.pageOptions.total = 1;
      this.selectRowList = [];
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
    height: fit-content;
    padding: 0;
    z-index: 999;
  }
}
</style>
