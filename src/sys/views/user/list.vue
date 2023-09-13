<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="formInline" class="demo-form-inline demo-form-zdy">
        <el-form-item label="用户工号:">
          <el-input
              v-model.trim="formInline.code"
              @keyup.enter="onSubmit"
          ></el-input>
        </el-form-item>
        <el-form-item label="员工姓名:">
          <el-input
              v-model.trim="formInline.name"
              @keyup.enter="onSubmit"
          ></el-input>

        </el-form-item>
        <!-- <el-form-item label="部门:">
           <el-select v-model="formInline.department" @change="onSubmit">
             <el-option v-for="item in organization" :key="item.departmentId" :label="item.name"
                        :value="item.name"></el-option>
           </el-select>
         </el-form-item>-->
        <el-form-item>
          <el-button @click="onSubmit" icon="Search">查询</el-button>
          <el-button icon="Refresh" @click="reset">重置</el-button>
          <!-- <el-button type="primary" icon="Plus" @click="handleAdd">新增
           </el-button>-->
          <!--     <el-button type="info" icon="Upload" @click="handleInit">初始化用户
               </el-button>-->
          <el-button type="info" icon="Upload" @click="handleSync">同步用户
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row :gutter="10" class="rowHeightCl">
      <el-col :span="5" class="hp">
        <el-card shadow="hover" class="hp">
          <template #header>
            <div class="clearfix">
              <span>部门机构</span>
            </div>
          </template>
          <div class="wp hp app-containerC">
            <el-table stripe
                ref="multipleTable"
                @row-click="handleDepartmentClick"
                highlight-current-row
                row-key="id" :data="organization" border :expand-row-keys="expandRowKeys"
                :tree-props="{ children: 'children'}">
              <el-table-column label="部门名称" prop="name"></el-table-column>
<!--              <el-table-column label="部门ID" width="130" prop="id"></el-table-column>-->
            </el-table>
          </div>
        </el-card>
      </el-col>
      <el-col :span="19" class="hp">
        <el-card shadow="hover" class="hp">
          <template #header>
            <div class="clearfix">
              <span>人员列表</span>
            </div>
          </template>
          <div class="wp hp app-containerC">
            <div class="filter-container searchCon">
              <el-button type="primary" class="mb-10" @click="handleBatchEdit">批量授权</el-button>
            </div>
            <el-table highlight-current-row
                ref="multipleTable"
                :data="dataList"
                v-loading="tableLoading"
                border stripe>
              <el-table-column type="selection" width="55"/>
              <el-table-column type="index" label="序号" width="70" align="center">
              </el-table-column>
              <el-table-column label="工号" prop="code" width="80" align="center"></el-table-column>
              <el-table-column prop="name" label="员工姓名" width="100" align="center"></el-table-column>
              <el-table-column prop="available" label="是否可用" width="80" align="center">
                <template #default="{row}">
                  <xui-dictionary item-code="yn" :code="row.available"></xui-dictionary>
                </template>
              </el-table-column>
              <el-table-column prop="departmentName" width="160" label="部门" align="center"></el-table-column>
              <el-table-column prop="roleNames" min-width="180" label="角色" align="center"></el-table-column>
              <el-table-column prop="dataPermOrgName" min-width="180" label="数据授权部门" align="center"></el-table-column>
              <el-table-column label="操作" width="180" align="center">
                <template #default="scope">
                  <el-button-group>
                    <!-- <el-button type="primary" icon="Edit" @click="edit(scope.row.id)">
                       编辑
                     </el-button>-->
                    <el-button type="primary" icon="Edit" @click="handlePerm(scope.row)">
                      授权
                    </el-button>
                    <el-button v-if="scope.row.available === 'y'" type="warning" icon="SwitchButton"
                               @click="controlSwitch(scope.row)">
                      禁用
                    </el-button>
                    <el-button v-if="scope.row.available !== 'y'" type="success" icon="SwitchButton"
                               @click="controlSwitch(scope.row)">
                      启用
                    </el-button>
                    <!-- <el-button type="danger" icon="Delete" @click="handleDeleteUser(scope.row.id)">
                       删除
                     </el-button>-->
                  </el-button-group>
                </template>
              </el-table-column>
            </el-table>
            <xui-pagination
                @page-change="handlePageChange"
                :page-num="pageNo"
                :page-size="pageSize"
                :total="total">
            </xui-pagination>
            <add-or-update-dialog v-if="hide" ref="addOrUpdateDialogRef" @refresh="onSubmit"></add-or-update-dialog>
          </div>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script lang="ts">
import {ElMessage, ElMessageBox} from 'element-plus'
import {defineComponent, ref, reactive, onMounted, nextTick} from "vue";

