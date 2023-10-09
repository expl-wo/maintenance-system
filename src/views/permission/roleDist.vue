<template>
  <div class="app-container">

    <el-row :gutter="12" class="hp">
      <el-col :span="6" class="hp p-lf">
        <el-card shadow="hover" class="hp">
          <div slot="header" class="clearfix">
            <span>组织机构</span>
          </div>
           <el-tree
              ref="Treetransfer"
              highlight-current
              :data="dataTree"
              node-key="id"
              :props="props"
              :default-expanded-keys="[2, 3]"
              @node-click="handleNodeClick"
              size="mini"
            />
        </el-card>
      </el-col>
      <el-col :span="18" class="hp p-rf">
        <el-card shadow="hover" class="hp">
          <div slot="header" class="clearfix">
            <span>员工信息</span>
          </div>
          <div class="wp hp app-containerC">
            <div class="filter-container">
              <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
                <el-form-item label="员工姓名" size="mini">
                  <el-input v-model="listQuery.ownerName" placeholder="员工姓名" style="width: 180px;" class="filter-item" clearable/>
                </el-form-item>
                <el-form-item label="角色名称" size="mini">
                  <el-input v-model="listQuery.roleName" placeholder="角色名称" style="width: 180px;" class="filter-item" clearable/>
                </el-form-item>
                <el-form-item size="mini">
                  <el-button type="primary" icon="el-icon-search" @click="onQueryWithNoGsbmId">查询</el-button>
                </el-form-item>
                <el-form-item size="mini">
                  <el-button type="primary" icon="el-icon-plus" @click="onAdd">新增角色分配</el-button>
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
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!--弹窗新增或修改角色定义-->
    <el-dialog v-dialogDrag  :close-on-click-modal="false" :title="textMap[dialogStatus]" v-model="dialogFormVisible" class="roleDialog720">
      <el-form ref="listUpdate" label-position="right" label-width="150px" :rules="submitRules" :model="listUpdate">
        <el-form-item label="分配角色:" prop="roleName" size="mini">
          <el-input v-model="listUpdate.roleName" placeholder="" style="width: 410px;" class="filter-item" size="mini" :disabled="true" />
          <el-button type="primary" icon="el-icon-add" @click="chooseRole">请选择角色</el-button>
        </el-form-item>
        <el-form-item label="角色拥有者:" prop="ownerName" size="mini">
          <el-input v-model="listUpdate.ownerName" type="textarea" :rows="4" placeholder="" :disabled="true" style="width: 410px;" />
          <el-button type="primary" icon="el-icon-add" @click="choosePeople">请选择人员</el-button>
        </el-form-item>
        <!-- <el-form-item label="所属部门:" prop="deptName" size="small">
          <el-checkbox label="自动分配至用户隶属部门" v-model="listUpdate.deptChecked" @change="deptChecked" name="type"></el-checkbox>
        </el-form-item> -->
        <el-form-item label="授权部门" size="mini" prop="deptName">
          <el-input v-model="listUpdate.deptName" placeholder="" style="width: 410px;" class="filter-item" size="mini" :disabled="true" />
          <el-button type="primary" icon="el-icon-add" @click="chooseDepartment">请选择授权部门</el-button>
          <div class="placeholderDiv">如果不选择'授权部门'，则默认分配至所选用户的隶属部门(非必填项)</div>
        </el-form-item>
        <el-form-item v-if="noLimitZt" label="限制账套" size="mini" prop="limitZt">
          <el-checkbox v-model="listUpdate.limitZt" :checked="listUpdate.limitZt==1" :true-label="1" :false-label="0">业务范围限制为授权部门所在账套</el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="createData('listUpdate')" size="mini">
          保存
        </el-button>
      </div>
    </el-dialog>

    <!--选择角色-->
    <el-dialog v-dialogDrag  :close-on-click-modal="false" :title="textTableMap[dialogTableStatus]" v-model="dialogTableVisible" class="roleDialog800">
      <el-form label-position="right" label-width="90px" :model="listTableUpdate" :inline="true" class="demo-form-inline demo-form-zdy">
        <el-form-item label="角色名称:" prop="name" size="mini">
          <el-input v-model="listTableUpdate.rName" placeholder="角色名称" style="width: 180px;" class="filter-item" size="mini" />
        </el-form-item>
        <el-form-item label="角色介绍:" prop="intro" size="mini">
          <el-input v-model="listTableUpdate.rIntro" placeholder="角色介绍" style="width: 180px;" class="filter-item" size="mini" />
        </el-form-item>
        <el-form-item size="mini">
          <el-button type="primary" icon="el-icon-search" @click="onRoleQuery">查询</el-button>
        </el-form-item>
      </el-form>
      <table-simple
        :heightTable="heightTable"
        :data="tableRoleData"
        :row-header="rowTableHeader"
        :total="totalRole"
        :page="listTableUpdate.pg_pagenum"
        :limit="listTableUpdate.pg_pagesize"
        @pagination="getRoleList"
      />

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false" size="mini">关 闭</el-button>
        <!-- <el-button type="primary" @click="dialogTableStatus==='chooseDepartment'?createTableData():updateTableData()">
          保存
        </el-button> -->
      </div>
    </el-dialog>

    <!--选择部门-->
    <el-dialog v-dialogDrag  :close-on-click-modal="false" :title="textTableMap[dialogTableStatus]" v-model="dialogTableDeptVisible" class="roleDialog800">
      <el-form label-position="right" label-width="110px" :model="listTableDeptUpdate" :inline="true" class="demo-form-inline demo-form-zdy">
        <el-form-item label="组织机构名称:" prop="name" size="mini">
          <el-input v-model="listTableDeptUpdate.oName" placeholder="组织机构名称" style="width: 180px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="组织机构编号:" prop="orgCode" size="mini">
          <el-input v-model="listTableDeptUpdate.oCode" placeholder="组织机构编号" style="width: 180px;" class="filter-item" />
        </el-form-item>
        <el-form-item size="mini">
          <el-button type="primary" icon="el-icon-search" @click="onDeptQuery">查询</el-button>
        </el-form-item>
      </el-form>
