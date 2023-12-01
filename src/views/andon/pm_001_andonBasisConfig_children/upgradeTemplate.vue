<template>
  <div class="app-container">

    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline demo-form-zdy">
        <el-form-item size="mini">
          <el-button type="primary" icon="Plus" @click="onAdd"></el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      :heightTable="heightTable"
      :data="tableData"
      :border="true"
      header-cell-class-name="bgblue"
      style="width: 100%"
      stripe
      row-key="id"
    >
      <el-table-column
        prop="upgradeName"
        label="升级模板名称"
        align="center"
        min-width="15%"
      />
      <el-table-column
        prop="upgradeTime"
        align="center"
        label="升级时间"
        min-width="15%"
      />
      <el-table-column
        min-width="20%"
        align="center"
        label="操作"
      >
        <template #default="scope">
          <el-button-group>
            <el-button
              plain
              icon="Edit"
              type="primary"
              @click="editTemplate(scope.row)"
            >
            </el-button>
            <el-button
              plain
              icon="Delete"
              type="danger"
              @click="deleteTemplate(scope.row)"
            >
            </el-button>
              <el-button
                plain
                @click="confirmChoose(scope.row)"
              >确认选择</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="listQuery.pg_pagenum"
      :page-sizes="[100, 200, 500]"
      :page-size="listQuery.pg_pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @Paginate="getList"
    />

    <!--弹窗新增或修改角色定义-->
    <el-dialog v-dialogDrag  :close-on-click-modal="false" :title="textMap[dialogStatus]" v-model="dialogFormVisible" class="roleDialog" :append-to-body="true">
      <el-form ref="listUpdate" label-position="right" label-width="130px" :rules="submitRules" :model="listUpdate">
        <el-form-item label="升级模板名称:" prop="upgradeName" size="mini">
          <el-input v-model="listUpdate.upgradeName" placeholder="升级模板名称" style="width: 320px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="升级时间:" prop="upgradeTime" size="mini">
          <el-input-number v-model="listUpdate.upgradeTime" :min="0" label="升级时间" style="width: 150px;" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="saveData('listUpdate')" size="mini">
          保存
        </el-button>
      </div>
      </template>
    </el-dialog>

  </div>
</template>

<script>
// import treeTransfer from 'el-tree-transfer' // 引入

// 模板升级查询、模板升级的新增与编辑,模板升级删除
import { getUpgradeTempList, getUpgradeTempUpdate, deleteUpgradeTemp } from '@/api/andonConfig'

export default {
  name: 'Table',
  props: {
    confirmBtn: { // 控制确认按钮显示隐藏
      type: String,
      default: 'none'
    }
  },
  data() {
    return {
      heightTable: '300px',
      dialogStatus: '', // 角色列表表格新增或者修改状态控制
      textMap: { // 控制弹窗提示字
        update: '修改',
        create: '添加'
      },
      dialogFormVisible: false, // 角色列表表格新增或者修改弹窗显示或者隐藏 false为隐藏，true显示
      total: 0, // 角色列表表格总条数
      listQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10 // 查询第几页数据，默认第一页 pg_pagesize
      },
      listUpdate: { // 弹窗
        upgradeName: '', // 模板名称,不能添加已存在的名称
        upgradeTime: '', // 升级时间(分钟)
        id: '' // 主键。如果是修改操作，则需要传递修改数据的id值
      },
      tableData: [], // 角色分类列表表格数据
      rowHeader: [],
      formLabelWidth: '120px',
      // 检验规则
      submitRules: {
        upgradeName: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        upgradeTime: [
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
    // 查询
    onQuery() {
      this.tableData = []
      getUpgradeTempList(this.listQuery).then(response => {
        this.tableData = response.data
        this.total = response.total_count
      })
    },
    // input框及下拉框输入值触发查询
    handleFilterChange(event) {
      this.listQuery.pg_pagenum = 1
      this.onQuery() // 查询
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
        upgradeName: '', // 模板名称,不能添加已存在的名称
        upgradeTime: '' // 升级时间(分钟)
      }
    },
    // 保存
    saveData(listUpdate) {
      this.$refs[listUpdate].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          const req = { ...this.listUpdate }
          req.upgradeTime = req.upgradeTime.toString()
          getUpgradeTempUpdate([req]).then(response => {
            this.$message({ message: (this.dialogStatus === 'create' ? '添加成功' : '修改成功'), type: 'success' })
            this.onQuery() // 查询
          })
        } else {
          this.$message({ message: '请填写必填项', type: 'warning' })
          return false
        }
      })
    },
    editTemplate(row){
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.listUpdate = { // 弹窗
        upgradeName: row.upgradeName, // 模板名称,不能添加已存在的名称
        upgradeTime: row.upgradeTime, // 升级时间(分钟)
        id: row.id // 主键。如果是修改操作，则需要传递修改数据的id值
      }
    },
    deleteTemplate(row){
      this.dataListUpdate = row
      this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUpgradeTemp({id: row.id}).then(response => {
          this.$message({ message: '删除成功', type: 'success' })
          this.onQuery() // 查询
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    },
    confirmChoose(row){
      this.$emit('confirmEmit', { confirmVisible: true, confirmData: row })
      this.confirmVisible = false
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