import {useTableParams} from '@/_public/hooks'
import {userPageList, isDisable, deleteUser, initUser, updateUser} from '@/sys/api/user'
import {getOrganizationList} from '@/sys/api/organization'
import addOrUpdateDialog from "@/sys/views/user/dialog/addOrUpdateDialog.vue";
import Constants from '@/_public/utils/constants'
import {useDeleteConfirm} from '@/_public/components/use/useCommon'
import {getRoleList} from "@/sys/api/role";

export default defineComponent({
  name: "user",
  components: {addOrUpdateDialog},
  setup() {
    const addOrUpdateDialogRef = ref();
    const multipleTable = ref();
    const hide = ref(false);
    const formInline = reactive({
      code: '',
      name: '',
      dncode: ''
    })
    const roleList = ref([]);


    let organization = ref<[]>();
    const expandRowKeys = ref<[any]>();

    const getOrganization = async () => {
      const OrganizationList = await getOrganizationList();
      organization.value = OrganizationList.data;
      nextTick(() => {
        if (organization.value?.length > 0) {
          // @ts-ignore
          expandRowKeys.value = [organization.value[0].id];
        }
      })
    }

    const reset = () => {
      Object.assign(formInline, {
        code: '',
        name: '',
        dncode: ''
      })
      pageNo.value = 1;
      getDataList();
    }

    const handleDepartmentClick = (rowData) => {
      formInline.dncode = rowData.dncode;
      pageNo.value = 1;
      getDataList();
    }

    const onSubmit = function () {
      pageNo.value = 1;
      getDataList();
    }
    const handleAdd = function () {
      addOrUpdateDialogRef.value.init()
    }

    const handleInit = () => {
      initUser({})
    }

    const handleSync = () => {
      updateUser({});
    }

    const handleBatchEdit = ()=>{
      let selectRows = multipleTable.value.getSelectionRows();
      if(selectRows.length <= 0){
        ElMessage.warning("请勾选数据后再点击处理");
        return;
      }
    }

    const handlePageChange = ({pageNum: pageNumTemp, pageSize: pageSizeTemp}) => {
      pageSize.value = pageSizeTemp;
      pageNo.value = pageNumTemp;
      getDataList();
    }

    function getParams() {
      return {
        ...formInline,
        pageNo: pageNo.value,
        pageSize: pageSize.value
      }
    }

    const getDataList = () => {
      tableLoading.value = true;
      let params = getParams();
      userPageList(params).then(response => {
        dataList.value = response.data.list;
        total.value = response.data.totalCount;
      }).finally(() => {
        tableLoading.value = false;
      })
    }

    const getAllRoleList = async ()=>{
      const response = await getRoleList({
        pageNo: 1,
        pageSize: Constants.pageAll
      })
      response.data.records.forEach(item=>{
        item.id = item.id + '';
      })
      roleList.value = response.data.records;
    }
    const {
      dataList,
      tableLoading,
      total,
      pageNo,
      pageSize
    } = useTableParams(20);

    //对用户授权和角色
    const handlePerm = (rowData)=>{
    }

    //禁用启用用户
    const controlSwitch = async (row) => {
      let desc = row.available === Constants.flag.y ? '禁用' : '解禁';
      useDeleteConfirm('确定' + desc + '此用户吗？').then(async _ => {
        let available = row.available === Constants.flag.y ? Constants.flag.n : Constants.flag.y;
        const isDisableRes = await isDisable(available, row.id);
        if (isDisableRes.code === Constants.respCode.success) {
          if (row.available === Constants.flag.y) {
            ElMessage.success("用户禁用成功!");
          } else {
            ElMessage.success("用户解禁成功!");
          }
          getDataList();
        } else {
          ElMessage.error(isDisableRes.msg);
        }
      })
    }

    const edit = (userNumber) => {
      addOrUpdateDialogRef.value.init({
        userNumber
      });
    }

    const handleDeleteUser = (userNumber) => {
      ElMessageBox.confirm('确定要删除此用户吗？').then(() => {
        deleteUser(userNumber).then(response => {
          if (response.code === Constants.respCode.success) {
            ElMessage.success('用户删除成功');
            getDataList()
          }
        })
      })
    }

    onMounted(async() => {
      getOrganization();
      await getAllRoleList();
      getDataList();
    })


    return {
      roleList,
      handleInit,
      handleSync,
      addOrUpdateDialogRef,
      organization,
      formInline,
      onSubmit,
      handleAdd,
      getDataList,
      edit,
      reset,
      hide,

      dataList,
      expandRowKeys,
      tableLoading,
      total,
      pageNo,
      pageSize,
      handlePageChange,
      controlSwitch,
      handleDeleteUser,
      handleDepartmentClick,
      handlePerm,
      multipleTable,
      handleBatchEdit
    }
  }
})
</script>

<style scoped>
.rowHeightCl {
  height: calc(100% - 38px);
}

</style>
