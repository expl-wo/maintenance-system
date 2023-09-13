<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="model">
        <el-form-item prop="rName" label="角色名称：">
          <el-input @keyup.enter="handleQuery" v-model="model.rName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="Search" @click="handleQuery">查询</el-button>
          <el-button type="primary" icon="Plus" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table highlight-current-row 
        ref="multipleTable"
        :data="dataList"
        v-loading="loading"
        border stripe>
      <el-table-column type="index" label="序号" width="70" align="center">
      </el-table-column>
      <el-table-column label="角色名称" prop="rName" min-width="150" align="center"></el-table-column>
      <el-table-column label="备注" prop="rIntro" align="center"></el-table-column>
      <el-table-column width="300" label="操作" align="center">
        <template #default="scope">
          <el-button-group>
            <el-button type="primary" icon="Edit" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button type="success" icon="Link" @click="handlePermission(scope.row)">
              权限关联
            </el-button>
            <el-button type="danger" v-if="canDeleteFunc(scope.row)" icon="Delete" @click="handleDelete(scope.row.id)">
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

    <permission-set-dialog ref="dialogRefP" @success="getDataList" @refresh="getDataList"></permission-set-dialog>
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
  getRoleList,
  deleteInfo
} from "@/sys/api/role";
import AddOrUpdateDialog from "@/sys/views/role/addOrUpdateDialog.vue";
import PermissionSetDialog from "@/sys/views/role/permissionSetDialog.vue";
import {
  ElMessageBox
} from "element-plus";

const cannotDeleteIds = [1, 2, 40]

export default defineComponent({
  name: "list",
  components: {
    AddOrUpdateDialog,
    PermissionSetDialog
  },
  setup() {
    const page = ref(1);
    const limit = ref(20);
    const total = ref(0);
    const dataList = ref([]);
    const loading = ref(false);
    const dialogRef = ref(null);
    const dialogRefP = ref(null);
    const model = reactive({
      rName: '',
      rIntro: ''
    })
    const getParams = () => {
      let params = {
        pageNo: page.value,
        pageSize: limit.value,
        ...model,
      };
      return params;
    }

    const canDeleteFunc = (row) => {
      let id = row.id;
      if (cannotDeleteIds.includes(id)) {
        return false;
      } else {
        return true;
      }
    }


    const getDataList = async () => {
      const response = await getRoleList(getParams());
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
    const handlePermission = (rowData) => {
      // eslint-disable-next-line no-mixed-spaces-and-tabs
      dialogRefP.value.init(rowData);
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
        deleteInfo(req).then(response => {
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
      dialogRefP,
      handleQuery,
      getDataList,
      handlePageChange,
      handleAdd,
      handleEdit,
      handleDelete,
      handlePermission,
      canDeleteFunc
    }
  }
})
</script>

<style scoped>

</style>