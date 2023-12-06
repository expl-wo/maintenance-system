<template>
  <div class="app-container app-containerC">

    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="异常名称"  size="small">
          <el-input v-model="listQuery.name" placeholder="异常名称" style="width: 180px;" class="filter-item" size="small" clearable/>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="Search" @click="onBtnQuery">查询</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="Plus" @click="onAdd">新增</el-button>
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

    <!--弹窗新增或修改角色定义-->
    <el-dialog draggable :close-on-click-modal="false" :title="textMap[dialogStatus]"  v-model="dialogFormVisible" class="roleDialog">
      <el-form ref="listUpdate" label-position="right" label-width="130px" :rules="submitRules" :model="listUpdate">
        <el-form-item label="异常名称:" prop="name"  size="small">
          <el-input v-model="listUpdate.name" placeholder="异常名称" style="width: 320px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="异常描述:"  size="small">
          <el-input v-model="listUpdate.description" placeholder="异常描述" style="width: 320px;" class="filter-item" />
        </el-form-item>
      </el-form>
      <div   class="dialog-footer">
        <el-button @click="dialogFormVisible = false"  size="small">取 消</el-button>
        <el-button type="primary"  size="small" @click="dialogStatus==='create'?createData('listUpdate', '添加成功'):updateData('listUpdate', '修改成功')">
          保存
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
// import treeTransfer from 'el-tree-transfer' // 引入
import TableSimple from '@/components/Table/index'

// 故障分类查询、故障分类的新增与编辑,故障分类删除
import { getFactorList, getFactorUpdate, deleteFactor } from '@/api/em/repairBase'
import { ElButton,ElButtonGroup} from "element-plus";

export default {
  name: 'Table',
  components: { TableSimple },
  data() {
    return {
      dialogStatus: '', // 角色列表表格新增或者修改状态控制
      textMap: { // 控制弹窗提示字
        update: '修改',
        create: '添加'
      },
      dialogFormVisible: false, // 角色列表表格新增或者修改弹窗显示或者隐藏 false为隐藏，true显示
      total: 0, // 角色列表表格总条数
      listQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        name: '' // 模糊匹配，角色名称
      },
      listUpdate: { // 弹窗
        description: '', // 模糊匹配，故障分类描述
        name: '' // 模糊匹配，故障分类名称
      },
      tableData: [], // 角色分类列表表格数据
      rowHeader: [],
      formLabelWidth: '120px',
      // 检验规则
      submitRules: {
        name: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ]
      }
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
          label: '异常名称'
        },
        {
          prop: 'description',
          align: 'center',
          label: '异常描述'
        },
        // 添加操作按钮
        {
          prop: '',
          align: 'center',
          label: '操作',
          width: 140,
          render: (h, params) => {
            return h(ElButtonGroup, ()=>[
              h(ElButton, {
                type: 'primary', size: 'small', icon:"Edit",
                // style: { marginRight: '0px' },
                onClick: function() {
                  self.dialogFormVisible = true
                  self.dialogStatus = 'update'
                  self.listUpdate = { // 弹窗
                    id: params.row.id,
                    description: params.row.description, // 模糊匹配，故障分类描述
                    name: params.row.name // 模糊匹配，故障分类名称
                  }
                }
              },() => ''),
              h(ElButton, {
                type: 'danger', size: 'small', icon: "Delete",
                onClick: function() {
                  self.dataListUpdate = params.row
                  self.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    const req = { ids: [params.row.id] }
                    deleteFactor(req).then(response => {
                      self.$message({ message: '删除成功', type: 'success' })
                      self.onQuery() // 查询
                    })
                  }).catch(() => {
                    self.$message({ type: 'info', message: '已取消删除' })
                  })
                }
              },() => '')

            ])
          }
        }
      ]
      self.onQuery() // 查询
    },
    // 查询
    onBtnQuery() {
      this.listQuery.pg_pagenum = 1
      this.onQuery()
    },
    // 查询
    onQuery() {
      this.tableData = []
      getFactorList(this.listQuery).then(response => {
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
    // 添加 角色新增与编辑的保存操作
    onAdd() {
      this.clearData() // 清空添加的数据
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
    },
    // 清空添加的数据
    clearData() {
      this.listUpdate = { // 弹窗
        description: '', // 模糊匹配，故障分类描述
        name: '' // 模糊匹配，故障分类名称
      }
    },
    // 角色新增保存数据
    createData(listUpdate, message) {
      this.saveData(listUpdate, message)
    },
    // 角色修改保存数据
    updateData(listUpdate, message) {
      this.saveData(listUpdate, message)
    },
    // 保存
    saveData(listUpdate, message) {
      this.$refs[listUpdate].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          const req = { ...this.listUpdate }
          getFactorUpdate(req).then(response => {
            if (response.err_code === 10000){
              this.$message({ message: message, type: 'success' })
              this.onQuery() // 查询
            }else {
              this.$message({ message: response.err_msg, type: 'error' })
            }
          })
        } else {
          this.$message({ message: '请填写必填项', type: 'warning' })
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