<!--      <table-simple-->
<!--        :heightTable="heightTable"-->
<!--        :data="tableDeptData"-->
<!--        :row-header="rowTableDeptHeader"-->
<!--        :total="totalDept"-->
<!--        :page="listTableDeptUpdate.pg_pagenum"-->
<!--        :limit="listTableDeptUpdate.pg_pagesize"-->
<!--        @pagination="getDeptList"-->
<!--      />-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableDeptVisible = false" size="mini">关 闭</el-button>
      </div>
    </el-dialog>

    <!--选择人员-->
    <el-dialog v-dialogDrag  :close-on-click-modal="false" :title="textTableMap[dialogTableStatus]" v-model="dialogTablePeopleVisible" class="roleDialog800">
      <el-form label-position="right" label-width="110px" :model="listTablePeopleUpdate" :inline="true" class="demo-form-inline demo-form-zdy">
        <el-form-item label="员工姓名:" prop="uName" size="mini">
          <el-input v-model="listTablePeopleUpdate.uName" placeholder="员工姓名" style="width: 180px;" class="filter-item" />
        </el-form-item>
        <el-form-item size="mini">
          <el-button type="primary" icon="el-icon-search" @click="onPeopleQuery(true)">查询</el-button>
        </el-form-item>
      </el-form>
<!--      <h3 v-show="owner.ownerNameArray.length > 0" class="col_blue m-0 font_size_10" style="padding: 0 8px;" v-for="(item,i) in owner.ownerNameArray">{{ item }}</h3>-->
      <el-tag v-show="owner.ownerNameArray.length > 0" v-for="(item,i) in owner.ownerNameArray" :key="i" closable @close="tagClose(i)">{{ item }}</el-tag>
      <table-simple
        :heightTable="heightTable"
        :data="tablePeopleData"
        :row-header="rowTablePeopleHeader"
        :total="totalPeople"
        :page="listTablePeopleUpdate.pg_pagenum"
        :limit="listTablePeopleUpdate.pg_pagesize"
        @pagination="getPeopleList"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTablePeopleVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="createTablePeopleData()" size="mini">
          确 认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import TableSimple from '../../components/Table/index'
// 组织机构树查询、组织机构列表查询
import { getOrgAlltree, getOrgAll } from '@/api/org'
// 角色列表分页查询 表格、查询角色、角色用户分配的新增与修改 保存操作,删除角色用户
import { getRoleUser, getRole, postRoleUser, deleteRoleUser } from '@/api/role'
// 查询人员
import { getUser } from '@/api/user'
//
import { getRoleLimitZt } from '@/utils/auth' // get RoleLimitZt from cookie

