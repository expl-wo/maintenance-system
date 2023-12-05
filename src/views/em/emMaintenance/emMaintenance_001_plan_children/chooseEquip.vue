<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline demo-form-zdy">
        <el-form-item  size="small">
          <el-button type="primary" icon="Plus" @click="onAdd"></el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-input v-model="listQuery.eqpId" placeholder="设备编号"></el-input>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="Search" @click="onQuery">搜索</el-button>
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
    <el-dialog draggable :close-on-click-modal="false" :title="textMap[dialogStatus]"  v-model="dialogFormVisible" class="roleDialog" :append-to-body="true">
      <el-form ref="listUpdate" label-position="right" label-width="125px" :rules="submitRules" :model="listUpdate">
        <el-form-item label="保养计划名称:"  size="small">
          <el-input v-model="listUpdate.mtcName" placeholder="保养计划名称" style="width: 250px;" class="filter-item" disabled />
        </el-form-item>
        <el-form-item label="设备名称:" prop="eqpName"  size="small">
          <el-input v-model="listUpdate.eqpName" placeholder="设备名称" style="width: 250px;" class="filter-item" disabled />
          <el-button  size="small" type="primary" @click="onSelectEquip">选择设备</el-button>
        </el-form-item>
        <el-form-item label="下次保养时间:" prop="nextMtcTime"  size="small">
          <el-date-picker v-model="listUpdate.nextMtcTime" :picker-options="pickerOptions0" value-format="YYYY-MM-DD" type="date" placeholder="下次保养时间" style="width: 250px;" class="filter-item" />
        </el-form-item>
