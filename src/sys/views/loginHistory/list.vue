<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="formInline" class="demo-form-inline demo-form-zdy">
        <el-form-item label="员工姓名：">
          <el-input clearable @clear="refreshData" v-model.trim="formInline.userName"
                    @keyup.enter="refreshData"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="refreshData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table highlight-current-row
        ref="multipleTable"
        border stripe
        :data="tableData">
      <el-table-column type="index" width="100" label="序号" align="center">
      </el-table-column>
      <el-table-column
          prop="userName"
          align="center"
          label="员工姓名"
      ></el-table-column>
      <el-table-column
          prop="userCode"
          align="center"
          label="员工工号"
      ></el-table-column>
      <el-table-column
          prop="loginTime"
          align="center"
          label="登录时间"
          width="260"
      ></el-table-column>
      <el-table-column
          prop="userName"
          align="center"
          label="登录方式"
      >
        <template #default="{row}">
          {{ row.os }}/{{ row.browser }}
        </template>
      </el-table-column>
      <el-table-column
          prop="ipaddr"
          label="登录IP地址"
          align="center"
          width="260"
      ></el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
    >
    </el-pagination>
  </div>
</template>
<script>
import {getPageList} from "@/sys/api/sysUserLoginLog"

export default {
  name: "loginHistory",
  data() {
    return {
      formInline: {
        userName: '',
      },
      tableData: [],
      //分页的数据
      currentPage: 1,
      pageSize: 20,
      total: 0,
    };
  },
  created() {
    this.getLoginTime();
  },
  methods: {
    refreshData() {
      this.currentPage = 1;
      this.getLoginTime();
    },
    async getLoginTime() {
      const userLoginInfoList = await getPageList({
        userName: this.formInline.userName,
        pageNo: this.currentPage,
        pageSize: this.pageSize
      })
      this.total = userLoginInfoList.data.totalCount
      this.tableData = userLoginInfoList.data.list
    },
    reset() {
      this.formInline.keyWord = ""
      this.refreshData()
    },
    //分页的事件
    handleSizeChange(val) {
      this.pageSize = val
      this.getLoginTime()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getLoginTime()
    }
  },
};
</script>
