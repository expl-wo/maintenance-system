<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" class="demo-form-inline demo-form-zdy">
        <el-form-item>
          <el-select v-model="showAll" @change="handleSearch">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="default" icon="Plus" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table highlight-current-row 
        ref="multipleTable"
        row-key="id" :data="tableData" border stripe :expand-row-keys="expandRowKeys"
        :tree-props="{ children: 'children'}" @expand-change="handleExpandChange">
      <el-table-column label="部门名称" prop="name"></el-table-column>
      <!--      <el-table-column label="部门ID" width="180" prop="id"></el-table-column>-->
      <el-table-column label="部门编码" width="180" prop="orgCode"></el-table-column>
      <el-table-column label="部门层级编码" prop="dncode"></el-table-column>
      <el-table-column label="账套编码" prop="ztbm"></el-table-column>
      <el-table-column header-align="center" align="center" width="420" label="操作">
        <template #default="{row}">
          <el-button-group>
            <el-button type="primary" v-if="row.source == flag.n" icon="Edit" @click="handleEdit(row)">修改
            </el-button>
            <el-button type="danger" v-if="row.source == flag.n" icon="Delete" @click="handleDelete(row.id)">删除
            </el-button>
            <el-button v-if="row.domainDataDisabled ===  flag.n" type="warning" icon="SwitchButton"
                       @click="controlSwitch(row)">
              禁用
            </el-button>
            <el-button v-if="row.domainDataDisabled !== flag.n" type="success" icon="SwitchButton"
                       @click="controlSwitch(row)">
              启用
            </el-button>
            <el-button type="primary" icon="Plus" @click="handleAddSub(row)">新增下级
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <add-or-update-dialog ref="formDialog" @refresh="getDataPermissionOrg"></add-or-update-dialog>
  </div>
</template>
<script>

import {getTreeList, deleteDataPermissionOrg, switchById} from "@/sys/api/dataPermissionOrg";
import Constants from '@/_public/utils/constants'
import addOrUpdateDialog from "@/sys/views/dataPermissionOrg/addOrUpdateDialog";
import {useDeleteConfirm} from "@/_public/components/use/useCommon";
import {ElMessage} from "element-plus";

export default {
  name: "dataPermissionOrgList",
  components: {
    addOrUpdateDialog
  },
  data() {
    return {
      tableData: [],
      expandRowKeys: [],
      flag: Constants.flag,
      showAll: false,
      options: [{
        value: false,
        label: '使用中部门'
      }, {
        value: true,
        label: '全部部门'
      },]
    };
  },
  created() {
    this.getDataPermissionOrg();
  },
  methods: {
    handleSearch() {
      this.getDataPermissionOrg();
    },
    async getDataPermissionOrg() {
      const dataPermissionOrgList = await getTreeList(this.showAll);
      this.tableData = dataPermissionOrgList.data;
      this.$nextTick(() => {
        if (this.tableData?.length > 0 && this.expandRowKeys.length === 0) {
          this.expandRowKeys = [this.tableData[0].id];
        }
      })
    },
    handleExpandChange(row, expanded) {
      if(expanded){
        if(this.expandRowKeys.indexOf(row.id) < 0){
          this.expandRowKeys.push(row.id);
        }

      }else{
        let index  = this.expandRowKeys.indexOf(row.id);
        if(index >= 0){
          this.expandRowKeys.slice()
        }
      }
    },
    addDataPermissionOrg() {
      this.$refs.formDialog?.addOrganization();
    },
    editDataPermissionOrg(departmentId) {
      this.$refs.formDialog?.editOrganization(departmentId);
    },
    handleDelete(departmentId) {
      this.$confirm('删除可能导致数据管理异常，确定要删除吗？').then(async () => {
        let obj = {
          id: departmentId
        }
        const response = await deleteDataPermissionOrg(obj)
        if (response.code === Constants.respCode.success) {
          this.$message.success("删除成功!")
          this.getDataPermissionOrg();
        } else {
          this.$message.error(response.msg);
        }
      })
    },
    handleShowAll() {
      this.showAll = false;
      this.getDataPermissionOrg();
    },
    handleShowDomain() {
      this.showAll = false;
      this.getDataPermissionOrg();
    },
    controlSwitch(row) {
      //切换可用性
      let desc = row.available === Constants.flag.y ? '禁用' : '解禁';
      useDeleteConfirm('确定' + desc + '此部门吗？').then(async _ => {
        let domainDataDisabled = row.domainDataDisabled === Constants.flag.y ? Constants.flag.n : Constants.flag.y;
        let obj = {
          id: row.id,
          source: row.source,
          domainDataDisabled
        }
        const isDisableRes = await switchById(obj);
        if (isDisableRes.code === Constants.respCode.success) {
          if (domainDataDisabled === Constants.flag.y) {
            ElMessage.success("禁用成功!");
          } else {
            ElMessage.success("解禁成功!");
          }
          this.getDataPermissionOrg();
        } else {
          ElMessage.error(isDisableRes.msg);
        }
      })
    },
    handleEdit(row) {
      this.$refs.formDialog.editOrganization(row);
    },
    handleAddSub(parentRow) {
      this.$refs.formDialog.addSubOrganization(parentRow);
    }
  },
};
</script>