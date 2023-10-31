<template>
  <div  class="wp hp app-containerC">
    <div class="panel-menu-search filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="类别名称" size="mini">
          <el-input v-model="listQuery.tlmname" @keyup.enter.native="handleSearch"
                    class="filter-item" clearable
          ></el-input>
        </el-form-item>
        <el-form-item size="mini">
          <el-button @click="handleSearch" icon="Search" size="mini">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="panel-menu-list app-container app-containerC otherCon wp">
      <div class="otherCon wp xui-table__highlight">
        <el-table stripe  ref="tableRef" :height="'100%'" highlight-current-row border :data="dataList"
                  @row-click="handleClick"
                  style="font-size: 0.7rem"
        >
          <el-table-column
            header-align="center"
            align="center"
            label="序号"
            width="50"
          >
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="产品类别"
            property="tlmcode"
            width="110"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="类别名称"
            property="tlmname"
            width="180"
          >
          </el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template slot-scope="scope">
              <el-button-group>
                <el-button  type="primary" size="mini"
                            @click="handleEdit(scope.row)">保存
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <xui-pagination :total="total" :page="pageNum" :limit="pageSize" @pagination="handlePagination"
                      class="searchCon wp"
      />
    </div>
  </div>
</template>

<script>
import dryingRuleConfig from '@/api/plan/dryingRuleConfig'
import Constants from "../../../../utils/constants";

export default {
  name: 'dryingRule',

  data() {
    return {
      dataList: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      listQuery: {
        tlmname: ''
      },
      workShopList: [],
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    getDataList() {
      let params = this.getParams()
      dryingRuleConfig.findAllFurnaceRules(params).then(response => {
        if (response.err_code === Constants.statusCode.success) {
          this.dataList = response.data
          this.total = response.total_count;
          if(this.dataList && this.dataList.length > 0){
            this.$refs.tableRef.setCurrentRow(this.dataList[0]);
            this.handleClick(this.dataList[0])
          }

        } else {
          this.$message.error(response.err_msg)
        }
      })
    },
    handleClick(item) {
      this.$emit('updateChild', item)
    },
    handleEdit(rowData) {
      let formatData = this.formatSubmitData(rowData)
      dryingRuleConfig.insertFurnaceRules(formatData).then(response => {
        if (response.err_code === Constants.statusCode.success) {
          this.$message.success('数据保存成功')
          this.getDataList()
        } else {
          this.$message.error(response.err_msg)
        }
      })
    },
    formatSubmitData(rowData) {
      let timeLimitMain = {
        id: rowData.id,
        workShopList: rowData.workShopList,
      }
      return {
        timeLimitMain,
      }
    },
    handleSearch() {
      this.pageNum = 1
      this.getDataList()
    },
    getParams() {
      return {
        ...this.listQuery,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
    },
    handlePagination({ page, limit }) {
      this.pageNum = page
      this.pageSize = limit
      this.getDataList()
    }
  }
}
</script>

<style scoped>
</style>
