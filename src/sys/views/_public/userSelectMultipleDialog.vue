<template>
  <el-dialog draggable title="选择人员"
             v-model="dialogVisible"
             width="1200px"
             top="5vh"
             class="xui-dialog__limit"
             append-to-body
             :close-on-click-modal="false">
    <div class="container">
      <el-row class="mb-5 first-row">
        <el-col :span="24" class="flex-center">
          <div class="choose_label">已选择人员：</div>
          <div class="tag-container" v-show="selectedUser.length > 0">
            <el-tag class="ml-5" v-for="item in selectedUser" :key="item.id" closable @close="tagClose(item)">{{item.departmentName + '-' + item.name }}</el-tag>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="hp second-row">
        <el-col :span="8" class="hp">
          <el-card shadow="hover" class="hp">
            <template #header>
              <div class="clearfix">
                <span>最近选择记录</span>
              </div>
            </template>
            <div class="wp hp app-containerC">
              <div class="wp hp app-containerC">
                <el-table highlight-current-row 
                    ref="multipleTable"
                    :data="historyUserDataList"
                    border stripe>
                  <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
                  <el-table-column label="姓名" prop="name" width="100" align="center">
                    <template #default="{row}">
                      <xui-text @click="handleSelect(row)">{{ row.name }}</xui-text>
                    </template>
                  </el-table-column>
                  <el-table-column label="隶属部门" prop="departmentName" align="center"></el-table-column>
                  <el-table-column label="" fixed="right" width="60" align="center">
                    <template #default="{row}">
                      <el-button-group>
                        <el-button type="danger" icon="Delete" @click="handleDeleteHistory(row)">
                        </el-button>
                      </el-button-group>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6" class="hp">
          <el-card shadow="hover" class="hp">
            <div class="wp hp app-containerC">
              <div class="wp hp app-containerC">
                <el-table stripe 
                    ref="multipleTable"
                    @row-click="handleDepartmentClick"
                    highlight-current-row
                    row-key="id" :data="organization" border :expand-row-keys="expandRowKeys"
                    :tree-props="{ children: 'children'}">
                  <el-table-column label="部门名称" prop="name"></el-table-column>

                </el-table>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="10" class="hp">
          <el-card shadow="hover" class="hp">
            <div class="wp hp app-containerC">
              <div class="filter-container searchCon">
                <el-form :inline="true" :model="searchModel" class="demo-form-inline demo-form-zdy">
                  <el-form-item label="姓名:">
                    <el-input
                        class="w-120"
                        clearable
                        v-model.trim="searchModel.name"
                        @keyup.enter="onSubmit"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="工号:">
                    <el-input
                        class="w-120"
                        clearable
                        v-model.trim="searchModel.code"
                        @keyup.enter="onSubmit"
                    ></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button @click="onSubmit" icon="Search">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <el-table highlight-current-row 
                  ref="multipleTable"
                  :data="dataList"
                  v-loading="tableLoading"
                  border stripe>
                <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
                <el-table-column label="姓名" prop="name" width="100" align="center">
                  <template #default="{row}">
                    <xui-text @click="handleSelect(row)">{{ row.name }}</xui-text>
                  </template>
                </el-table-column>
                <el-table-column label="工号" width="90" prop="code" align="center"></el-table-column>
                <el-table-column label="隶属部门" prop="departmentName" align="center"></el-table-column>
              </el-table>
              <xui-pagination
                  small
                  layout="prev, pager, next"
                  @page-change="handlePageChange"
                  :page-num="pageNo"
                  :page-size="pageSize"
                  :total="total">
              </xui-pagination>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="onConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {defineComponent, computed, onMounted, ref, reactive, defineEmits, toRef, watch, nextTick} from "vue";
import {userPageList} from '@/sys/api/user'
import {useFormItem} from "element-plus";
import {getOrganizationList} from "@/sys/api/organization";
import {addOrUpdateUserToCache, getUserFromCache, deleteUserFromCache} from "@/sys/utils/userHistoryCache";

const emit = defineEmits(["select"]);

const dialogVisible = ref(false);
const tableLoading = ref(false);
const pageNo = ref(1);
const pageSize = ref(20);
const total = ref(0);
const dataList = ref([]);
const firstInit = ref(false);
const historyUserDataList = ref([]);
const selectedUser = ref([]);

const searchModel = reactive({
  code: '',
  name: '',
  dncode: ''
})

const {formItem} = useFormItem();
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

const getParams = () => {
  return {
    ...searchModel,
    pageNo: pageNo.value,
    pageSize: pageSize.value
  }
}

const tagClose = (item) => {
  let surplus = selectedUser.value.filter((user) => {
    return item.id !== user.id
  })
  selectedUser.value = surplus;
}

const addUserToUserList = row => {
  let item = selectedUser.value.find(item => {
    return item.id === row.id;
  })
  if (!item) {
    selectedUser.value.push({
      id: row.id,
      name: row.name,
      departmentName: row.departmentName
    })
  }
}

const getUserFromHistory = () => {
  historyUserDataList.value = getUserFromCache();
}

const handleDeleteHistory = (row) => {
  historyUserDataList.value = deleteUserFromCache(row);
}

const init = (userList = []) => {
  selectedUser.value = userList;
  getUserFromHistory();
  dialogVisible.value = true;
  if (!firstInit.value) {//是第一次加载
    getDataList();
    getOrganization();
    firstInit.value = true;
  }
}

const handleDepartmentClick = (rowData) => {
  searchModel.dncode = rowData.dncode;
  pageNo.value = 1;
  getDataList();
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

const handlePageChange = ({pageNum: pageNumTemp, pageSize: pageSizeTemp}) => {
  pageSize.value = pageSizeTemp;
  pageNo.value = pageNumTemp;
  getDataList();
}

const handleSelect = (row) => {
  addOrUpdateUserToCache(row);
  addUserToUserList(row);
}

const onSubmit = () => {
  pageNo.value = 1;
  getDataList();
}

const onConfirm = ()=>{
  emit("select", selectedUser.value);
  dialogVisible.value = false;
}

defineExpose({
  init,
})
</script>

<style lang="scss">
.flex-center{
  display: flex;
  align-items: center;
  min-height: 24px;
  .choose_label{
    font-size: 12px;
  }
}

.first-row{
  padding: 5px;
  height: auto;
}

.second-row{
  flex: 1;
  overflow: hidden;
}

.container{
  display: flex;
  flex-direction: column;
  height: 76vh;
}
</style>