<template>
  <div class="app-container app-containerC">
    <!-- 搜索框-->
    <div class="filter-container searchCon">
      <el-form :inline="true" class="demo-form-inline demo-form-zdy ">
        <el-form-item label="设备编号："  size="small">
          <el-input v-model="keyWords.eqpId" placeholder="设备编号" style="width: 150px;" class="filter-item"  size="small"
            clearable />
        </el-form-item>
        <el-form-item label="设备名称："  size="small">
          <el-input v-model="keyWords.eqpName" placeholder="设备名称" style="width: 150px;" class="filter-item"  size="small"
            clearable />
        </el-form-item>
        <el-form-item label="备品备件名称："  size="small">
          <el-input v-model="keyWords.materialName" placeholder="备品备件名称" style="width: 150px;" class="filter-item"  size="small"
            clearable />
        </el-form-item>
        <el-form-item label="备品备件类型："  size="small">
          <el-select v-model="keyWords.spType"  size="small" style="width: 120px;" filterable default-first-option>
            <el-option   label="全部"     :value="null" />
            <el-option   label="电气配件"  :value="0" />
            <el-option   label="机械配件"  :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="Search" @click="onQuery()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table stripe  highlight-current-row
      :data="dataList"
      border
      style="width: 100%"
      default-expand-all
      >
     <el-table-column type="expand"  >
        <template #default="props">
          <el-table stripe  highlight-current-row  :data="props.row.list">
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="备品备件编码" prop="materialCode" ></el-table-column>
            <el-table-column label="备品备件名字" prop="materialName" ></el-table-column>
            <el-table-column label="消耗数量" prop="quantity" ></el-table-column>
            <el-table-column label="备件类型" prop="spType" >
              <template  #default="scope">
                <span v-if="scope.row.spType == 1">机械配件</span>
                <span v-if="scope.row.spType == 0">电气配件</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="设备ID" prop="eqpId"></el-table-column>
      <el-table-column label="设备名字" prop="eqpName"></el-table-column>
    </el-table>
  </div>

</template>

<script>
  import {
    getSparePartsRecords
  } from "@/api/em/sparePart"
  export default {
    data() {
      return {
        keyWords: {
          eqpId: '',
          eqpName: '',
          materialName:'',
          spType:null,
          pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
          pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        },
        dataList: [],
      }
    },
    methods: {
      onQuery() {
        this.dataList = []
        getSparePartsRecords(this.keyWords).then(response => {
          this.dataList = response.data
        })
      }
    },
    mounted() {
      this.onQuery();
    }
  }
</script>

<style scoped>
</style>
