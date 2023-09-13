<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="model">
        <el-form-item>
          <el-button type="primary" icon="Refresh" @click="getDataList">刷新</el-button>
          <el-button type="primary" icon="Plus" @click="handleAdd('')">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table stripe  highlight-current-row 
        :data="dataList"
        :stripe="true"
        row-key="id"
        border
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column prop="pName" width="400" label="菜单名称"/>
      <el-table-column prop="pCode" width="400" label="权限编号" align="center"/>
      <el-table-column prop="pType" label="类型" align="center">
        <template #default="scope">
          <xui-dictionary item-code="permissionType" :code="scope.row.pType"></xui-dictionary>
        </template>
      </el-table-column>
      <el-table-column prop="showOrder" label="排序号" align="center">
      </el-table-column>
      <el-table-column prop="pEnabled" label="是否可用" align="center">
        <template #default="scope">
          <xui-dictionary item-code="yn" :code="scope.row.pEnabled"></xui-dictionary>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="320" label="操作">
        <template #default="scope">
          <el-button-group>
            <el-button type="primary" icon="Edit" @click="handleEdit(scope.row)">修改
            </el-button>
            <el-button type="warning" v-if="scope.row.pEnabled ==='y'" icon="Edit"
                       @click="handleToggleDisable(scope.row)">禁用
            </el-button>
            <el-button type="success" v-else icon="Edit" @click="handleToggleDisable(scope.row)">启用
            </el-button>
            <el-button type="danger" icon="Delete" @click="handleDelete(scope.row.id)">删除
            </el-button>
            <el-button type="primary" v-if="scope.row.pType == sysConstants.permissionType.menu" icon="Plus"
                       @click="handleAddSub(scope.row)">新增下级
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <add-or-update-dialog ref="dialogRef" @success="getDataList" @refresh="getDataList"
                          :treeList="menuDataList"></add-or-update-dialog>
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
  getPermissionList,
  deleteInfo,
  togglePEnabled
} from "@/sys/api/permission";
import {
  ElMessage,
  ElMessageBox
} from "element-plus";
import AddOrUpdateDialog from "@/sys/views/permission/addOrUpdateDialog.vue";
import sysConstants from "@/sys/utils/sysConstants";
import constants from "@/_public/utils/constants";
import {useDeleteConfirm} from "@/_public/components/use/useCommon";

export default defineComponent({
  name: "list",
  components: {
    AddOrUpdateDialog,
  },
  setup() {
    const page = ref(1);
    const limit = ref(20);
    const total = ref(0);
    const dataList = ref([]);
    const menuDataList = ref([]);
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

    const turnDataToMenuList = (allList) => {
      let root = [];
      setChildren(allList, root);

      function setChildren(originData, resultData) {
        originData.forEach(item => {
          if (item.pType === sysConstants.permissionType.menu) {
            const obj = {
              label: item.pName,
              value: item.id,
              children: []
            }
            resultData.push(obj)
            if (item.children && item.children.length > 0) {
              setChildren(item.children, obj.children);
            }
          }
        })
      }

      return root;
    }

    const getDataList = async () => {
      const response = await getPermissionList(getParams());
      dataList.value = response.data;
      total.value = response.data.total;
      menuDataList.value = [];

      dataList.value.forEach(element => {
        //根节点fId设置为空的设置为root
        element.fId = constants.isEmpty(element.fId) ? 'root' : element.fId;
        if (element.sub && element.sub.length > 0) {
          element.children = element.sub
          select(element.sub)
        } else {
          element.children = []
        }
      })

      function select(subFather) {
        subFather.forEach(element => {
          if (element.sub && element.sub.length > 0) {
            element.children = element.sub
            select(element.sub)
          } else {
            element.children = []
          }
        })
      }

      menuDataList.value = [{
        value: 'root',
        label: '根节点菜单',
        children: turnDataToMenuList(dataList.value)
      }]
    };

    const handleQuery = () => {
      page.value = 1;
      getDataList();
    }

    const handleDelete = (rowData) => {
      ElMessageBox.confirm(
          '是否确定删除',
          '提示', {
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

    const handleAddSub = (rowData) => {
      dialogRef.value.initSub(rowData);
    }

    const handleAdd = () => {
      dialogRef.value.init();
    }

    const handleEdit = (rowData) => {
      dialogRef.value.initEdit(rowData);
    }

    const _toggleDisable = (id, pEnabled) => {
      togglePEnabled({
        id,
        pEnabled
      }).then(response=>{
        getDataList();
        ElMessage.success("操作成功");
      })
    }

    const handleToggleDisable = row => {
      //启用禁用切换
      if (row.pEnabled === constants.flag.y) {
        useDeleteConfirm("确定禁用吗？").then(response => {
          _toggleDisable(row.id, constants.flag.n);
        })
      } else {
        _toggleDisable(row.id, constants.flag.y);
      }
    }

    onMounted(() => {
      getDataList();
    })
    return {
      model,
      dataList,
      menuDataList,
      sysConstants,

      page,
      limit,
      total,
      loading,
      dialogRef,
      handleQuery,
      getDataList,
      handleAdd,
      handleAddSub,
      handleEdit,
      handleDelete,
      handleToggleDisable
    }
  }
})
</script>

<style scoped>

</style>