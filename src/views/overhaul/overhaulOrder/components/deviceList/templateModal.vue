<template>
  <el-dialog
    title="设备清单模板"
    :model-value="true"
    class="overhaul-template-modal"
    :destroy-on-close="true"
    @close="handleClose"
  >
    <span class="mrl10">设备清单模板:</span>
    <select-page
      v-model="templateChoose"
      :getOptions="getTemplateOptions"
      @change="handleTemplateChange"
    />

    <el-table
      :data="tableData"
      v-loading="listLoading"
      stripe
      size="small"
      style="width: 100%"
      height="510px"
    >
      <template
        v-for="item in DEVICE_COLUMNS.slice(1, DEVICE_COLUMNS.length - 1)"
        :key="item.prop"
      >
        <el-table-column v-bind="item"></el-table-column>
      </template>
    </el-table>
    <pagination
      v-show="pageOptions.total"
      :total="pageOptions.total"
      :page.sync="pageOptions.pageNum"
      :limit.sync="pageOptions.pageSize"
      @pagination="getList"
    />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click.stop="handleClose"> 取消 </el-button>
        <el-button type="primary" :loading="saveLoading" @click="handleOk">
          添加
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import Pagination from "@/components/Pagination"; // 分页
import { DEVICE_COLUMNS } from "../../config.js";
import { getDevListPage, findDevList } from "@/api/overhaul/devListApi.js";
import SelectPage from "@/components/SelectPage/selectPage.vue";
export default {
  components: {
    Pagination,
    SelectPage,
  },
  props: {
    //操作行
    operateRow: {
      type: Object,
      default() {
        return null;
      },
    },
    modalName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      DEVICE_COLUMNS,
      saveLoading: true,
      listLoading: false,
      templateOptions: [{ label: "模板1", value: 1 }],
      templateChoose: undefined,
      //分页参数
      pageOptions: {
        total: 1,
        pageNum: 1,
        pageSize: 20,
      },
      tableData: [],
    };
  },
  methods: {
    handleOk() {
      this.$emit("onSave", this.modalName);
      this.$emit("closeModal", this.modalName);
    },
    handleClose(isSearch = false) {
      this.$emit("closeModal", this.modalName, isSearch);
    },
    /**
     * 模板选择
     */
    async handleTemplateChange(val) {
      this.tableData = [];
      this.pageOptions = { total: 1, pageNum: 1, pageSize: 20 };
      if (!val) {
        this.tableData = [];
        return;
      }
      this.listLoading = true;
      this.tableData.push({
        deviceName: "干燥空气发生器",
        model: "ABC型号",
        num: 100,
        isUse: "是",
        user: "文罗江",
        useTime: "2023-10-23 12:00:00",
      });
      try {
        await getDevListPage({
          currentPage: this.pageOptions.pageNum,
          pageSize: this.pageOptions.pageSize,
        });
      } catch (error) {
        this.tableData = [];
      } finally {
        this.listLoading = false;
      }
    },
    /**
     * 获取设备清单模板列表
     */
    getTemplateOptions(params) {
      return new Promise((resolve, reject) => {
        findDevList(this.templateChoose)
          .then((res) => {
            resolve({
              options: this.templateOptions,
              totalPage: 5,
            });
          })
          .catch((error) => {
            debugger;
          });
      });
    },
    //获取设备清单list
    getList() {},
  },
};
</script>