<!--        <el-form-item label="派工提醒人:" prop="reminderName"  size="small">-->
<!--          <el-input v-model="listUpdate.reminderName" placeholder="派工提醒人" style="width: 250px;" class="filter-item" disabled />-->
<!--          <el-button  size="small" type="primary" @click="onSelectPeople">选择提醒人</el-button>-->
<!--        </el-form-item>-->
        <el-form-item v-if="equipRowSelected.cycleType==1" label="保养负责人:" prop="maintenanceHeadName"  size="small">
          <el-input  v-model="listUpdate.maintenanceHeadName" placeholder="保养负责人" style="width: 250px;" class="filter-item" disabled />
          <el-button  size="small" type="primary" @click="onSelectPeople">选择负责人</el-button>
        </el-form-item>
        <el-form-item v-if="equipRowSelected.cycleType==1" label="保养参与人:" prop="maintenanceOtherNames"  size="small">
          <el-input  v-model="listUpdate.maintenanceOtherNames" placeholder="保养参与人" style="width: 250px;" class="filter-item" disabled />
          <el-button  size="small" type="primary" @click="onSelectPeoples">选择参与人</el-button>
        </el-form-item>
        <el-form-item  v-if="equipRowSelected.cycleType==1" label="保养检查人:" prop="maintenanceOtherNames"  size="small">
          <el-input  v-model="listUpdate.maintenanceCheckNames" placeholder="保养参与人" style="width: 250px;" class="filter-item" disabled />
          <el-button  size="small" type="primary" @click="onSelectCheck">选择参与人</el-button>
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
    <el-dialog draggable :close-on-click-modal="false" title="选择负责人"  v-model="dialogPeopleFormVisible" :append-to-body="true" class="roleDialog800">
      <div class="filter-container">
        <el-form label-position="right" label-width="90px" :model="listPeopleQuery" :inline="true" class="demo-form-inline demo-form-zdy">
          <el-form-item label="" prop="name"  size="small">
            <el-input v-model="listPeopleQuery.uName" placeholder="用户姓名" style="width: 180px;" class="filter-item" />
          </el-form-item>
          <el-form-item label="" prop="intro"  size="small">
            <el-input v-model="listPeopleQuery.userId" placeholder="员工编号" style="width: 180px;" class="filter-item" />
          </el-form-item>
          <el-form-item label="" prop="intro"  size="small">
            <el-input v-model="listPeopleQuery.gsbmName" placeholder="归属部门" style="width: 180px;" class="filter-item" />
          </el-form-item>
          <el-form-item  size="small">
            <el-button type="primary" icon="Search" @click="onPeopleQuery">查询</el-button>
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
    <el-dialog draggable :close-on-click-modal="false" title="请选择参与人"  v-model="dialogPeoplesFormVisible" class="roleDialog800" append-to-body>
      <el-form label-position="right" label-width="110px" :model="listPeopleQuery" :inline="true" class="demo-form-inline demo-form-zdy" >
        <el-form-item label="" prop="name"  size="small">
          <el-input v-model="listPeopleQuery.uName" placeholder="员工姓名" style="width: 180px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="" prop="intro"  size="small">
          <el-input v-model="listPeopleQuery.userId" placeholder="员工编号" style="width: 180px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="" prop="intro"  size="small">
          <el-input v-model="listPeopleQuery.gsbmName" placeholder="归属部门名称" style="width: 180px;" class="filter-item" />
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="Search" @click="onPeopleQuery">查询</el-button>
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

    <!--选择检查人-->
    <el-dialog draggable :close-on-click-modal="false" title="选择检查人"  v-model="dialogCheckFormVisible" :append-to-body="true" class="roleDialog800">
      <div class="filter-container">
        <el-form label-position="right" label-width="90px" :model="listPeopleQuery" :inline="true" class="demo-form-inline demo-form-zdy">
          <el-form-item label="" prop="name"  size="small">
            <el-input v-model="listPeopleQuery.uName" placeholder="用户姓名" style="width: 180px;" class="filter-item" />
          </el-form-item>
          <el-form-item label="" prop="intro"  size="small">
            <el-input v-model="listPeopleQuery.userId" placeholder="员工编号" style="width: 180px;" class="filter-item" />
          </el-form-item>
          <el-form-item label="" prop="intro"  size="small">
            <el-input v-model="listPeopleQuery.gsbmName" placeholder="归属部门" style="width: 180px;" class="filter-item" />
          </el-form-item>
          <el-form-item  size="small">
            <el-button type="primary" icon="Search" @click="onPeopleQuery">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <table-simple
        :heightTable="heightTable"
        :data="tablePeopleData"
        :row-header="rowCheckHeader"
        :total="totalPeople"
        :page="listPeopleQuery.pg_pagenum"
        :limit="listPeopleQuery.pg_pagesize"
        @pagination="getPeopleList"
      />
      <div   class="dialog-footer">
        <el-button @click="dialogCheckFormVisible = false"  size="small">取 消</el-button>
        <el-button type="primary" @click="createTableCheckerData()"  size="small">
          确 认
        </el-button>
      </div>
    </el-dialog>


    <!--选择设备-->
    <el-dialog draggable :close-on-click-modal="false" title="选择设备"  v-model="dialogEquipFormVisible" :append-to-body="true" class="roleDialog800">
      <div class="filter-container searchCon">
        <el-form :inline="true" :model="listQueryEqp" class="demo-form-inline demo-form-zdy">
          <el-form-item label="设备编号"  size="small">
            <el-input v-model="listQueryEqp.eqpId" placeholder="设备编号" style="width: 180px;" class="filter-item" clearable />
          </el-form-item>
          <el-form-item label="设备名称"  size="small">
            <el-input v-model="listQueryEqp.eqpName" placeholder="设备名称" style="width: 180px;" class="filter-item" clearable />
          </el-form-item>
          <el-form-item label="绑定其他配置"  size="small">
            <el-radio-group v-model="listQueryEqp.isLinked">
              <el-radio :label="-1">全部</el-radio>
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item  size="small">
            <el-button type="primary" icon="Search" @click="onBtnEqpQuery">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="app-containerR wp" style="height:350px;">
        <div class="hp otherCon">
          <el-card shadow="hover" class="hp">
            <el-tree
              ref="dataTreeNo"
              class="otherCon wp"
              :data="tableEquipData"
              :props="props"
              default-expand-all
              highlight-current
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
            />
          </el-card>
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
import { getEqpConfList, getEqpConfUpdate, deleteEqpConf, queryTreeEqp,eqpConfDaily } from '@/api/em/eqpMtc'
// 查询人员信息
import { getUser, getUserAll } from '@/api/user'
// 保养设备配置选择设备查询
import { getMtcEqpInitList } from '@/api/em/eqpMtc'
import { ElButton,ElButtonGroup,ElCheckbox} from "element-plus";

