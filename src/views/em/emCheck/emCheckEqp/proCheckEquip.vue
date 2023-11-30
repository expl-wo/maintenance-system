<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline demo-form-zdy">
        <el-form-item  size="small">
          <el-button type="primary" icon="el-icon-plus" @click="onAdd"></el-button>
        </el-form-item>
      </el-form>
    </div>
    <table-simple
      :heightTable="heightTable"
      :data="tableData"
      :row-header="rowHeader"
      :total="total"
      :page="listQuery.pg_pagenum"
      :limit="listQuery.pg_pagesize"
      @pagination="getList"
    />

    <!--弹窗新增或修改保养设备定义-->
    <el-dialog v-draggable  :close-on-click-modal="false" :title="textMap[dialogStatus]"  v-model="dialogFormVisible" class="roleDialog" :append-to-body="true">
      <el-form ref="listUpdate" label-position="right" label-width="125px" :rules="submitRules" :model="listUpdate">
        <el-form-item label="点检配置名称:"  size="small">
          <el-input v-model="listUpdate.checkName" placeholder="保养计划名称" style="width: 250px;" class="filter-item" disabled />
        </el-form-item>
        <el-form-item label="设备名称:" prop="eqpName"  size="small">
          <el-input v-model="listUpdate.eqpName" placeholder="设备名称" style="width: 250px;" class="filter-item" disabled />
          <el-button  size="small" type="primary" @click="onSelectEquip">选择设备</el-button>
        </el-form-item>
        <el-form-item label="下次点检日期:" prop="nextCheckDt"  size="small">
          <el-date-picker v-model="listUpdate.nextCheckDt" :picker-options="pickerOptions0" value-format="yyyy-MM-dd" type="date" placeholder="下次点检日期" style="width: 250px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="点检负责人:" prop="checkHeadName"  size="small">
          <el-input v-model="listUpdate.checkHeadName" placeholder="点检负责人" style="width: 250px;" class="filter-item" disabled />
          <el-button  size="small" type="primary" @click="onSelectPeople">选择负责人</el-button>
        </el-form-item>
        <el-form-item label="点检参与人:" prop="checkOtherNames"  size="small">
          <el-input v-model="listUpdate.checkOtherNames" placeholder="点检参与人" style="width: 250px;" class="filter-item" disabled />
          <el-button  size="small" type="primary" @click="onSelectPeoples">选择参与人</el-button>
        </el-form-item>
      </el-form>
      <div   class="dialog-footer">
        <el-button @click="dialogFormVisible = false"  size="small">取 消</el-button>
        <el-button type="primary" @click="saveData('listUpdate')"  size="small">
          保存
        </el-button>
      </div>
    </el-dialog>

    <!--选择人员-->
    <el-dialog v-draggable  :close-on-click-modal="false" title="选择负责人"  v-model="dialogPeopleFormVisible" :append-to-body="true" class="roleDialog800">
      <div class="filter-container">
        <el-form label-position="right" label-width="90px" :model="listPeopleQuery" :inline="true" class="demo-form-inline demo-form-zdy">
          <el-form-item label="" prop="name"  size="small">
            <el-input v-model="listPeopleQuery.name" placeholder="用户姓名" style="width: 180px;" class="filter-item" />
          </el-form-item>
          <el-form-item label="" prop="intro"  size="small">
            <el-input v-model="listPeopleQuery.userid" placeholder="员工编号" style="width: 180px;" class="filter-item" />
          </el-form-item>
          <el-form-item label="" prop="intro"  size="small">
            <el-input v-model="listPeopleQuery.gsbmName" placeholder="归属部门" style="width: 180px;" class="filter-item" />
          </el-form-item>
          <el-form-item  size="small">
            <el-button type="primary" icon="el-icon-search" @click="onPeopleQuery">{{ $t('button.query') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <table-simple
        :heightTable="heightTable"
        :data="tablePeopleData"
        :row-header="rowPeopleHeader"
        :total="totalPeople"
        :page="listPeopleQuery.pg_pagenum"
        :limit="listPeopleQuery.pg_pagesize"
        @pagination="getPeopleList"
      />
      <div   class="dialog-footer">
        <el-button @click="dialogPeopleFormVisible = false"  size="small">关 闭</el-button>
      </div>
    </el-dialog>

    <!--选择人员(参与人)多选-->
    <el-dialog v-draggable  :close-on-click-modal="false" title="请选择参与人"  v-model="dialogPeoplesFormVisible" class="roleDialog800" append-to-body>
      <el-form label-position="right" label-width="110px" :model="listPeopleQuery" :inline="true" class="demo-form-inline demo-form-zdy" >
        <el-form-item label="" prop="name"  size="small">
          <el-input v-model="listPeopleQuery.name" placeholder="员工姓名" style="width: 180px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="" prop="intro"  size="small">
          <el-input v-model="listPeopleQuery.userid" placeholder="员工编号" style="width: 180px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="" prop="intro"  size="small">
          <el-input v-model="listPeopleQuery.gsbmName" placeholder="归属部门名称" style="width: 180px;" class="filter-item" />
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="el-icon-search" @click="onPeopleQuery">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
      <el-tag v-show="owner.ownerNameArray.length > 0" v-for="(item,i) in owner.ownerNameArray" :key="i" closable @close="tagClose(i)">{{ item }}</el-tag>
      <table-simple
        :heightTable="heightTable"
        :data="tablePeopleData"
        :row-header="rowPeoplesHeader"
        :total="totalPeople"
        :page="listPeopleQuery.pg_pagenum"
        :limit="listPeopleQuery.pg_pagesize"
        @pagination="getPeopleList"
      />
      <div   class="dialog-footer">
        <el-button @click="dialogPeoplesFormVisible = false"  size="small">取 消</el-button>
        <el-button type="primary" @click="createTablePeopleData()"  size="small">
          确 认
        </el-button>
      </div>
    </el-dialog>

    <!--选择设备-->
    <el-dialog v-draggable  :close-on-click-modal="false" title="选择设备"  v-model="dialogEquipFormVisible" :append-to-body="true" class="roleDialog800">
      <div>
        <div class="filter-container searchCon">
          <el-form :inline="true" :model="listQueryEqp" class="demo-form-inline demo-form-zdy">
            <el-form-item label="设备编号"  size="small">
              <el-input v-model="listQueryEqp.id" placeholder="设备编号" style="width: 180px;" class="filter-item" clearable />
            </el-form-item>
            <el-form-item label="设备名称"  size="small">
              <el-input v-model="listQueryEqp.name" placeholder="设备名称" style="width: 180px;" class="filter-item" clearable />
            </el-form-item>
            <el-form-item label="绑定其他配置"  size="small">
              <el-radio-group v-model="listQueryEqp.isLinked">
                <el-radio :label="-1">全部</el-radio>
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item  size="small">
              <el-button type="primary" icon="el-icon-search" @click="onBtnEqpQuery">{{ $t('button.query') }}</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="app-containerR wp" style="height:350px;">
          <div class="hp otherCon">
            <el-card shadow="hover" class="hp">
              <div  class="clearfix">
                <span>未绑定设备</span>
              </div>
              <div class="wp hp app-containerC">
                <el-tree
                  ref="dataTreeNo"
                  class="otherCon wp"
                  :data="transferNoData"
                  :props="props"
                  show-checkbox
                  default-expand-all
                  highlight-current
                  :expand-on-click-node="false"
                  node-key="id"
                  :check-strictly="true"
                  @check="handleCheckChangeArea"
                />
              </div>
            </el-card>
          </div>
        </div>
      </div>
      <div   class="dialog-footer">
        <el-button @click="dialogEquipFormVisible = false"  size="small">关 闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import TableSimple from '@/components/Table/index'
// 保养设备配置查询,保养设备挂接新增与编辑,保养设备删除
import { proEqpConf, deleteProEqp, proCheckEqp, getEqpConf } from '@/api/em/eqpCheck'
// 查询人员信息
import { getUser, getUserAll } from '@/api/user'
// 保养设备配置选择设备查询
import { getMtcEqpInitList } from '@/api/em/eqpMtc'

export default {
  name: 'Table',
  components: { TableSimple },
  props: ['checkDataSelected'],
  data() {
    return {
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      heightTable: '300px',
      tableData: [], // 表格内容
      rowHeader: [], // 表格标题头
      total: 0, // 表格总条数
      listQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        checkId: '' // 保养主配置id
      },
      dialogFormVisible: false, // 保养设备新增删除弹窗
      dialogPeoplesFormVisible: false, // 多选保养参与人
      dialogStatus: '', // 角色列表表格新增或者修改状态控制
      textMap: { // 控制弹窗提示字
        update: '修改',
        create: '添加'
      },
      listUpdate: {
        id: '', // 新增时无id，编辑时需填写对应数据id
        checkId: '', // 保养计划id
        checkName: '', // 保养计划名称
        eqpId: '', // 保养设备id
        eqpName: '', // 保养设备名称
        lastCheckDt: '', // 上次保养时间
        nextCheckDt: '', // 下次保养时间
        checkHeadId: '', // 保养负责人id
        checkHeadName: '', // 保养负责人姓名
        checkOtherIds: '', // 保养参与人id
        checkOtherNames: '' // 保养参与人姓名
      },
      submitRules: {
        lastCheckDt: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        nextCheckDt: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        checkHeadName: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        checkOtherNames: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ]
      },
      dialogPeopleFormVisible: false, // 选择人员弹窗
      tablePeopleData: [], // 人员表格数据
      rowPeopleHeader: [], // 人员表格表头
      totalPeople: 0, // 人员列表总条数
      listPeopleQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条
        pg_pagesize: 10, // 查询第几页数据，默认第一页
        name: '', // 模糊匹配，用户姓名
        userid: '', // 模糊匹配，员工编号
        gsbmName: '', // 模糊匹配，归属部门名称
      },
      dialogEquipFormVisible: false, // 选择设备弹窗
      tableEquipData: [], // 设备表格
      rowEquipHeader: [], // 设备表格表头
      totalEquip: 0, // 设备表格总条数
      listEquipQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        eqpName: '', // 设备名称
        id:''
      },
      rowPeoplesHeader:[],
      owner: {
        ownerIdArray: [], // 要分配的用户ID数组，多个用户ID以英文逗号“,”分隔
        ownerNameArray: [] // 要分配的用户ID数组，多个用户ID以英文逗号“,”分隔
      },
      props: {
        value: 'id',
        label: 'name',
        children: 'sub'
      },
      listQueryEqp:{
        id:'',
        name:'',
        isLinked:0
      },
      transferNoData:[]
    }
  },
  mounted() {
    this.onload()
  },
  methods: {
    onload() {
      const self = this
      self.onQuery()
      self.rowHeader = [
        // 未做任何格式化处理的数据
        {
          prop: 'index',
          width: 50,
          align: 'center',
          label: '序号'
        },
        {
          prop: 'eqpId',
          align: 'center',
          label: '设备编号'
        },
        {
          prop: 'eqpName',
          align: 'center',
          label: '设备名称'
        },
        {
          prop: 'usingDep',
          align: 'center',
          label: '使用部门'
        },
        {
          prop: 'installPlace',
          align: 'center',
          label: '安装地点'
        },
        {
          prop: 'lastCheckDt',
          align: 'center',
          width: 100,
          label: '上次点检日期'
        },
        {
          prop: 'nextCheckDt',
          align: 'center',
          width: 100,
          label: '下次点检日期'
        },
        {
          prop: 'checkHeadName',
          align: 'center',
          label: '点检负责人'
        },
        {
          prop: 'checkOtherNames',
          align: 'center',
          label: '点检参与人'
        },
        // 添加操作按钮
        {
          prop: '',
          align: 'center',
          label: '操作',
          width: 110,
          fixed: 'right',
          render: (h, params) => {
            return h('el-button-group', [
              h('el-button', {
                props: { type: 'primary', size: 'mini', icon: 'el-icon-edit' },
                // style: { marginRight: '0px' },
                on: {
                  click: function() {
                    self.listUpdate = {
                      id: params.row.id, // 保养计划id
                      checkId: self.checkDataSelected.id, // 保养计划id
                      checkName: self.checkDataSelected.name, // 保养计划名称
                      eqpId: params.row.eqpId, // 保养设备id
                      eqpName: params.row.eqpName, // 保养设备名称
                      lastCheckDt: params.row.lastCheckDt, // 上次保养时间
                      nextCheckDt: params.row.nextCheckDt, // 下次保养时间
                      checkHeadId: params.row.checkHeadId, // 提醒人姓名
                      checkHeadName: params.row.checkHeadName, // 提醒人姓名
                      checkOtherIds: params.row.checkOtherIds, // 提醒人姓名
                      checkOtherNames: params.row.checkOtherNames, // 提醒人姓名
                    }
                    self.dialogFormVisible = true
                    self.dialogStatus = 'update'
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
                      deleteProEqp(params.row.id).then(response => {
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
      this.onQueryPeople() // 人员表格表头
      this.onQueryEquip() // 设备表格表头
    },
    // 人员表格表头
    onQueryPeople() {
      const self = this
      self.rowPeopleHeader = [
        // 未做任何格式化处理的数据
        {
          prop: 'index',
          width: 60,
          align: 'center',
          label: '序号'
        },
        {
          prop: 'name',
          align: 'center',
          label: '员工姓名'
        },
        {
          prop: 'userid',
          align: 'center',
          label: '员工编号'
        },
        {
          prop: 'gsbmName',
          align: 'center',
          label: '归属部门名称'
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
                props: { type: 'primary', size: 'mini'},
                // style: { marginRight: '0px' },
                on: {
                  click: function() {
                    self.listUpdate.checkHeadId = params.row.id // 提醒人id
                    self.listUpdate.checkHeadName = params.row.name // 提醒人姓名
                    self.dialogPeopleFormVisible = false
                  }
                }
              }, '确认选择')

            ])
          }
        }
      ]
    },
    onQueryPeoples() {
      const self = this
      self.rowPeoplesHeader = [
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
          label: '员工姓名'
        },
        {
          prop: 'userid',
          align: 'center',
          label: '员工编号'
        },
        {
          prop: 'gsbmName',
          align: 'center',
          label: '归属部门名称'
        },
        // 添加操作按钮
        {
          prop: '',
          label: '操作',
          width: 110,
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
                on: {
                  change: function(event) {
                    // 选中
                    if (event) {
                      self.owner.ownerIdArray.push(params.row.id)
                      self.owner.ownerNameArray.push(params.row.name)
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
        }
      ]
    },
    // 选择提醒人
    onSelectPeoples() {
      this.owner = {
        ownerIdArray: [], // 要分配的用户ID数组，多个用户ID以英文逗号“,”分隔
        ownerNameArray: [] // 要分配的用户ID数组，多个用户ID以英文逗号“,”分隔
      },
      this.dialogPeoplesFormVisible = true
      this.onQueryPeoples() // 查询人员表格
    },
    // 确认选择的人员
    createTablePeopleData() {
      if (this.owner.ownerIdArray.length === 0) {
        this.$message({ type: 'warning', message: '请选择人员!' })
      } else {
        this.listUpdate.checkOtherIds = this.owner.ownerIdArray.join(',')
        this.listUpdate.checkOtherNames = this.owner.ownerNameArray.join(',')
        this.dialogPeoplesFormVisible = false
      }
      console.log("this.listDispatchUpdate"+JSON.stringify(this.listDispatchUpdate))
    },
    tagClose(i){
      this.owner.ownerIdArray.splice(i,1);
      this.owner.ownerNameArray.splice(i,1);
      this.onPeopleQuery();
      return true;
    },
    // 设备表格表头
    onQueryEquip() {
      const self = this
      self.rowEquipHeader = [
        // 未做任何格式化处理的数据
        {
          prop: 'index',
          width: 80,
          align: 'center',
          label: '序号'
        },
        {
          prop: 'v',
          align: 'center',
          label: '设备名称'
        },
        // 添加操作按钮
        {
          prop: '',
          label: '操作',
          width: 110,
          align: 'center',
          render: (h, params) => {
            return h('el-button-group', [
              h('el-button', {
                props: { type: 'primary', size: 'mini'},
                // style: { marginRight: '0px' },
                on: {
                  click: function() {
                    self.listUpdate.eqpId = params.row.k // 大修计划设备id
                    self.listUpdate.eqpName = params.row.v // 大修计划设备名称
                    self.dialogEquipFormVisible = false
                  }
                }
              }, '确认选择')
            ])
          }
        }
      ]
    },
    // 查询
    onQuery() {
      this.tableData = []
      this.listQuery.checkId = this.checkDataSelected.id
      proEqpConf(this.listQuery).then(response => {
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
    // 新增
    onAdd() {
      this.clearData() // 清空添加的数据
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
    },
    // 清空添加的数据
    clearData() {
      this.listUpdate = { // 弹窗
        checkId: this.checkDataSelected.id, // 保养计划id
        checkName: this.checkDataSelected.name, // 保养计划名称
        eqpId: '', // 保养设备id
        eqpName: '', // 保养设备名称
        lastCheckDt: '', // 上次保养时间
        nextCheckDt: '', // 下次保养时间
        checkHeadId: '', // 提醒人姓名
        checkHeadName: '', // 提醒人姓名
        checkOtherIds: '', // 提醒人姓名
        checkOtherNames: '', // 提醒人姓名
      }
    },
    saveData(listUpdate) {
      this.$refs[listUpdate].validate((valid) => {
        console.log(this.checkDataSelected);
        if (valid) {
          const req = {
            checkId: this.checkDataSelected.id, // 保养计划id
            eqpId: this.listUpdate.eqpId, // 保养设备id
            lastCheckDt: this.listUpdate.lastCheckDt, // 上次保养时间
            nextCheckDt: this.listUpdate.nextCheckDt, // 下次保养时间
            checkHeadId: this.listUpdate.checkHeadId, // 提醒人姓名
            checkHeadName: this.listUpdate.checkHeadName, // 提醒人姓名
            checkOtherIds: this.listUpdate.checkOtherIds, // 提醒人姓名
            checkOtherNames: this.listUpdate.checkOtherNames, // 提醒人姓名
          }
          if(this.dialogStatus == 'update') req.id = this.listUpdate.id
          proCheckEqp(req).then(response => {
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
    // 选择设备
    onSelectEquip() {
      this.dialogEquipFormVisible = true
      this.onBtnEqpQuery() // 查询
    },
    getEquipList(val) {
      console.log(val)
      this.listEquipQuery.pg_pagenum = val.page
      if (val.limit) {
        this.listEquipQuery.pg_pagesize = val.limit
      }
      this.onEquipQuery() // 查询
    },
    // 选择提醒人
    onSelectPeople() {
      this.dialogPeopleFormVisible = true
      this.onPeopleQuery() // 查询
    },
    // 查询人员表格
    onPeopleQuery() {
      this.tablePeopleData = []
      getUser(this.listPeopleQuery).then(response => {
        this.tablePeopleData = response.data
        this.totalPeople = response.total_count
      })
    },
    // 分页数据发生变化
    getPeopleList(val) {
      this.listPeopleQuery.pg_pagenum = val.page
      if (val.limit) {
        this.listPeopleQuery.pg_pagesize = val.limit
      }
      this.onPeopleQuery() // 查询
    },
    handleNodeClick(data) {
      if (data.sub ==null) {
        this.$confirm('确定选择设备'+data.name+'?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listUpdate.eqpId = data.id
          this.listUpdate.eqpName = data.name
          this.dialogEquipFormVisible = false
        })
      }
    },
    onBtnEqpQuery(){
      getEqpConf({ mainId: this.checkDataSelected.id,eqpId:this.listQueryEqp.id,eqpName:this.listQueryEqp.name,isLinked:this.listQueryEqp.isLinked }).then(response => {
        this.transferNoData = response.data.notLinked // 未绑定数据
        this.transferData = response.data.linkedEqp // 已绑定数据
      })
    },
    handleCheckChangeArea(data) {
      const checkedObj = data  //暂存选中节点
      this.$refs.dataTreeNo.setCheckedKeys([]); //删除所有选中节点
      this.$refs.dataTreeNo.setCheckedNodes([checkedObj]); //选中已选中节点
      this.listUpdate.eqpId = checkedObj.id
      this.listUpdate.eqpName = checkedObj.name
    },
  }
}
</script>

<style scoped>

</style>
