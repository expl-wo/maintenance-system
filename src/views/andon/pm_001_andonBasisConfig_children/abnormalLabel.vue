<template>
  <div class="app-container">

    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline demo-form-zdy">
        <el-form-item size="small">
          <el-button type="primary" icon="plus" @click="onAdd"></el-button>
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
      :heightTable="heightTable"
    >
      <el-table-column
        prop="tagName"
        label="标签名称"
        align="center"
        min-width="15%"
      />
      <el-table-column
        prop="tagDesc"
        align="center"
        label="标签描述"
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
              @click="editTag(scope.row)"
            >
            </el-button>
            <el-button
              plain
              icon="Delete"
              type="danger"
              @click="deleteTag(scope.row)"
            >
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!--弹窗新增或修改角色定义-->
    <el-dialog draggable  :close-on-click-modal="false" :title="textMap[dialogStatus]" v-model="dialogFormVisible" class="roleDialog" :append-to-body="true">
      <el-form ref="listUpdate" label-position="right" label-width="130px" :rules="submitRules" :model="listUpdate">
        <el-form-item label="异常项名称:" size="small">
          <el-input v-model="listUpdate.abnormaName" placeholder="异常项名称" style="width: 320px;" class="filter-item" disabled />
        </el-form-item>
        <el-form-item label="标签名称:" prop="tagName" size="small">
          <el-input v-model="listUpdate.tagName" placeholder="标签名称" style="width: 320px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="标签描述:" size="small">
          <el-input v-model="listUpdate.tagDesc" placeholder="标签描述" style="width: 320px;" class="filter-item" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="saveData('listUpdate')" size="small">
          保存
        </el-button>
      </div>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import TableSimple from '@/components/Table/index'

// 故障分类查询、故障分类的新增与编辑,故障分类删除
import { getAndonConfigTagList, getAndonConfigTagUpdate, deleteAndonConfigTag } from '@/api/andonConfig'

export default {
  name: 'Table',
  props: ['abnormalIdChild'],
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
        abnormalId: '', // 异常项id
        abnormaName: '', // 异常项名称
        tagName: '', // 标签名
        tagDesc: '', // 标签描述
        id: '', // 主键。如果是修改操作，则需要传递修改数据的id值
      },
      tableData: [], // 角色分类列表表格数据
      rowHeader: [],
      formLabelWidth: '120px',
      // 检验规则
      submitRules: {
        tagName: [
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
          width: 60,
          align: 'center',
          label: '序号'
        },
        {
          prop: 'tagName',
          align: 'center',
          label: '标签名称'
        },
        {
          prop: 'tagDesc',
          align: 'center',
          label: '标签描述'
        },
        // 添加操作按钮
        {
          prop: '',
          align: 'center',
          label: '操作',
          width: 110,
          render: (h, params) => {
            return h('el-button-group', [
              h('el-button', {
                props: { type: 'primary', size: 'mini', icon: 'el-icon-edit' },
                // style: { marginRight: '0px' },
                on: {
                  click: function() {
                    self.dialogFormVisible = true
                    self.dialogStatus = 'update'
                    self.listUpdate = { // 弹窗
                      abnormalId: self.abnormalIdChild.id, // 异常项id
                      tagName: params.row.tagName, // 标签名
                      tagDesc: params.row.tagDesc, // 标签描述
                      id: params.row.id // 标签描述
                    }
                  }
                }
              }, ''),
              h('el-button', {
                props: { type: 'danger', size: 'mini', icon: 'el-icon-delete' },
                on: {
                  click: function() {
                    self.dataListUpdate = params.row
                    self.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                      deleteAndonConfigTag({id: params.row.id}).then(response => {
                        self.$message({ message: '删除成功', type: 'success' })
                        self.onQuery() // 查询
                      })
                    }).catch(() => {
                      self.$message({ type: 'info', message: '已取消删除' })
                    })
                  }
                }
              }, '')

            ])
          }
        }
      ]
      self.onQuery() // 查询
    },
    // 查询
    onQuery() {
      this.tableData = []
      getAndonConfigTagList({abnormalId: this.abnormalIdChild.id}).then(response => {
        this.tableData = response.data
        this.total = response.total_count
      })
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
        abnormalId: this.abnormalIdChild.id, // 异常项id
        abnormaName: this.abnormalIdChild.abnormalName, // 异常项名称
        tagName: '', // 标签名
        tagDesc: '' // 标签描述
      }
    },
    // 保存
    saveData(listUpdate) {
      this.$refs[listUpdate].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          const req = { ...this.listUpdate }
          getAndonConfigTagUpdate(req).then(response => {
            this.$message({ message: (this.dialogStatus === 'create' ? '添加成功' : '修改成功'), type: 'success' })
            this.onQuery() // 查询
          })
        } else {
          this.$message({ message: '请填写必填项', type: 'warning' })
          return false
        }
      })
    },
    editTag(row){
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.listUpdate = { // 弹窗
        abnormalId: this.abnormalIdChild.id, // 异常项id
        tagName: row.tagName, // 标签名
        tagDesc: row.tagDesc, // 标签描述
        id: row.id // 标签描述
      }
    },
    deleteTag(row){
      this.dataListUpdate = row
      this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAndonConfigTag({id: row.id}).then(response => {
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