export default {
  components: { TableSimple },
  data() {
    return {
      heightTable: '300px',
      props: { // 组织结构树默认格式
        value: 'id', // ID字段名
        label: 'name', // 显示名称
        children: 'sub' // 子级字段名
      },
      noLimitZt: !getRoleLimitZt(),
      dataTree: [], // 组织结构树数据
      rowHeader: [], // 角色分配列表
      rowTableHeader: [], // 选择角色
      total: 0,
      listQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条
        pg_pagesize: 10, // 查询第几页数据，默认第一页
        roleName: '', // 模糊匹配，角色名称
        roleId: '', // 角色主键
        ownerGsbmId: '', // 角色拥有者的归属部门主键
        ownerGsbmName: '', // 角色拥有者的归属部门名称
        ownerId: '', // 角色拥有者的主键
        ownerName: '' // 角色拥有者的用户姓名
      },
      listUpdate: { // 弹窗
        roleId: '', // 角色id
        roleName: '', // 角色名称
        limitZt: 1, // 是否限制账套
        ownerId: '', // 要分配的用户ID数组，多个用户ID以英文逗号“,”分隔
        ownerName: '', // 要分配的用户name数组，多个用户名称以英文逗号“,”分隔
        useGsbm: 0, // int	bool值，是否默认使用授权用户的归属部门作为授权部门
        deptId: '', // 要授权管理的组织ID，如果使用默认部门【useGsbm==1】则此值为空
        deptName: '' // 要授权管理的组织名称，如果使用默认部门【useGsbm==1】则此值为空
      },

      owner: {
        ownerIdArray: [], // 要分配的用户ID数组，多个用户ID以英文逗号“,”分隔
        ownerNameArray: [] // 要分配的用户ID数组，多个用户ID以英文逗号“,”分隔
      },
      listTableUpdate: { // 查询角色
        pg_pagesize: 10, // 每页显示多少条数据，默认为10条
        pg_pagenum: 1, // 查询第几页数据，默认第一页
        name: '', // 角色名称
        intro: '', // 角色介绍
        enabled: 1 // 此角色是否可用，bool值，参见枚举值定义
      },
      // 检验规则
      submitRules: {
        roleName: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        ownerName: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ]
      },
      tableData: [], // 表格数据
      dataListUpdate: {}, // 修改时数据存储
      dialogFormVisible: false, // 角色列表表格新增或者修改弹窗显示或者隐藏 false为隐藏，true显示
      dialogStatus: '', // 角色列表表格新增或者修改状态控制
      textMap: { // 控制弹窗提示字
        update: '修改角色分配',
        create: '添加角色分配'
      },
      tableDataRoleName: [], // 角色名称集合
      totalRole: 0, // 角色表格条数
      tableRoleData: [], // 角色表格数据
      dialogTableVisible: false, // 选择角色和部门
      dialogTableStatus: '', // 角色列表表格新增或者修改状态控制
      textTableMap: {
        chooseRole: '选择角色',
        chooseDepartment: '选择部门',
        choosePeople: '选择人员'
      },
      dialogTableDeptVisible: false, // 部门表格显示隐藏
      rowTableDeptHeader: [], // 部门表格标题
      tableDeptData: [], // 部门表格内容
      totalDept: 0, // 部门表格数量
      listTableDeptUpdate: {
        pg_pagesize: 10, // 每页显示多少条数据，默认为10条
        pg_pagenum: 1, // 查询第几页数据，默认第一页
        oName: '',	// 组织机构名称
        oCode: ''	// 组织机构编号
      },
      dialogTablePeopleVisible: false, // 人员表格显示隐藏
      listTablePeopleUpdate: {
        pg_pagesize: 10, // 每页显示多少条数据，默认为10条
        pg_pagenum: 1, // 查询第几页数据，默认第一页
        uName: '' // 姓名
      },
      rowTablePeopleHeader: [], // 人员表格标题
      tablePeopleData: [], // 人员表格内容
      totalPeople: 0 // 人员表格数量
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  mounted() {
    this.onload()
  },
  methods: {
    tagClose(i){
      this.owner.ownerIdArray.splice(i,1);
      this.owner.ownerNameArray.splice(i,1);
      this.onPeopleQuery(true);
      return true;
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
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
          prop: 'ownerName',
          align: 'center',
          label: '员工姓名'
        },
        {
          prop: 'ownerCode',
          align: 'center',
          label: '员工编号'
        },
        {
          prop: 'roleName',
          align: 'center',
          label: '角色名称'
        },
        {
          prop: 'deptName',
          align: 'center',
          label: '授权部门'
        },
        // 添加操作按钮
        {
          prop: '',
          label: '操作',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('el-button-group', [
              // h('el-button', {
              //   props: { type: 'primary', size: 'mini', icon: 'el-icon-edit' },
              //   // style: { marginRight: '0px' },
              //   on: {
              //     click: function() {
              //       console.log(params.row)
              //       console.log(params.row.limitZt)
              //       self.dialogFormVisible = true
              //       self.dialogStatus = 'update'
              //       self.listUpdate = { // 弹窗
              //         roleId: params.row.roleId, // 角色id
              //         roleName: params.row.roleName, // 角色名称
              //         limitZt: params.row.limitZt || 0, // 是否限制账套
              //         ownerId: params.row.ownerId, // 要分配的用户ID数组，多个用户ID以英文逗号“,”分隔
              //         ownerName: params.row.ownerName, // 要分配的用户name数组，多个用户名称以英文逗号“,”分隔
              //         useGsbm: 0, // int	bool值，是否默认使用授权用户的归属部门作为授权部门
              //         deptId: params.row.deptId, // 要授权管理的组织ID，如果使用默认部门【useGsbm==1】则此值为空
              //         deptName: params.row.deptName // 要授权管理的组织名称，如果使用默认部门【useGsbm==1】则此值为空
              //       }
              //       self.dataListUpdate = params.row
              //       console.log(self.dataListUpdate)
              //     }
              //   }
              // }, ''), // 修改
              h('el-button', {
                props: { type: 'danger', size: 'mini', icon: 'el-icon-delete' },
                // style: { marginRight: '2px' },
                on: {
                  click: function() {
                    self.dataListUpdate = params.row
                    self.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                      deleteRoleUser({id: params.row.id}).then(response =>{
                        self.$message({ type: 'success', message: '删除成功!' })
                        self.onQuery() // 查询
                      })
                    }).catch(() => {
                      self.$message({ type: 'info', message: '已取消删除' })
                    })
                  }
                }
              }, '') //删除
            ])
          }
        }
      ]
      self.onQueryOrgAlltree() // 查询组织机构树
      self.onQuery() // 查询
      self.chooseRoleHeader() // 角色表格头
      self.chooseDeptHeader() // 部门表格头
      self.choosePeopleHeader() // 人员表格头
    },
    // 角色表格头
    chooseRoleHeader() {
      const self = this
      self.rowTableHeader = [
        // 未做任何格式化处理的数据
        {
          prop: 'index',
          width: 80,
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
          prop: 'cateName',
          align: 'center',
          label: '角色名称'
        },
        // 添加操作按钮
        {
          prop: '',
          label: '操作',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('el-button', {
                props: { type: 'primary', size: 'mini' },
                // style: { marginRight: '2px' },
                on: {
                  click: function() {
                    self.listUpdate.limitZt = params.row.limitZt // 是否限制账套
                    self.listUpdate.roleId = params.row.id // 角色id
                    self.listUpdate.roleName = params.row.rName // 角色名称
                    self.dialogTableVisible = false
                  }
                }
              }, '确认选择')
            ])
          }
        }
      ]
    },
    // 部门表格头
    chooseDeptHeader() {
      const self = this
      self.rowTableDeptHeader = [
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
          label: '组织机构名称'
        },
        {
          prop: 'orgCode',
          align: 'center',
          label: '组织机构编号'
        },
        // 添加操作按钮
        {
          prop: '',
          label: '操作',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('el-button', {
                props: { type: 'primary', size: 'small' },
                // style: { marginRight: '2px' },
                on: {
                  click: function() {
                    self.listUpdate.limitZt= params.row.limitZt || 0 // 是否限制账套
                    self.listUpdate.deptId = params.row.id // 要授权管理的组织ID，如果使用默认部门【useLsbm==1】则此值为空
                    self.listUpdate.deptName = params.row.name // 要授权管理的组织名称，如果使用默认部门【useLsbm==1】则此值为空
                    self.listUpdate.useGsbm = 0 // bool值，是否默认使用授权用户的归属部门作为授权部门
                    self.dialogTableDeptVisible = false
                  }
                }
              }, '确认选择')
            ])
          }
        }
      ]
    },
    // 人员表格头
    choosePeopleHeader() {
      const self = this
      self.rowTablePeopleHeader = [
        // 未做任何格式化处理的数据
        {
          prop: 'checkbox',
          label: '选择',
          width: 100,
          align: 'center',
          render: (h, params) => {
            const ownerIdArray = self.owner.ownerIdArray
            var ownerIdChecked = false
            if (ownerIdArray.indexOf(params.row.id) !== -1) {
              ownerIdChecked = true
            }
            return h('div', [
              h('el-checkbox', {
                props: { type: 'primary', size: 'small', checked: ownerIdChecked },
                // style: { marginRight: '2px' },
                on: {
                  change: function(event) {
                    // 选中
                    if (event) {
                      self.owner.ownerIdArray.push(params.row.id)
                      self.owner.ownerNameArray.push(params.row.uName)
                    } else {
                      for (var i = 0; i < self.owner.ownerIdArray.length; i++) {
                        if (self.owner.ownerIdArray[i] === params.row.id) {
                          self.owner.ownerIdArray.splice(i, 1)
                          self.owner.ownerNameArray.splice(i, 1)
                        }
                      }
                    }
                  }
                }
              }, '')
            ])
          }
        },
        {
          prop: 'index',
          width: 80,
          align: 'center',
          label: '序号'
        },
        {
          prop: 'userId',
          align: 'center',
          label: '员工编号'
        },
        {
          prop: 'uName',
          align: 'center',
          label: '用户姓名'
        },
        {
          prop: 'gsbmName',
          align: 'center',
          label: '归属部门'
        }
      ]
    },
    // 查询组织机构树
    onQueryOrgAlltree() {
      this.dataTree = []
      getOrgAlltree().then(response => {
        this.dataTree = response.data
      })
    },
    // 组织机构树点击事件
    handleNodeClick(obj, node, data) {
      this.listQuery.ownerGsbmId = obj.id // 角色拥有者的归属部门主键
      this.listQuery.ownerGsbmName = obj.name // 角色拥有者的归属部门名称
      this.onQuery() // 查询
    },
    onBtnQuery() {
      this.listQuery.pg_pagenum = 1
      this.onQuery() // 查询
    },
    // 查询
    onQuery() {
      this.tableData = []
      getRoleUser(this.listQuery).then(response => {
        this.tableData = response.data
        this.total = response.total_count
      })
    },
    // 查询
    onQueryWithNoGsbmId() {
      this.tableData = []
      this.listQuery.pg_pagenum = 1
      this.listQuery.ownerGsbmId=""
      getRoleUser(this.listQuery).then(response => {
        this.tableData = response.data
        this.total = response.total_count
      })
    },
    // 查询角色
    onRoleQuery() {
      this.tableRoleData = []
      getRole(this.listTableUpdate).then(response => {
        this.tableRoleData = response.data
        this.totalRole = response.total_count
      })
    },
    onRoleListQuery() {
      this.listTableUpdate.pg_pagenum = 1
      this.onRoleQuery() // 查询
    },
    // 查询部门（表格）
    onDeptQuery() {
      this.tableDeptData = []
      getOrgAll(this.listTableDeptUpdate).then(response => {
        this.tableDeptData = response.data
        this.totalDept = response.total_count
      })
    },
    onDeptListQuery() {
      this.listTableDeptUpdate.pg_pagenum = 1
      this.onDeptQuery()
    },
    // 查询人员（表格）
    onPeopleQuery(bool) {
      this.tablePeopleData = []
      if(bool){
        this.listTablePeopleUpdate.pg_pagesize = 10
        this.listTablePeopleUpdate.pg_pagenum = 1
      }
      getUser(this.listTablePeopleUpdate).then(response => {
        this.tablePeopleData = response.data
        this.totalPeople = response.total_count
      })
    },
    onPeopleListQuery() {
      this.listTablePeopleUpdate.pg_pagenum = 1
      this.onPeopleQuery(false)
    },
    // 新增角色分配
    onAdd() {
      this.clearData() // 清空添加的数据
      // this.listUpdate.deptId = this.listQuery.ownerGsbmId // 角色拥有者的归属部门主键
      // this.listUpdate.deptName = this.listQuery.ownerGsbmName // 角色拥有者的归属部门名称
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
    },
    // 清空添加的数据
    clearData() {
      this.listUpdate = { // 弹窗
        roleId: '', // 角色id
        roleName: '', // 角色名称
        limitZt: 1,
        ownerId: '', // 要分配的用户ID数组，多个用户ID以英文逗号“,”分隔
        ownerName: '', // 要分配的用户name数组，多个用户名称以英文逗号“,”分隔
        useGsbm: 1, // int	bool值，是否默认使用授权用户的归属部门作为授权部门
        deptId: '', // 要授权管理的组织ID，如果使用默认部门【useGsbm==1】则此值为空
        deptName: '' // 要授权管理的组织名称，如果使用默认部门【useGsbm==1】则此值为空
      }
    },
    // 清空角色表格查询条件
    clearRoleData() {
      this.listTableUpdate = { // 查询角色
        pg_pagesize: 10, // 每页显示多少条数据，默认为10条
        pg_pagenum: 1, // 查询第几页数据，默认第一页
        name: '', // 角色名称
        intro: '', // 角色介绍
        enabled: 1 // 此角色是否可用，bool值，参见枚举值定义
      }
    },
    clearDeptData() {
      this.listTableDeptUpdate = {
        pg_pagesize: 10, // 每页显示多少条数据，默认为10条
        pg_pagenum: 1, // 查询第几页数据，默认第一页
        name: '',	// 组织机构名称
        orgCode: ''	// 组织机构编号
      }
    },
    // 选择角色
    chooseRole() {
      this.clearRoleData() // 清空角色表格查询条件
      this.onRoleQuery() // 查询角色
      this.dialogTableVisible = true
      this.dialogTableStatus = 'chooseRole'
    },
    // 选择人员
    choosePeople() {
      this.owner.ownerIdArray = this.listUpdate.ownerId.split(',') // 字符串按逗号分隔成数组
      this.owner.ownerNameArray = this.listUpdate.ownerName.split(',') // 字符串按逗号分隔成数组
      // 去掉字符串中空值
      for (var i = 0; i < this.owner.ownerIdArray.length; i++) {
        if (this.owner.ownerIdArray[i] === '') {
          this.owner.ownerIdArray.splice(i, 1)
          this.owner.ownerNameArray.splice(i, 1)
        }
      }
      this.onPeopleQuery(false) // 查询人员
      this.dialogTablePeopleVisible = true
      this.dialogTableStatus = 'choosePeople'
    },
    // 选择部门
    chooseDepartment() {
      this.clearDeptData() // 清空部门表格查询条件
      this.onDeptQuery() // 查询部门（表格）
      this.dialogTableDeptVisible = true
      this.dialogTableStatus = 'chooseDepartment'
    },
    // 确认选择的人员
    createTablePeopleData() {
      if (this.owner.ownerIdArray.length === 0) {
        this.$message({ type: 'warning', message: '请选择人员!' })
      } else {
        this.listUpdate.ownerId = this.owner.ownerIdArray.join(',') // 变成字符串后，以逗号分隔
        this.listUpdate.ownerName = this.owner.ownerNameArray.join(',') // 变成字符串后，以逗号分隔
        this.dialogTablePeopleVisible = false
      }
    },
    // 添加角色分配保存
    createData(listUpdate) {
      this.$refs[listUpdate].validate((valid) => {
        if (valid) {
          const req = { ...this.listUpdate }
          postRoleUser(req).then(response => {
            this.dialogFormVisible = false
            this.$message({ message: (this.dialogStatus === 'create' ? '添加成功' : '修改成功'), type: 'success' })
            this.onQuery() // 查询
          })
        } else {
          this.$message({ message: '请填写必填项', type: 'warning' })
          return false
        }
      })
    },
    getList(val) {
      this.listQuery.pg_pagenum = val.page
      if (val.limit) {
        this.listQuery.pg_pagesize = val.limit
      }
      this.onQuery() // 查询
    },
    getRoleList(val) {
      this.listTableUpdate.pg_pagenum = val.page
      if (val.limit) {
        this.listTableUpdate.pg_pagesize = val.limit
      }
      this.onRoleQuery() // 查询
    },
    getDeptList(val) {
      this.listTableDeptUpdate.pg_pagenum = val.page
      if (val.limit) {
        this.listTableDeptUpdate.pg_pagesize = val.limit
      }
      this.onDeptQuery() // 查询
    },
    getPeopleList(val) {
      this.listTablePeopleUpdate.pg_pagenum = val.page
      if (val.limit) {
        this.listTablePeopleUpdate.pg_pagesize = val.limit
      }
      this.onPeopleQuery(false) // 查询
    }

  }
}
</script>
<style scoped>
.border{
  border: 1px solid #ebebeb;
  border-radius: 8px;
  -webkit-box-shadow: 0 0 15px 0 rgba(232,237,250,.6), 0 7px 11px 0 rgba(232,237,250,.5);
  box-shadow: 0 0 15px 0 rgba(232,237,250,.6), 0 7px 11px 0 rgba(232,237,250,.5);
  height:600px;
}
.p-10{
  padding:0 10px 10px 10px
}
.placeholderDiv{
  font-size:12px;color:red;
}
</style>

