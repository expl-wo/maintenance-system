<template>
  <div class="app-container app-containerC">

    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="分类名称"  size="small">
          <el-input v-model="listQuery.name" placeholder="分类名称" style="width: 180px;" class="filter-item"  size="small" clearable/>
        </el-form-item>
        <el-form-item label="分类描述"  size="small">
          <el-input v-model="listQuery.description" placeholder="分类描述" style="width: 180px;" class="filter-item"  size="small" clearable/>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="Search" @click="onBtnQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <table-simple
      class="otherCon wp"
      :data="tableData"
      :row-header="rowHeader"
      :total="total"
      :page="listQuery.pg_pagenum"
      :limit="listQuery.pg_pagesize"
      @pagination="getList"
    />

    <!-- <el-dialog draggable :close-on-click-modal="false" title="修改"  v-model="dialogFormEditVisible" class="roleDialog">
      <el-form ref="listUpdate" label-position="right" label-width="160px" :model="listUpdate">
        <el-form-item label="分类名称:"  size="small">
          <el-input v-model="listUpdate.name" placeholder="分类名称" style="width: 180px;" disabled class="filter-item"  size="small" clearable />
        </el-form-item>
        <el-form-item label="安灯提报时间上限:"  size="small" prop="toAndonTIme">
          <el-input v-model="listUpdate.toAndonTime" placeholder="安灯触发时间上限" style="width: 180px;" class="filter-item"  size="small" />
        </el-form-item>
      </el-form>
      <div   class="dialog-footer">
        <el-button  size="small" @click="dialogFormEditVisible = false">取 消</el-button>
        <el-button type="primary"  size="small" @click="saveUpdateData('listUpdate')">
          保存
        </el-button>
      </div>
    </el-dialog> -->

  </div>
</template>

<script>
// import treeTransfer from 'el-tree-transfer' // 引入
import TableSimple from '@/components/Table/index'

// 设备分类查询
import { getCateList, timetoandon } from '@/api/em/eqpLedger'

import { $message } from '@/utils/common'

export default {
  name: 'Table',
  components: { TableSimple },
  data() {
    return {
      total: 0, // 角色列表表格总条数
      listQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        name: '', // 模糊匹配，设备分类名称
        description: '' ,// 模糊匹配，设备分类描述
        type:'1',
      },
      listUpdate: {
        eqpClassId: '', // 分类id
        name: '', // 模糊匹配，设备分类名称
        toAndonTime: 0 // 安灯提报时间上限
      },
      tableData: [], // 角色分类列表表格数据
      rowHeader: [],
      formLabelWidth: '120px',
      dialogFormEditVisible: false
    }
  },
  mounted() {
    this.onload()
  },
  methods: {
    onload() {
      const self = this
      self.rowHeader = [
        // 未做任何格式化处理的数据
        {
          prop: 'index',
          width: 80,
          align: 'center',
          label: '序号'
        },
        {
          prop: 'name',
          align: 'center',
          label: '分类名称'
        },
        {
          prop: 'description',
          align: 'center',
          label: '分类描述'
        },
        // {
        //   prop: 'options',
        //   align: 'center',
        //   width: 80,
        //   label: '操作',
        //   render: (h, params) => {
        //     return h(ElButtonGroup, ()=>[
        //       h(ElButton, {
        //         type: 'primary', size: 'small', icon:"Edit",

        //         on: {
        //          onClick: function() {
        //             self.dialogFormEditVisible = true
        //             self.listUpdate = { // 弹窗
        //               eqpClassId: params.row.id, // id
        //               name: params.row.name, // 模糊匹配，设备分类名称
        //               toAndonTime: params.row.toAndonTime // 安灯提报时间上限
        //             }
        //           }
        //         }
        //       }, '')
        //     ])
        //   }
        // }
      ]
      self.onQuery() // 查询
    }, // 查询
    onBtnQuery() {
      this.listQuery.pg_pagenum = 1
      this.onQuery()
    },
    // 查询
    onQuery() {
      this.tableData = []
      getCateList(this.listQuery).then(response => {
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
    saveUpdateData(listUpdate) {
      this.$refs[listUpdate].validate((valid) => {
        if (valid) {
          const req = {}
          req.eqpClassId = this.listUpdate.eqpClassId
          req.toAndonTime = this.listUpdate.toAndonTime
          timetoandon(req).then(response => {
            this.dialogFormCopyVisible = false
            $message('修改成功', 'success')
            this.onQuery('listQuery') // 查询
          })
          this.dialogFormEditVisible = false
        } else {
          $message('请填写必填项(安灯触发时间上限)', 'warning')
          return false
        }
      })
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
