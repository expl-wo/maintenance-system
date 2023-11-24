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
      
      style="width: 100%"
      height="510px"
      @selection-change="handleSelectionChange"
    >
      <template
        v-for="item in DEVICE_COLUMNS.slice(0, DEVICE_COLUMNS.length - 4)"
        :key="item.prop"
      >
        <el-table-column v-bind="item"></el-table-column>
      </template>
    </el-table>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click.stop="handleClose"> 取消 </el-button>
        <el-button type="primary" :loading="saveLoading" @click="handleOk">
          批量添加
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { DEVICE_COLUMNS } from "../../config.js";
import { getDevListPage, findDevList } from "@/api/overhaul/devListApi.js";
import SelectPage from "@/components/SelectPage/selectPage.vue";
export default {
  components: {
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
      saveLoading: false,
      listLoading: false,
      templateOptions: [{ label: "模板1", value: 1 }],
      templateChoose: undefined,
      selectRowList: [],
      tableData: [],
    };
  },
  methods: {
    /**
     * 批量select
     */
    handleSelectionChange(val) {
      this.selectRowList = val;
    },
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
      // this.tableData.push({
      //   deviceName: "干燥空气发生器",
      //   model: "ABC型号",
      //   num: 100,
      //   isUse: "是",
      //   user: "文罗江",
      //   useTime: "2023-10-23 12:00:00",
      // });
      findDevList(this.templateChoose)
        .then((res) => {
          this.tableData = res.data.list;
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    /**
     * 获取设备清单模板列表
     */
    getTemplateOptions(pageOptions) {
      const { pageNum, pageSize, searchKey } = pageOptions;
      let queryParms = {
        pageNum,
        pageSize,
        searchKey,
      };
      return new Promise((resolve, reject) => {
        getDevListPage(queryParms)
          .then((res) => {
            resolve({
              options: res.data.pageList.map((item) => ({
                label: item.templateName,
                value: item.templateId,
              })),
              totalPage: res.data.allPageNum,
            });
          })
          .catch((error) => {
            resolve({ options: [], totalPage: 1 });
          });
      });
    },
  },
};
</script>