<template>
  <div class="app-container order-list-box" v-loading="listLoading">
    <el-row class="mrb15" type="flex" align="middle" justify="start">
      <el-button type="primary" @click="getList">
        <el-icon class="el-icon--left"><Refresh /></el-icon> 刷新
      </el-button>
      <el-button type="primary" @click="download">
        <el-icon class="el-icon--left"><Download /></el-icon> 导出
      </el-button>
    </el-row>
    <el-table :data="tableData" stripe style="width: 100%" height="610px">
      <template v-for="item in RETURN_COLUMNS">
        <el-table-column
          :key="item.prop"
          v-bind="item"
          v-if="item.prop === 'operation'"
        >
          <template #default="{ row }">
            <el-button type="primary" title="复核">
              <el-icon><Stamp /></el-icon>
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
      :page="pageOptions.pageNum"
      :limit="pageOptions.pageSize"
      @pagination="pageChange"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // 分页
import { RETURN_COLUMNS } from "../config.js";
import { BOM_STATUS } from "@/views/overhaul/constants.js";
import {
  getReturnList,
  exportReturnListNum,
  exportReturnList,
} from "@/api/overhaul/returnListApi.js";
import { exportData } from "@/utils";
import dayjs from 'dayjs';
export default {
  name: "ReturnList",
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
      RETURN_COLUMNS: Object.freeze(RETURN_COLUMNS),
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
        deviceName: "",
      },
      dialogStatus: "add",
      operateRow: null, //操作行
      maxPageNum: 0,
      hadFileNum: 0,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    download() {
      exportReturnListNum({
        pageNum: 1,
        pageSize: 1,
        workCode: this.workOrderInfo.id,
      }).then((res) => {
        const { promptInfo, maxPageNum } = res.data;
        if (promptInfo) {
          this.$message.error(promptInfo);
          return;
        }
        this.maxPageNum = maxPageNum;
        if (this.maxPageNum) {
          this.listLoading = true;
          this.exportLoop();
        }
      });
    },
    //循环导出
    async exportLoop() {
      if (this.hadFileNum >= this.maxPageNum) {
        this.listLoading = false;
        return;
      }
      await exportReturnList({
        pageNum: this.maxPageNum,
        pageSize: 10000,
        workCode: this.workOrderInfo.id,
      }).then((res) => {
        exportData(res, `返厂清单_${dayjs().format('YYYY_MM_DD_HH_mm_ss')}.xls`);
        this.hadFileNum += 1;
        this.exportLoop();
      });
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
      let params = {
        pageNum: this.pageOptions.pageNum,
        pageSize: this.pageOptions.pageSize,
        workCode: this.workOrderInfo.id,
      };
      getReturnList(params)
        .then((res) => {
          const { total, pageList } = res.data;
          this.tableData =
            pageList.map((item, index) => ({
              ...item,
              id: index+1,
              examineStatus: BOM_STATUS[+item.examineStatus],
            })) || [];
          this.pageOptions.total = total;
        })
        .finally(() => {
          this.listLoading = false;
        });
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
