<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" class="demo-form-inline demo-form-zdy">
        <el-form-item>
          <el-button type="default" icon="Refresh" @click="refreshData">刷新</el-button>
          <el-button type="primary" icon="Plus" @click="handleSyncData">从综合管理平台同步数据</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table highlight-current-row 
      ref="multipleTable"
      row-key="id" :data="tableData" border stripe :expand-row-keys="expandRowKeys"
      :tree-props="{ children: 'children'}">
      <el-table-column label="部门名称" prop="name"></el-table-column>
      <el-table-column label="部门ID" width="130" prop="id"></el-table-column>
      <el-table-column label="部门Code" width="130" prop="orgCode"></el-table-column>
      <el-table-column label="部门层级编码" prop="dncode"></el-table-column>
    </el-table>
  </div>
</template>
<script>

import { getOrganizationList, syncZhglDepart, updateZhglDepart } from "@/sys/api/organization";
import {ElMessage} from 'element-plus'
import Constants from "@/_public/utils/constants";

export default {
  name: "organization",
  data() {
    return {
      tableData: [],
      expandRowKeys: []
    };
  },
  created() {
    this.getOrganization();
  },
  methods: {
    refreshData(){
      this.getOrganization();
    },
    handleSyncData(){
      updateZhglDepart().then(response=>{
        ElMessage.warning('同步部门信息成功');
        getOrganization();
      })
    },
    async getOrganization() {
      const OrganizationList = await getOrganizationList();
      this.tableData = OrganizationList.data;
      this.$nextTick(()=>{
        if(this.tableData?.length > 0){
          this.expandRowKeys  = [this.tableData[0].id];
        }
      })
    },
    addOrganization() {
      this.$refs.formDialog?.addOrganization();
    },
    editOrganization(departmentId){
      this.$refs.formDialog?.editOrganization(departmentId);
    },
    deleteOrg(departmentId){
      this.$confirm('确定要删除此部门吗？').then(async () => {
        const deleteStatus = await deleteOrganization(departmentId)
        if(deleteStatus.code === Constants.respCode.success){
          this.$message.success("删除成功!")
          this.isSureModel = false
          this.getOrganization();
        }
      })
    },
    //分页的事件
    handleSizeChange(val) {
      this.pageSize = val;
      this.getOrganization();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getOrganization();
    },
  },
};
</script>