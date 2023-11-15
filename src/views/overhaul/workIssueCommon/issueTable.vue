<template>
  <div class="app-container order-list-box">
    <el-row class="mrb15" type="flex" align="middle" justify="start">
      <div class="mrl10">
        时间段:
        <el-date-picker
          v-model="queryParams.time"
          size="small"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        >
        </el-date-picker>
      </div>
      <div class="mrl10">
        问题类别:
        <el-select
          size="small"
          v-model="queryParams.issue"
          class="filter-item"
          placeholder="请选择"
        >
          <el-option
            v-for="item in issueOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="mrl10">
        工序/提交人名称:
        <el-input
          size="small"
          v-model="queryParams.searchKey"
          style="width: 220px"
          @keyup.enter="handleFilter"
        />
      </div>
      <el-button size="small" class="mrl25" type="primary" @click="getList">
        <el-icon class="el-icon--left"><Search /></el-icon> 查询
      </el-button>
    </el-row>
    <el-table
      :data="tableData"
      v-loading="listLoading"
      stripe
      size="small"
      style="width: 100%"
      height="550"
      show-overflow-tooltip
    >
      <template v-for="item in ISSUE_COLUMNS" :key="item.prop">
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
  </div>
</template>

<script>
import dayjs from "dayjs";
import Pagination from "@/components/Pagination"; // 分页
import { ISSUE_COLUMNS } from "./config.js";
import { Search } from "@element-plus/icons-vue";
export default {
  name: "IssueTable",
  components: { Pagination, Search },

  data() {
    return {
      ISSUE_COLUMNS: Object.freeze(ISSUE_COLUMNS),
      //日期选择框
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      issueOptions: [{ label: "运输问题", value: "1" }],
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
        time: [
          dayjs().startOf().format("YYYY-MM-DD HH:mm:ss"),
          dayjs().endOf().format("YYYY-MM-DD HH:mm:ss"),
        ],
        searchKey: "",
        issue: undefined,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleFilter() {},
    getList() {
      this.listLoading = false;
      new Array(10).fill(1).forEach((item, index) => {
        this.tableData.push({
          id: index,
          ownership: "这是问题所属",
          issue: "问题分类",
          exceptionItem: "套管",
          issueDescription: "哈哈哈哈哈哈",
          submitter: "文罗江",
          useTime: "2023-10-23 12:00:00",
          notifier: "螺纹将",
          issueStatus: "测试",
        });
      });
      this.pageOptions.total = 1;
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
    height: fit-content;
    padding: 0;
    z-index: 999;
  }
}
</style>
