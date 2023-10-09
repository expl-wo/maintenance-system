<template>
  <!--角色列表-->
  <div class="app-container app-containerC">

    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="角色名称" size="mini">
          <el-input v-model="listQuery.rName" size="mini" placeholder="角色名称" style="width: 180px;" class="filter-item" clearable />
        </el-form-item>
        <el-form-item label="角色介绍" size="mini">
          <el-input v-model="listQuery.rIntro" size="mini" placeholder="角色介绍" style="width: 180px;" class="filter-item" clearable />
        </el-form-item>
        <el-form-item label="是否可用" size="mini">
          <el-select v-model="listQuery.rEnabled" placeholder="请选择" style="width: 100px;" @change="handleFilterChange($event)">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item size="mini">
          <el-button type="primary" icon="el-icon-search" @click="onBtnQuery">查询</el-button>
        </el-form-item>
        <el-form-item size="mini">
          <el-button type="primary" icon="el-icon-plus" @click="onAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </div>

<!--    <table-simple-->
<!--      class="otherCon wp"-->
<!--      :data="tableData"-->
<!--      :row-header="rowHeader"-->
<!--      :total="total"-->
<!--      :page="listQuery.pg_pagenum"-->
<!--      :limit="listQuery.pg_pagesize"-->
<!--      @pagination="getList"-->
<!--    />-->

    <!--弹窗新增或修改角色定义-->
    <el-dialog v-dialogDrag append-to-body :close-on-click-modal="false" :title="textMap[dialogStatus]" v-model="dialogFormVisible" class="roleDialog">
      <el-form ref="listUpdate" label-position="right" label-width="90px" :rules="submitRules" :model="listUpdate">
        <el-form-item label="角色名称:" prop="name" size="mini">
          <el-input v-model="listUpdate.rName" placeholder="角色名称" style="width: 360px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="角色分类:" prop="cateId" size="mini">
          <el-select v-model="listUpdate.cateId" placeholder="请选择" style="width: 360px;" @change="cateChange">
            <el-option
              v-for="item in tableDataClassification"
              :key="item.id"
              :label="item.cName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色介绍:" size="mini">
          <el-input v-model="listUpdate.rIntro" placeholder="角色介绍" style="width: 360px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="是否可用:" size="mini">
          <el-select v-model="listUpdate.rEnabled" placeholder="请选择" style="width: 80px;">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="dialogStatus==='create'?createData('listUpdate'):updateData('listUpdate')">
          保存
        </el-button>
      </div>
    </el-dialog>

    <!--查看-->
    <el-dialog v-dialogDrag append-to-body :close-on-click-modal="false" title="查看" top="5vh" v-model="dialogViewVisible" class="roleDialog">
      <el-form label-position="right" label-width="120px" :model="dataListUpdate">
        <el-form-item label="角色名称:" size="small">
          {{ dataListUpdate.rName }}
        </el-form-item>
        <el-form-item label="角色分类:" size="small">
          {{ dataListUpdate.cateName }}
        </el-form-item>
        <el-form-item label="是否为内置角色:" size="small">
          <span v-if="dataListUpdate.isBuiltin == 1">是</span>
          <span v-if="dataListUpdate.isBuiltin == 0">否</span>
        </el-form-item>
        <el-form-item label="是否可用:" size="small">
          <span v-if="dataListUpdate.rEnabled == 1">可用</span>
          <span v-if="dataListUpdate.rEnabled == 0">否</span>
        </el-form-item>
        <el-form-item label="角色介绍:">
          {{ dataListUpdate.rIntro }}
        </el-form-item>
        <el-form-item label="包含权限:">
          <el-tree
            ref="Treetransfer"
            :data="dataTree"
            node-key="id"
            :props="props"
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="defaultCheckedKey"
            :render-content="renderContent"
            highlight-current
            size="mini"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogViewVisible = false">关 闭</el-button>
      </div>
    </el-dialog>

    <!--包含权限编辑-->
    <el-dialog v-dialogDrag append-to-body top="5vh" :close-on-click-modal="false" title="权限编辑" v-model="dialogPermissionVisible">
      <el-form label-position="right" label-width="120px" :model="dataListUpdate">
        <el-form-item label="角色名称" style="line-height: 36px !important;">
          {{ dataListUpdate.rName }}
        </el-form-item>
        <el-form-item label="包含权限">
          <el-tree
            ref="Treetransfer"
            :data="dataTreetransfer"
            show-checkbox
            node-key="id"
            :props="props"
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="defaultCheckedKey"
            :render-content="renderContent"
            highlight-current
            size="mini"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogPermissionVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="updatePermissionData()">
          保存
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
// import treeTransfer from 'el-tree-transfer' // 引入
import TableSimple from '../../components/Table/index'
// import { config } from '@vue/test-utils'
// 角色列表分页查询、添加和修改、根据角色ID查找角色中所包含所有权限的树状查询、角色与权限的绑定 保存操作、角色分类查询、删除角色
import { getRole, getRolePost, getPermtree, getPerm, getRoleCate, deleteRole, getRolePermids } from '@/api/role'
import { getHasAllTree } from '@/api/perm'

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
      dialogViewVisible: false, // 查看
      dialogPermissionVisible: false, // 包含权限
      total: 0, // 角色列表表格总条数
      listQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        rIntro: '', // 模糊匹配，角色介绍，描述此角色的用途等
        rName: '', // 模糊匹配，角色名称
        rEnabled: '1' // 精确匹配，此角色是否可用，bool值，参见枚举值定义
      },
      listUpdate: { // 弹窗
        rIntro: '', // 模糊匹配，角色介绍，描述此角色的用途等
        rName: '', // 模糊匹配，角色名称
        rEnabled: '1', // 精确匹配，此角色是否可用，bool值，参见枚举值定义
        cateId: '', // 角色分类id
        cateName: '' // 角色分类
      },
      dataListUpdate: {}, // 修改时数据存储
      tableData: [], // 角色列表表格数据
      tableDataClassification: [], // 角色分类列表
      rowHeader: [],
      props: {
        value: 'id', // ID字段名
        label: 'name', // 显示名称
        children: 'sub' // 子级字段名
      },
      dataTree: [], // 查看里的包含权限
      dataTreetransfer: [], // 已分配权限tree
      dataTreetransferList: [], // 已分配权限List
      dataHistorySelected: [], // 原有权限集合
      dataHistorySelectedId: [], // 原有权限id集合
      defaultCheckedKey: [], // 当前选中的权限
      formLabelWidth: '120px',
      // 检验规则
      submitRules: {
        rName: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        cateId: [
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
          width: 50,
          align: 'center',
          label: '序号'
        },
        {
          prop: 'rName',
          align: 'center',
          label: '角色名称'
        },
        {
          prop: 'rIntro',
          align: 'center',
          label: '角色介绍'
        },
        {
          prop: 'builtin',
          align: 'center',
          width: 70,
          label: '是否内置',
          render: (h, params) => {
            return h('div', [
              params.row.builtin === 1 ? '是' : '否'
            ])
          }
        },
        {
          prop: 'rEnabled',
          align: 'center',
          width: 70,
          label: '是否可用',
          render: (h, params) => {
            return h('div', [
              params.row.rEnabled === 1 ? '可用' : '否'
            ])
          }
        },
        // 添加操作按钮
        {
          prop: '',
          align: 'center',
          label: '操作',
          width: 230,
          render: (h, params) => {
            return h('el-button-group', [
              h('el-button', {
                props: { type: 'primary', size: 'mini' },
                on: {
                  click: function() {
                    const req = { roleId: params.row.id }
                    self.defaultCheckedKey = []
                    self.dataTreetransfer = [] // 所有菜单tree
                    self.dataTreetransferList = [] // 所有菜单List
                    self.dataHistorySelectedId = [] // 原有权限id集合
                    // 角色中所包含所有权限的树状查询
                    getRolePermids(req).then(response => {
                      self.dataHistorySelectedId = response.data
                      self.defaultCheckedKey = JSON.parse(JSON.stringify([...self.dataHistorySelectedId]))
                      // console.log(self.defaultCheckedKey)
                    })

                    getHasAllTree().then(response => {
                      self.dataTreetransfer = response.data
                      const data = response.data
                      if (data && data.length > 0) {
                        data.forEach(element => {
                          self.dataTreetransferList.push(element)
                          if (element.sub && element.sub.length > 0) {
                            select(element.sub)
                          }
                        })
                      }
                    })

                    function select(elementFather) {
                      elementFather.forEach(element => {
                        self.dataTreetransferList.push(element)
                        if (element.sub && element.sub.length > 0) {
                          select(element.sub)
                        }
                      })
                    }

                    self.dataListUpdate = params.row
                    self.dialogPermissionVisible = true
                  }
                }
              }, '包含权限编辑'), // 包含权限编辑
              h('el-button', {
                props: { type: 'primary', size: 'mini' },
                on: {
                  click: function() {
                    self.dataTree = []
                    const req = { roleId: params.row.id }
                    // 角色中所包含所有权限的树状查询
                    getPermtree(req).then(response => {
                      self.dataTree = response.data
                    })
                    self.dataListUpdate = params.row
                    self.dialogViewVisible = true
                  }
                }
              }, '查看'), // 查看
              h('el-button', {
                props: { type: 'primary', size: 'mini', icon: 'el-icon-edit' },
                // style: { marginRight: '0px' },
                on: {
                  click: function() {
                    self.onQueryCate() // 查询角色分类
                    self.dialogFormVisible = true
                    self.dialogStatus = 'update'
                    self.listUpdate = { // 弹窗
                      rIntro: params.row.rIntro, // 模糊匹配，角色介绍，描述此角色的用途等
                      rName: params.row.rName, // 模糊匹配，角色名称
                      rEnabled: params.row.rEnabled.toString(), // 精确匹配，此角色是否可用，bool值，参见枚举值定义
                      cateId: params.row.cateId, // 角色分类id
                      cateName: params.row.cateName // 角色分类名称
                    }
                    self.dataListUpdate = params.row
                  }
                }
              }, ''), // 修改
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
                      const req = { id: params.row.id }
                      deleteRole(req).then(response => {
                        self.$message({ message: '删除成功', type: 'success' })
                        self.onQuery() // 查询
                      })
                    }).catch(() => {
                      self.$message({ type: 'info', message: '已取消删除' })
                    })
                  }
                }
              }, '') // 删除

            ])
          }
        }
      ]
      self.onQuery() // 查询
    },
    onBtnQuery() {
      this.listQuery.pg_pagenum = 1
      this.onQuery() // 查询
    },
    // 查询
    onQuery() {
      this.tableData = []
      getRole(this.listQuery).then(response => {
        this.tableData = response.data
        this.total = response.total_count
      })
    },
    // 查询角色分类
    onQueryCate() {
      const req = { cName: '', pg_pagesize: 10000, pg_pagenum: 1 }
      // 查询角色分类
      getRoleCate(req).then(response => {
        this.tableDataClassification = response.data
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
      this.onQueryCate() // 查询角色分类
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
    },
    // 清空添加的数据
    clearData() {
      this.listUpdate = { // 弹窗
        rIntro: '', // 模糊匹配，角色介绍，描述此角色的用途等
        rName: '', // 模糊匹配，角色名称
        rEnabled: '1' // 精确匹配，此角色是否可用，bool值，参见枚举值定义
      }
    },
    // 角色新增保存数据
    createData(listUpdate) {
      this.$refs[listUpdate].validate((valid) => {
        if (valid) {
          const req = { ...this.listUpdate }
          req.enabled = parseInt(req.enabled)
          getRolePost(req).then(response => {
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
          req.enabled = parseInt(req.enabled)
          req.id = this.dataListUpdate.id
          getRolePost(req).then(response => {
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
    // 权限编辑 控制树的字体颜色
    renderContent(h, { node, data, store }) {
      //todo
      var col = ''
      // // 判断当前节点是否是当前所拥有的的权限，是字体为蓝色，不是字体默认为黑
      // if (this.dataHistorySelectedId.indexOf(node.data.id) > -1) {
      //   col = 'col_blue'
      // }
      // return (
      //   <span class='custom-tree-node'>
      //     <span class={col}>{node.label}</span>
      //   </span>
      // )
    },
    // 保存权限
    updatePermissionData() {
      const getCheckedNodes = this.$refs.Treetransfer.getCheckedNodes()
      console.log(this.dataTreetransferList)
      console.log(getCheckedNodes)
      const fatherArray = [] // 父节点
      this.dataTreetransferList.forEach(element => {
        getCheckedNodes.forEach(element2 => {
          if (element.id == element2.fid) {
            fatherArray.push(element)
            if (element.fid) {
              select(element.fid, this.dataTreetransferList)
            }
          }
        })
      })

      function select(fid, dataTreetransferList) {
        dataTreetransferList.forEach(element => {
          if (element.id == fid) {
            fatherArray.push(element)
            if (element.fid) {
              select(element.fid, dataTreetransferList)
            }
          }
        })
      }

      // 去除数组中重复的
      function unique(arr) {
        for (var i = 0, len = arr.length; i < len; i++) {
          for (var j = i + 1, len = arr.length; j < len; j++) {
            if (arr[i].id === arr[j].id) {
              arr.splice(j, 1)
              j-- // 每删除一个数j的值就减1
              len-- // j值减小时len也要相应减1（减少循环次数，节省性能）
            }
          }
        }
        return arr
      }

      fatherArray.forEach(element => {
        getCheckedNodes.push(element)
      })

      unique(getCheckedNodes)

      const req = { roleId: this.dataListUpdate.id, perm: getCheckedNodes }
      getPerm(req).then(response => {
        this.dialogPermissionVisible = false
        this.$message({ message: '修改成功', type: 'success' })
        this.onQuery() // 查询
      })
    },
    // 切换角色分类
    cateChange(event) {
      this.tableDataClassification.forEach((item) => {
        if (item.id === event) {
          this.listUpdate.cateName = item.name
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

>>>.el-form-item--small .el-form-item__content{
  line-height: 32px !important;
}

>>>.el-form-item--medium .el-form-item__content{
  line-height: 36px !important;
}

>>>.el-dialog__body{
  max-height: 75vh!important;
  overflow: auto;
}

</style>

