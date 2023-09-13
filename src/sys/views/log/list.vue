<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="formInline" class="demo-form-inline demo-form-zdy">
        <el-form-item label="类型：">
          <xui-dict-select item-code="logType" v-model="formInline.type" clearable></xui-dict-select>
        </el-form-item>
        <el-form-item label="标题：">
          <el-input v-model.trim="formInline.title" @keyup.enter="handleSearch"></el-input>
        </el-form-item>
        <el-form-item label="内容体：">
          <el-input v-model.trim="formInline.body" @keyup.enter="handleSearch"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table highlight-current-row 
        ref="multipleTable"
        border stripe
        :data="dataList">
      <el-table-column type="index" width="100" label="序号" align="center">
      </el-table-column>
      <el-table-column label="类型" width="200" prop="type" align="center">
        <template #default="{row}">
          <xui-dictionary item-code="logType" :code="row.type"></xui-dictionary>
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title" align="center">
      </el-table-column>
      <el-table-column label="URL地址"   show-overflow-tooltip prop="uri" width="150" align="center">
      </el-table-column>
      <el-table-column
          prop="body"
          show-overflow-tooltip
          align="center"
          label="内容体"
      ></el-table-column>
      <el-table-column
          prop="crtTime"
          label="时间"
          align="center"
          width="260"
      ></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template #default="scope">
          <el-button-group>
            <el-button type="primary" @click="handleDetail(scope.row)">
              内容详情
            </el-button>
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
    <el-dialog draggable title="详情"
               v-model="dialogVisible"
               width="1000px"
               append-to-body
               class="xui-dialog__control"
               :close-on-click-modal="false">
      <el-input type="textarea" rows="10" v-model="selectRow.body"></el-input>
      <template #footer>
      <span class="dialog-footer">
        <el-button type="default"  @click="dialogVisible=false">关闭</el-button>

      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref, onMounted} from "vue";
import {page} from "@/sys/api/log";
import {useTableParams} from "@/_public/hooks";

const selectRow = reactive({})
const dialogVisible = ref(false)

const {
  dataList,
  tableLoading,
  total,
  pageNo,
  pageSize
} = useTableParams(20);

const formInline = reactive({
  type: '',
  title: '',
  body: ''
})

const getParams = () => {
  return {
    ...formInline,
    pageNo: pageNo.value,
    pageSize: pageSize.value
  }
}

const handleSearch = () => {
  pageNo.value = 1;
  getDataList();
}

const handleDetail = (row)=>{
  dialogVisible.value = true;
  Object.assign(selectRow, row);
}

const handlePageChange = ({pageNum: pageNumTemp, pageSize: pageSizeTemp}) => {
  pageSize.value = pageSizeTemp;
  pageNo.value = pageNumTemp;
  getDataList();
}

const getDataList = async () => {
  const params = getParams();
  const response = await page(params);
  dataList.value = response.data.list;
  total.value = response.data.totalCount;
}

onMounted(() => {
  getDataList();
});

</script>