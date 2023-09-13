<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="model">
        <el-form-item prop="rName" label="角色名称：">
          <el-input @keyup.enter="handleQuery" v-model="model.roleName"></el-input>
        </el-form-item>
        <el-form-item prop="ownerName" label="员工姓名：">
          <el-input @keyup.enter="handleQuery" v-model="model.ownerName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="Search" @click="handleQuery">查询</el-button>
          <el-button type="primary" icon="Plus" @click="handleAdd">新增角色分配</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table highlight-current-row 
        ref="multipleTable"
        :data="dataList"
        v-loading="loading"
        border stripe>
      <el-table-column  type="index" label="序号" width="70" align="center">
      </el-table-column>
      <el-table-column label="员工姓名" prop="ownerName" min-width="150"   align="center"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"  align="center" ></el-table-column>
      <el-table-column width="300" label="操作" align="center">
        <template #default="scope">
          <el-button-group>
            <el-button type="primary" icon="Edit"  @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" icon="Delete" @click="handleDelete(scope.row.id)">
              删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <xui-pagination
        size="small"
        @page-change="handlePageChange"
        layout="total, sizes, prev, pager, next, jumper"
        :page-num="page"
        :page-size="limit"
        :total="total">
    </xui-pagination>
    <add-or-update-dialog ref="dialogRef" @success="getDataList" @refresh="getDataList"></add-or-update-dialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  reactive
} from "vue";

import {
  getUserRoleList,
  deleteUserRoleInfo
} from "@/sys/api/role";
import AddOrUpdateDialog from "@/sys/views/userRole/addOrUpdateDialog.vue";
import {
  ElMessageBox
} from "element-plus";

export default defineComponent({
  name: "list",
  components: {
    AddOrUpdateDialog
  },
  setup() {
    const page = ref(1);
    const limit = ref(20);
    const total = ref(0);
    const dataList = ref([]);
    const loading = ref(false);
    const dialogRef = ref(null);
    const model = reactive({
      ownerName: '',
      roleName: ''
    }
    );
    const getParams = () => {
      let params = {
        pageNo: page.value,
        pageSize: limit.value,
        ...model,
      };
      return params;
    }

    const getDataList = async () => {
      const response = await getUserRoleList(getParams());
      dataList.value = response.data.records;
      total.value = response.data.total;
    }

    const handleQuery = () => {
      page.value = 1;
      getDataList();
    }

    const handlePageChange = ({
                                pageNum,
                                pageSize
                              }) => {
      page.value = pageNum;
      limit.value = pageSize;
      getDataList();
    }

    const handleEdit = (rowData) => {
      dialogRef.value.init(rowData);
    }
    const handleDelete = (rowData) => {
      ElMessageBox.confirm(
          '是否确定删除',
          'Warning', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(() => {
        const req = {
          id: rowData
        }
        deleteUserRoleInfo(req).then(response => {
          getDataList()
        })
      })
    }

    const handleAdd = () => {
      dialogRef.value.init();
    }



    onMounted(() => {
      getDataList();
    })
    return {
      model,
      dataList,
      page,
      limit,
      total,
      loading,
      dialogRef,
      handleQuery,
      getDataList,
      handlePageChange,
      handleAdd,
      handleEdit,
      handleDelete
    }
  }
})
</script>

<style scoped>

</style>