export default {
  name: 'Table',
  components: { TableSimple },
  props: ['equipRowSelected'],
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
        mainId: '' ,// 保养主配置id
        eqpId:'',
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
        mtcId: '', // 保养计划id
        mtcName: '', // 保养计划名称
        eqpId: '', // 保养设备id
        eqpName: '', // 保养设备名称
        lastMtcTime: '', // 上次保养时间
        nextMtcTime: '', // 下次保养时间
        reminderTime: 0, // 保养提前提醒天数
        reminderId: '', // 提醒人id
        reminderName: '', // 提醒人姓名
        maintenanceHeadId: '', // 保养负责人id
        maintenanceHeadName: '', // 保养负责人姓名
        maintenanceOtherIds: '', // 保养参与人id
        maintenanceOtherNames: '' ,// 保养参与人姓名
        maintenanceCheckIds: '', // 保养检查人id
        maintenanceCheckNames: '' // 保养检查人姓名
      },
      submitRules: {
        // eqpName: [
        //   { required: true, trigger: 'change', message: '该项为必填项' }
        // ],
        lastMtcTime: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        nextMtcTime: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        reminderTime: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        maintenanceHeadName: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        maintenanceOtherNames: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ]
      },
      dialogPeopleFormVisible: false, // 选择人员弹窗
      dialogCheckFormVisible :false,
      tablePeopleData: [], // 人员表格数据
      rowPeopleHeader: [], // 人员表格表头
      rowCheckHeader: [],
      totalPeople: 0, // 人员列表总条数
      listPeopleQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条
        pg_pagesize: 10, // 查询第几页数据，默认第一页
        uName: '', // 模糊匹配，用户姓名
        userId: '', // 模糊匹配，员工编号
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
      checker:{
        checkerIdArray: [], // 要分配的用户ID数组，多个用户ID以英文逗号“,”分隔
        checkerNameArray: [] // 要分配的用户ID数组，多个用户ID以英文逗号“,”分隔
      },
      props: {
        value: 'id',
        label: 'name',
        children: 'sub'
      },
      listQueryEqp:{
        eqpId:'',
        eqpName:'',
        mainId:'',
        isLinked:0
      },
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
          prop: 'eqpName',
          align: 'center',
          label: '设备名称'
        },
        {
          prop: 'eqpId',
          align: 'center',
          label: '设备编号'
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
          prop: 'lastMtcTime',
          align: 'center',
          width: 100,
          label: '上次保养时间'
        },
        {
          prop: 'nextMtcTime',
          align: 'center',
          width: 100,
          label: '下次保养时间'
        },
        {
          prop: 'reminderTime',
          align: 'center',
          width: 100,
          label: '派工提醒时间'
        },
        // {
        //   prop: 'reminderName',
        //   align: 'center',
        //   label: '派工提醒人'
        // },
        {
          prop: 'maintenanceHeadName',
          align: 'center',
          label: '保养负责人'
        },
        {
          prop: 'maintenanceOtherNames',
          align: 'center',
          label: '保养参与人'
        },
        {
          prop: 'maintenanceCheckNames',
          align: 'center',
          label: '保养检查人'
        },
        // 添加操作按钮
        {
          prop: '',
          align: 'center',
          label: '操作',
          width: 110,
          fixed: 'right',
          render: (h, params) => {
            return h(ElButtonGroup, ()=>[
              h(ElButton, {
                type: 'primary', size: 'small', icon:"Edit",
                // style: { marginRight: '0px' },
                onClick: function() {
                  self.listUpdate = {
                    id: params.row.id, // 保养计划id
                    mtcId: self.equipRowSelected.id, // 保养计划id
                    mtcName: self.equipRowSelected.name, // 保养计划名称
                    eqpId: params.row.eqpId, // 保养设备id
                    eqpName: params.row.eqpName, // 保养设备名称
                    lastMtcTime: params.row.lastMtcTime, // 上次保养时间
                    nextMtcTime: params.row.nextMtcTime, // 下次保养时间
                    reminderTime: params.row.reminderTime, // 保养提前提醒天数
                    reminderId: params.row.reminderId, // 提醒人id
                    reminderName: params.row.reminderName, // 提醒人姓名
                    maintenanceHeadId: params.row.maintenanceHeadId, // 提醒人姓名
                    maintenanceHeadName: params.row.maintenanceHeadName, // 提醒人姓名
                    maintenanceOtherIds: params.row.maintenanceOtherIds, // 提醒人姓名
                    maintenanceOtherNames: params.row.maintenanceOtherNames, // 提醒人姓名
                    maintenanceCheckIds: params.row.maintenanceCheckIds, // 提醒人姓名
                    maintenanceCheckNames: params.row.maintenanceCheckNames, // 提醒人姓名
                  }
                  self.dialogFormVisible = true
                  self.dialogStatus = 'update'
                }
              }, ()=>''),
              h(ElButton, {
                type: 'danger', size: 'small', icon: "Delete",
                onClick: function() {
                  self.dataListUpdate = params.row
                  self.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    deleteEqpConf({ ids: [params.row.id] }).then(response => {
                      self.$message({ message: '删除成功', type: 'success' })
                      self.onQuery() // 查询
                    })
                  }).catch(() => {
                    self.$message({ type: 'info', message: '已取消删除' })
                  })
                }
              }, ()=>'')

            ])
          }
        }
      ]
      this.onQueryPeople() // 人员表格表头
      this.onQueryEquip() // 设备表格表头
      this.onQueryCheck()
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
          prop: 'uName',
          align: 'center',
          label: '员工姓名'
        },
        {
          prop: 'userId',
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
            return h(ElButtonGroup, ()=>[
              h(ElButton, {
                type: 'primary', size: 'small',
                // style: { marginRight: '0px' },
                onClick: function() {
                  self.listUpdate.maintenanceHeadId = params.row.id // 提醒人id
                  self.listUpdate.maintenanceHeadName = params.row.uName // 提醒人姓名
                  self.dialogPeopleFormVisible = false
                }
              }, ()=>'确认选择')

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
          prop: 'uName',
          align: 'center',
          label: '员工姓名'
        },
        {
          prop: 'userId',
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
              h(ElCheckbox, {
                type: 'primary', size: 'small', checked: ownerIdChecked,
                onChange: function(event) {
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
              }, ()=> '')
            ])
          }
        }
      ]
    },
    onQueryCheck() {
      const self = this
      self.rowCheckHeader = [
        // 未做任何格式化处理的数据
        {
          prop: 'index',
          width: 80,
          align: 'center',
          label: '序号'
        },
        {
          prop: 'uName',
          align: 'center',
          label: '员工姓名'
        },
        {
          prop: 'userId',
          align: 'center',
          label: '员工编号'
        },
        {
          prop: 'gsbmName',
          align: 'center',
          label: '归属部门名称'
        },
        //添加操作按钮
        {
          prop: '',
          label: '操作',
          width: 110,
          align: 'center',
          render: (h, params) => {
            const checkerIdArrays = self.checker.checkerIdArray
            var ownerIdChecked = false
            if (checkerIdArrays.indexOf(params.row.id) !== -1) {
              ownerIdChecked = true
            }
            return h('div', [
              h(ElCheckbox, {
                type: 'primary', size: 'small', checked: ownerIdChecked,
                onChange: function(event) {
                  // 选中
                  if (event) {
                    self.checker.checkerIdArray.push(params.row.id)
                    self.checker.checkerNameArray.push(params.row.uName)
                  } else {
                    for (var i = 0; i < self.checker.checkerIdArray.length; i++) {
                      if (self.checker.checkerIdArray[i] === params.row.id) {
                        self.checker.checkerIdArray.splice(i, 1)
                        self.checker.checkerNameArray.splice(i, 1)
                      }
                    }
                  }
                }
              },()=> '')
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
        this.listUpdate.maintenanceOtherIds = this.owner.ownerIdArray.join(',')
        this.listUpdate.maintenanceOtherNames = this.owner.ownerNameArray.join(',')
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
            return h(ElButtonGroup, ()=>[
              h(ElButton, {
                type: 'primary', size: 'small',
                // style: { marginRight: '0px' },
                onClick: function() {
                  self.listUpdate.eqpId = params.row.k // 大修计划设备id
                  self.listUpdate.eqpName = params.row.v // 大修计划设备名称
                  self.dialogEquipFormVisible = false
                }
              },()=> '确认选择')
            ])
          }
        }
      ]
    },
    // 查询
    onQuery() {
      this.tableData = []
      this.listQuery.mainId = this.equipRowSelected.id
      getEqpConfList(this.listQuery).then(response => {
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
        mtcId: this.equipRowSelected.id, // 保养计划id
        mtcName: this.equipRowSelected.name, // 保养计划名称
        eqpId: '', // 保养设备id
        eqpName: '', // 保养设备名称
        lastMtcTime: '', // 上次保养时间
        nextMtcTime: '', // 下次保养时间
        reminderTime: 1, // 保养提前提醒天数
        reminderId: '', // 提醒人id
        reminderName: '', // 提醒人姓名
        maintenanceHeadId: '', // 提醒人姓名
        maintenanceHeadName: '', // 提醒人姓名
        maintenanceOtherIds: '', // 提醒人姓名
        maintenanceOtherNames: '', // 提醒人姓名
        maintenanceCheckIds:'',
        maintenanceCheckNames:'',
      }
    },
    saveData(listUpdate) {
      this.$refs[listUpdate].validate((valid) => {
        if (valid) {
          const req = {
            mtcId: this.equipRowSelected.id, // 保养计划id
            eqpId: this.listUpdate.eqpId, // 保养设备id
            lastMtcTime: this.listUpdate.lastMtcTime, // 上次保养时间
            nextMtcTime: this.listUpdate.nextMtcTime, // 下次保养时间
            reminderTime: this.listUpdate.reminderTime, // 保养提前提醒天数
            reminderId: this.listUpdate.reminderId, // 提醒人id
            reminderName: this.listUpdate.reminderName, // 提醒人姓名
            maintenanceHeadId: this.listUpdate.maintenanceHeadId, // 提醒人姓名
            maintenanceHeadName: this.listUpdate.maintenanceHeadName, // 提醒人姓名
            maintenanceOtherIds: this.listUpdate.maintenanceOtherIds, // 提醒人姓名
            maintenanceOtherNames: this.listUpdate.maintenanceOtherNames, // 提醒人姓名
            maintenanceCheckIds: this.listUpdate.maintenanceCheckIds, // 提醒人姓名
            maintenanceCheckNames: this.listUpdate.maintenanceCheckNames, // 提醒人姓名
          }
          if(this.dialogStatus == 'update') req.id = this.listUpdate.id
          getEqpConfUpdate(req).then(response => {
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
      this.onEquipQuery() // 查询
    },
    onBtnEqpQuery(){
      this.onEquipQuery()
    },
    // 查询设备
    onEquipQuery() {
      this.tableEquipData = []
      this.listQueryEqp.mainId=this.equipRowSelected.id;

      eqpConfDaily(this.listQueryEqp).then(res=>{
        this.tableEquipData = res.data.notLinked
      })
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
    onSelectCheck() {
      this.checker={
        checkerIdArray: [], // 要分配的用户ID数组，多个用户ID以英文逗号“,”分隔
        checkerNameArray: [] // 要分配的用户ID数组，多个用户ID以英文逗号“,”分隔
      },
      this.dialogCheckFormVisible = true
      this.onPeopleQuery() // 查询
    },
    // 确认选择的人员
    createTableCheckerData() {
      if (this.checker.checkerIdArray.length === 0) {
        this.$message({ type: 'warning', message: '请选择人员!' })
      } else {
        this.listUpdate.maintenanceCheckIds = this.checker.checkerIdArray.join(',')
        this.listUpdate.maintenanceCheckNames = this.checker.checkerNameArray.join(',')
        this.dialogCheckFormVisible = false
      }
      console.log("this.listDispatchUpdate"+JSON.stringify(this.listDispatchUpdate))
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
    }
  }
}
</script>

<style scoped>

</style>
