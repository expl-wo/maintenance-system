<template>
  <div  class="wp hp app-containerC">
    <div class="panel-menu-list app-container app-containerC otherCon wp">
      <el-table :data="tableData" :border="true" header-cell-class-name="bgblue" style="width: 100%" stripe row-key="id" height="700">
                  style="font-size: 0.7rem">
        <el-table-column prop="gxUid" align="center" width="60" label="标准工序编号" />
        <el-table-column prop="gxName" align="center" label="标准工序名称" />
        <el-table-column label="前置条件" align="center" width="140">
          <template v-slot="scope">
            <el-select multiple value-key="k" v-model="scope.row.preGx" style="width: 270px">
              <el-option v-for="item in scope.row.usablePre" :key="item.k" :value="item" :label="item.v">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="工位" align="center" width="140">
          <template v-slot="scope">
            <el-cascader v-model="scope.row.lineWorkSpaceValue" :options="lineWorkSpace"
                         :props="{value: 'lineId',label: 'lineName',children: 'workSpace'}" style="width: 270px"
                         @change="handleChange(scope.row)" filterable @visible-change="handleVisibleChange"></el-cascader>
          </template>
        </el-table-column>
        <el-table-column prop="workspaceNumber" align="center" label="工位编码" />
        <el-table-column prop="workspaceName" align="center" label="工位名称" />
        <el-table-column prop="erpValidationCode" align="center" label="ERP识别码" width="100"/>
        <el-table-column header-align="center" align="center" width="150" label="操作">
          <template v-slot="scope">
            <el-button-group>
              <el-button  title="删除" type="danger" icon="Delete"
                         @click="handleDelete(scope.row)" />
              <el-button s title="保存" type="primary" icon="Equipment" @click="saveItemDataCondition(scope.row)">
                保存
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
        </el-table>
      <pagination :total="total" :page ="listItemUpdate.pg_pagenum" :limit="listItemUpdate.pg_pagesize" class="searchCon"
                  @pagination="getList" />
    </div>
  </div>
</template>

<script>
import Constants from "../../../../utils/constants";
import {
  procedure,insertGx
} from "@/api/plan";
import dictHttp from "@/api/sys/dict";
import Pagination from "@/components/Pagination/index";

export default {
  name: 'ps34ProcessTemplateRuleItem',
  components: {Pagination},
  data() {
    return {
      total: 0,
      dataList: [],
      dialogVisible: false,

      listItemUpdate: { // 数据
          gxUId:'',
          gxName:'',
        workShopName:'',
        workShopNumber:'',

          pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
          pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
      },
     tableData:[]
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    //获取
    getDataList() {
        this.tableData = []
        procedure(this.listItemUpdate).then(response => {
          this.tableData = response.data
          this.total = response.total_count
        })

    },
    getList(val) {
      this.listItemUpdate.pg_pagenum = val.page
      if (val.limit) {
        this.listItemUpdate.pg_pagesize = val.limit
      }
      this.onQuery() // 查询
    },

    saveItemDataCondition(params) {
      insertGx(params).then(response => {
        this.$message({
          message: "保存成功",
          type: 'success'
        })
      })
    },

    handleDelete(rowData) {
      this.$confirm(Constants.deleteTip).then(() => {
        dictHttp.delete({
          id: rowData.id
        }).then(response => {
          if (response.err_code === Constants.respCode.success) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          }
          this.handleSearch()
        })
      })
    },
    initData() {
      // this.timeLimitId = data.id;
     procedure({
        gxUId: '',
        gxName: '',
       workshopName:'',
       workshopNumber:'',
        pageNum: 1,
        pageSize: 10
      }).then(response => {
        this.dataList = response.data.map(item => {
          return {
            k: item.gxUId,
            v: item.gxName
          }
        })
        this.getDataList()
      })
    },
  }
}
</script>

<style scoped>

</style>
