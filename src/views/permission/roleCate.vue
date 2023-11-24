<template>
  <div class="app-container app-containerC">

    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="角色分类">
          <el-input v-model="listQuery.cName" placeholder="角色分类" style="width: 180px;" class="filter-item" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="onBtnQuery">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Plus" @click="onAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      :data="tableData"
      :border="true"
      header-cell-class-name="bgblue"
      style="width: 100%"
      stripe
      row-key="id"
    >
      <el-table-column
        prop="index"
        label="序号"
        align="center"
        min-width="5%"
        >
        <template v-slot:default="scope">
          <span>{{(scope.$index + 1)}} </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="cName"
        label="分类名称"
        align="center"
        min-width="15%"
      />
      <el-table-column
        prop="cIntro"
        align="center"
        label="分类描述"
        min-width="15%"
      />
      <el-table-column
        min-width="6%"
        align="center"
        label="操作"
      >
        <template v-slot="scope">
          <el-button

            plain
            type="primary"
            icon="Edit"
            @click = "editRole(scope.row)"
          >
          </el-button>
          <el-button

            plain
            type="danger"
            icon="Delete"
            @click="deleteRole(scope.row)"
          >
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="listQuery.pg_pagenum"
      :page-sizes="[100, 200, 500]"
      :page-size="listQuery.pg_pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--弹窗新增或修改角色定义-->
    <el-dialog v-dialogDrag  :close-on-click-modal="false" :title="textMap[dialogStatus]" v-model="dialogFormVisible" class="roleDialog">
      <el-form ref="listUpdate" label-position="right" label-width="90px" :rules="submitRules" :model="listUpdate">
        <el-form-item label="分类名称:" prop="name">
          <el-input v-model="listUpdate.cName" placeholder="角色名称" style="width: 320px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="分类描述:" prop="desc">
          <el-input v-model="listUpdate.cIntro" placeholder="角色介绍" style="width: 320px;" class="filter-item" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData('listUpdate'):updateData('listUpdate')">
          保存
        </el-button>
      </div>
      </template>
    </el-dialog>

  </div>
</template>

<script>
// import treeTransfer from 'el-tree-transfer' // 引入

// 角色分类列表分页查询、角色分类列表添加和修改、角色分类删除
import { getRoleCate, postRoleCate, deleteRoleCate } from '@/api/role'

export default {
  name: 'Table',
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
        pg_pagenum:1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        cIntro: '', // 模糊匹配，角色介绍，描述此角色的用途等
        cName: '' // 模糊匹配，角色名称
      },
      listUpdate: { // 弹窗
        cIntro: '', // 模糊匹配，角色介绍，描述此角色的用途等
        cName: '' // 模糊匹配，角色名称
      },
      tableData: [], // 角色分类列表表格数据
      rowHeader: [],
      formLabelWidth: '120px',
      // 检验规则
      submitRules: {
        cName: [
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
      this.onQuery() // 查询
    },
    onBtnQuery() {
      this.listQuery.pg_pagenum = 1
      this.onQuery() // 查询
    },
    // 查询
    onQuery() {
      let test = []
      getRoleCate(this.listQuery).then(response => {
        console.log("角色分类原始数据,",response.data)
        this.tableData = response.data
        test = response.data
        console.log("角色分类数据,",this.tableData)
        console.log("角色分类数据2,",test)
        this.total = response.total_count
      })
    },
    // 分页数据发生变化
    handleSizeChange(val) {
      this.listQuery.pg_pagesize = val
      this.onQuery() // 查询
    },
    handleCurrentChange(val) {
      this.listQuery.pg_pagenum = val
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
        cIntro: '', // 模糊匹配，角色介绍，描述此角色的用途等
        cName: '' // 模糊匹配，角色名称
      }
    },
    // 角色新增保存数据
    createData(listUpdate) {
      this.$refs[listUpdate].validate((valid) => {
        if (valid) {
          const req = { ...this.listUpdate }
          postRoleCate(req).then(response => {
            this.dialogFormVisible = false
            this.$message({ message: '添加成功', type: 'success' })
            this.onQuery() // 查询
          })
        } else {
          this.$message({ message: '请填写必填项', type: 'warning' })
          return false
        }
      })
    },
    // 角色修改保存数据
    updateData(listUpdate) {
      this.$refs[listUpdate].validate((valid) => {
        if (valid) {
          const req = { ...this.listUpdate }
          req.id = this.dataListUpdate.id
          postRoleCate(req).then(response => {
            this.dialogFormVisible = false
            this.$message({ message: '修改成功', type: 'success' })
            this.onQuery() // 查询
          })
        } else {
          this.$message({ message: '请填写必填项', type: 'warning' })
          return false
        }
      })
    },
    //编辑按钮
    editRole(row){
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.listUpdate = { // 弹窗
        cIntro: row.cIntro, // 模糊匹配，角色介绍，描述此角色的用途等
        cName: row.cName // 模糊匹配，角色名称
      }
      this.dataListUpdate = row
    },
    //删除按钮
    deleteRole(row){
      this.dataListUpdate = row
      this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const req = { id: row.id }
        deleteRoleCate(req).then(response => {
          this.$message({ message: '删除成功', type: 'success' })
          this.onQuery() // 查询
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
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

