<template>
  <!--角色分类列表-->
  <div class="app-container app-containerC">

    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="物料名称" >
          <el-input v-model="listQuery.name" placeholder="输入物料名称" style="width: 180px;" class="filter-item" clearable />
        </el-form-item>
        <el-form-item label="物料编号">
          <el-input v-model="listQuery.number" placeholder="物料编号" style="width: 180px;" class="filter-item" clearable/>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" icon="search" @click="onBtnQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" :border="true" header-cell-class-name="bgblue" style="width: 100%" stripe row-key="id" height="700">
      <el-table-column prop="index" label="序号" align="center" min-width="50">
        <template v-slot:default="scope"><span>{{ (scope.$index + 1) }} </span></template>
      </el-table-column>
      <el-table-column prop="name" label="物料名称" align="center" min-width="200"/>
      <el-table-column prop="number" label="物料编号" align="center" min-width="150"/>
      <el-table-column prop="unit" label="单位" align="center" min-width="200"/>
      <el-table-column prop="" align="center" label="操作" width:="150">
        <template v-slot="scope">
            <el-button  type="primary"  icon="edit"
                        @click="click(scope.row)">

            </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page ="listQuery.pg_pagenum" :limit="listQuery.pg_pagesize" class="searchCon"
                @pagination="getList"></pagination>
    <!--弹窗查看-->
    <el-dialog v-dialogDrag  :close-on-click-modal="false" title="查看物料信息" :visible.sync="dialogFormVisible" class="roleDialog800">
      <material ref="materialChild" :fatherData="clickData"></material>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" >关 闭</el-button>
      </div>
    </el-dialog>

    <el-dialog v-dialogDrag  appendToBody title="查看物料信息" v-model="dialogFormVisible" modal width="600" style="height: 300px;">
      <div class="filter-container searchCon">
        <el-form :inline="true" :model="listQueryProduces" class="demo-form-inline demo-form-zdy">
          <el-form-item label="工序编号" size="mini">
            <el-input v-model="listQueryProduces.gxUid" placeholder="工序编号" style="width: 110px;" class="filter-item"
                      clearable />
          </el-form-item>
          <el-form-item label="工序名称" size="mini">
            <el-input v-model="listQueryProduces.gxName" placeholder="工序名称" style="width: 110px;" class="filter-item"
                      clearable />
          </el-form-item>
          <el-form-item >
            <el-button type="primary" icon="search" @click="onRuleConfigQuery">查询
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-tag v-show="owner.ownerNameArray.length > 0" v-for="(item,i) in owner.ownerNameArray"
              @close="tagClose(i)">{{ item }}</el-tag>
      <table-simple :isPagination="false" :height="500" :data="tableRuleConfigData" :row-header="rowRuleConfigHeader" />

      <div slot="footer" class="dialog-footer">
        <el-button  @click="dialogConfigCaiGouFormVisible=false, owner.ownerIdArray = [];owner.ownerNameArray = [];owner.ownerItemArray = []" >取消</el-button>
        <el-button type="primary" @click="createProcedures">保存</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
// import treeTransfer from 'el-tree-transfer' // 引入
import TableSimple from '@/components/Table/index'
import Pagination from "@/components/Pagination/index";
// 分页查询父节点为空的BOM根节点
import { getMaterialTopBomList } from '@/api/materialbom'

import material from '@/views/ps/material'
import {deepClone} from "@/utils";

export default {
  name: 'Table',
  components: { TableSimple, Pagination,material},
  data() {
    return {
      dialogFormVisible: false, // 查看弹窗
      total: 0, // 角色列表表格总条数
      listQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        name: '' ,// 模糊匹配，角色名称
        number:'',
        unit:''
      },

      tableData: [], // 角色分类列表表格数据
      clickData:[]
    }
  },
  mounted() {
    this.onload()
  },
  methods: {
    onload() {

      this.onQuery()
    },
    // 查询
    onBtnQuery() {
      this.listQuery.pg_pagenum = 1
      this.onQuery()
    },
    // 查询
    onQuery() {
      this.tableData = []
      getMaterialTopBomList(this.listQuery).then(response => {
        this.tableData = response.data
        this.total = response.total_count
      })
    },
    // 分页数据发生变化
    getList(val) {
      this.listQuery.pg_pagenum = val.page
      if (val.limit) {
        this.listQuery.pg_pagesize = val.limit
      }
      this.onQuery() // 查询
    },
    click() {
      this.clickData = params.row
     this .$nextTick(() => {
        this.$refs.materialChild.onQuery()
      })
      this.dialogFormVisible = true
    }

  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
.el-form-item{
  margin-bottom: 10px;
}
</style>

