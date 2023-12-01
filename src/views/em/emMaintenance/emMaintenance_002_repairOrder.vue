<template>
  <div class="app-container app-containerC">

    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label=""  size="small">
          <el-input v-model="listQuery.eqpName" placeholder="设备名称/编号" style="width: 180px;" class="filter-item" clearable/>
        </el-form-item>
        <el-form-item label="保养名称"  size="small">
          <el-input v-model="listQuery.name" placeholder="保养名称" style="width: 180px;" class="filter-item" clearable/>
        </el-form-item>
        <el-form-item label="派工状态"  size="small">
          <el-select v-model="listQuery.status"  size="small" placeholder="设备分类" style="width: 120px;" filterable default-first-option>
            <el-option v-for="items in moStatus" :key="items.id" :label="items.name" :value="items.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="周期保养类型"  size="small">
          <el-radio-group v-model="listQuery.cycleType">
            <el-radio :label="99">全部</el-radio>
            <el-radio :label="2">日常保养</el-radio>
            <el-radio :label="1">定期保养</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="设备分类"  size="small">
          <el-select v-model="listQuery.eqpClazz"  size="small" placeholder="设备分类" style="width: 120px;" filterable default-first-option>
            <el-option v-for="items in eqCateData" :key="items.id" :label="items.name" :value="items.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="使用部门"  size="small">
          <el-select v-model="listQuery.usingDepId"  size="small" placeholder="使用部门" style="width: 120px;" filterable default-first-option>
            <el-option v-for="items in usingDepData" :key="items.k" :label="items.v" :value="items.k" />
          </el-select>
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

    <!--派工-->
    <el-dialog draggable :close-on-click-modal="false" title="保养派工操作"  v-model="dialogDispatchFormVisible" class="roleDialog">
      <el-form ref="listDispatchUpdate" label-position="right" label-width="120px" :rules="submitDispatchRules" :model="listDispatchUpdate">
        <el-form-item label="保养派工单号:"  size="small">
          <el-input v-model="listDispatchUpdate.dspNumber" placeholder="保养派工单号" style="width: 330px;" class="filter-item" disabled />
        </el-form-item>
        <el-form-item label="保养名称:"  size="small">
          <el-input v-model="listDispatchUpdate.name" placeholder="保养名称" style="width: 330px;" class="filter-item" disabled />
        </el-form-item>
        <el-form-item label="设备名称:"  size="small">
          <el-input v-model="listDispatchUpdate.eqpName" placeholder="设备名称" style="width: 330px;" class="filter-item" disabled />
        </el-form-item>
        <el-form-item label="保养日期:"  size="small">
          <el-input v-model="listDispatchUpdate.mtcDt" placeholder="保养日期" style="width: 330px;" class="filter-item" disabled />
        </el-form-item>
        <el-form-item label="保养责任人:" prop="mterName"  size="small">
          <el-input v-model="listDispatchUpdate.mterName" placeholder="请选择保养责任人" style="width: 257px;" class="filter-item" disabled />
          <el-button type="primary" @click="onSelectPeople">请选择</el-button>
        </el-form-item>
        <el-form-item label="指派保养人员:" prop="secondaryMaintainersName"  size="small">
          <el-input v-model="listDispatchUpdate.secondaryMaintainersName" placeholder="请选择保养人员" style="width: 257px;" class="filter-item" disabled />
          <el-button type="primary" @click="onSelectPeoples">请选择</el-button>
        </el-form-item>
      </el-form>
      <div   class="dialog-footer">
        <el-button @click="dialogDispatchFormVisible = false"  size="small">关 闭</el-button>
        <el-button type="primary" @click="dispatchSaveData('listDispatchUpdate')"  size="small">
          保存
        </el-button>
      </div>
    </el-dialog>

    <!--选择人员-->
    <el-dialog draggable :close-on-click-modal="false" title="请选择人员"  v-model="dialogPeopleFormVisible" class="roleDialog800">
      <el-form label-position="right" label-width="90px" :model="listPeopleQuery" :inline="true" class="demo-form-inline demo-form-zdy">
        <el-form-item label="" prop="name"  size="small">
          <el-input v-model="listPeopleQuery.name" placeholder="用户姓名" style="width: 180px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="" prop="intro"  size="small">
          <el-input v-model="listPeopleQuery.userid" placeholder="员工编号" style="width: 180px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="" prop="intro"  size="small">
          <el-input v-model="listPeopleQuery.gsbmName" placeholder="归属部门名称" style="width: 180px;" class="filter-item" />
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="Search" @click="onPeopleQuery">查询</el-button>
        </el-form-item>
      </el-form>
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
    <el-dialog draggable :close-on-click-modal="false" title="请选择人员"  v-model="dialogPeoplesFormVisible" class="roleDialog800">
      <el-form label-position="right" label-width="110px" :model="listPeopleQuery" :inline="true" class="demo-form-inline demo-form-zdy">
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

    <!--验收-->
    <el-dialog draggable :close-on-click-modal="false" title="保养验收操作"  v-model="dialogAcceptFormVisible" class="roleDialog">
      <el-form ref="listAcceptUpdate" label-position="right" label-width="120px" :rules="submitAcceptRules" :model="listAcceptUpdate">
        <el-form-item label="保养派工单号:"  size="small">
          <el-input v-model="listAcceptUpdate.dspNumber" placeholder="保养派工单号" style="width: 330px;" class="filter-item" disabled />
        </el-form-item>
        <el-form-item label="保养名称:"  size="small">
          <el-input v-model="listAcceptUpdate.name" placeholder="保养名称" style="width: 330px;" class="filter-item" disabled />
        </el-form-item>
        <el-form-item label="设备名称:"  size="small">
          <el-input v-model="listAcceptUpdate.eqpName" placeholder="设备名称" style="width: 330px;" class="filter-item" disabled />
        </el-form-item>
        <el-form-item label="保养日期:"  size="small">
          <el-input v-model="listAcceptUpdate.mtcDt" placeholder="保养日期" style="width: 330px;" class="filter-item" disabled />
        </el-form-item>
        <el-form-item label="保养责任人:"  size="small">
          <el-input v-model="listAcceptUpdate.mterName" placeholder="保养责任人" style="width: 330px;" class="filter-item" disabled />
        </el-form-item>
        <el-form-item label="保养人员:"  size="small">
          <el-input v-model="listAcceptUpdate.secondaryMaintainersName" placeholder="保养人员" style="width: 330px;" class="filter-item" disabled />
        </el-form-item>
        <el-form-item label="验收时间:"  size="small">
          <el-date-picker v-model="listAcceptUpdate.dateTime" type="datetime" placeholder="验收时间" style="width: 330px;" class="filter-item" />
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="text" @click="onTextButtonClick(0)">正常</el-button>
          <el-button type="text" @click="onTextButtonClick(1)">异常</el-button>
          <el-button type="text" @click="onTextButtonClick(2)">维修</el-button>
        </el-form-item>
        <el-form-item label="验收记录:"  size="small" prop="acceptRecord">
          <el-input v-model="listAcceptUpdate.acceptRecord" type="textarea" placeholder="验收记录" style="width: 330px;" class="filter-item" />
        </el-form-item>
      </el-form>
      <div   class="dialog-footer">
        <el-button @click="dialogAcceptFormVisible = false"  size="small">关 闭</el-button>
        <el-button type="primary" @click="acceptSaveData('listAcceptUpdate')"  size="small">
          保存
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { timeTranslateHMS } from '@/utils/common'
import TableSimple from '@/components/Table/index'
// 保养单查询,保养派工,保养验收
import {getDspList, getDspUpdate, getAcpUpdate, deleteAcpConf} from '@/api/em/eqpMtc'
// 查询人员信息
import { getUser } from '@/api/user'
import { finEqpDep, getEqCateList } from '@/api/em/eqpLedger'

export default {
  name: 'Table',
  components: { TableSimple },
  data() {
    return {
      moStatus:[{"id":100,"name":"全部"},{"id":0,"name":"未派工"},{"id":1,"name":"已派工"},{"id":2,"name":"开始保养"},{"id":3,"name":"结束保养"},{"id":4,"name":"已验收"}],
      eqCateData: [], // 设备分类下拉列表
      heightTable: '300px',
      dataListUpdate: {}, // 选中的数据
      dialogDispatchFormVisible: false, // 派工弹窗显示或者隐藏 false为隐藏，true显示
      total: 0, // 角色列表表格总条数
      listQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条
        pg_pagesize: 10, // 查询第几页数据，默认第一页
        eqpName: '', // 保养的设备名称
        status: 100, // 保养的设备编号
        cycleType:99,
        usingDepId: null,
        name:''
      },
      tableData: [], // 表格数据
      rowHeader: [],
      desc: '',
      // 检验规则
      submitDispatchRules: {
        mterName: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        secondaryMaintainersName: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
      },
      listDispatchUpdate: { // 派工弹窗
        id: '', // 保养单对应的主键id
        mterId: '', // 被派工人id
        mterName: '', // 被派工人姓名
        dspNumber: '', // 保养单号
        name: '', // 保养名称
        eqpName: '', // 设备名称
        mtcDt: '', // 保养日期
        acceptRecord: '', // 验收记录 (保养验收用)
        dateTime: '', // 保养日期(保养验收用)
        mterName2: '', // 保养人(保养验收用)
        secondaryMaintainer:[],//参与保养人
        secondaryMaintainersName:''
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
      dialogAcceptFormVisible: false, // 验收弹窗
      listAcceptUpdate: { // 派工弹窗
        id: '', // 保养单对应的主键id
        dspNumber: '', // 保养单号
        name: '', // 保养名称
        eqpName: '', // 设备名称
        mtcDt: '', // 保养日期
        acceptRecord: '', // 验收记录 (保养验收用)
        dateTime: '', // 保养日期(保养验收用)
        mterName: '', // 保养人(保养验收用)
        secondaryMaintainersName:''
      },
      // 检验规则
      submitAcceptRules: {
        // dateTime: [
        //   { required: true, trigger: 'change', message: '该项为必填项' }
        // ],
        acceptRecord: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ]
      },
      rowPeoplesHeader:[],
      dialogPeoplesFormVisible:false,
      owner: {
        ownerIdArray: [], // 要分配的用户ID数组，多个用户ID以英文逗号“,”分隔
        ownerNameArray: [] // 要分配的用户ID数组，多个用户ID以英文逗号“,”分隔
      },
      usingDepData:[]
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
          prop: 'dspNumber',
          align: 'center',
          width: 180,
          label: '保养派工单号'
        },
        {
          prop: 'name',
          align: 'center',
          label: '保养名称'
        },
        {
          prop: 'eqpName',
          align: 'center',
          label: '设备名称'
        },
        {
          prop: 'mtcDt',
          align: 'center',
          label: '保养日期'
        },
        {
          prop: 'mterName',
          align: 'center',
          label: '保养负责人'
        },
        {
          prop: 'participantNames',
          align: 'center',
          label: '保养人员'
        },
        {
          prop: 'status',
          align: 'center',
          label: '派工状态',
          render: (h, params) => {
            var statusHtml = ''
            switch (params.row.status) {
              case 0:
                statusHtml = '未派工'
                break
              case 1:
                statusHtml = '已派工'
                break
              case 2:
                statusHtml = '开始保养'
                break
              case 3:
                statusHtml = '结束保养'
                break
              case 4:
                statusHtml = '已验收'
                break
              default:
                statusHtml = '未知状态'
            }
            return h('div', [
              statusHtml
            ])
          }
        },
        {
          prop: 'starttime',
          align: 'center',
          label: '实际开始时间'
        },
        {
          prop: 'endtime',
          align: 'center',
          label: '实际结束时间'
        },
        {
          prop: 'mtcDuration',
          align: 'center',
          label: '保养时长(分钟)'
        },
        {
          prop: 'acceptorName',
          align: 'center',
          label: '验收人'
        },
        {
          prop: 'acceptTime',
          align: 'center',
          label: '验收时间'
        },
        {
          prop: 'departmentUserName',
          align: 'center',
          label: '使用部门验收人'
        },
        {
          prop: 'departmentTime',
          align: 'center',
          label: '使用部门验收时间'
        },
        {
          prop: 'eqpDepartmentUserName',
          align: 'center',
          label: '设备部门验收人'
        },
        {
          prop: 'eqpDepartmentTime',
          align: 'center',
          label: '设备部门验收时间'
        },
        {
          align: 'center',
          label: '验收记录',
          render: (h, params) => {
            var html = ''
            var html2 =   params.row.evaluate == null ? "无" : params.row.evaluate

            switch (params.row.haveRisk) {
              case 0:
                html = '风险:无'
                break
              case 1:
                html = '风险:'+params.row.riskDescription
                break
              default:
                html = '风险:无'
            }
            return h('div', [
              h('div', [
                html
              ]),
              h('div', [
                '保养评价：'+html2
              ])
            ])
          },
        },
        // 添加操作按钮
        {
          prop: '',
          align: 'center',
          label: '操作',
          width: 160,
          render: (h, params) => {
            return h(ElButtonGroup, ()=>[
              h(ElButton, {
                type: 'primary', size: 'small',
                // style: { marginRight: '0px' },
                on: {
                 onClick: function() {
                    self.dialogDispatchFormVisible = true
                    self.listDispatchUpdate = { // 派工弹窗
                      id: params.row.id, // 保养单对应的主键id
                      mterId: '', // 被派工人id
                      mterName: '', // 被派工人姓名
                      dspNumber: params.row.dspNumber, // 保养单号
                      name: params.row.name, // 保养名称
                      eqpName: params.row.eqpName, // 设备名称
                      mtcDt: params.row.mtcDt, // 保养日期
                      secondaryMaintainersName:''
                    }
                    self.dataListUpdate = params.row
                  }
                }
              }, '派工'),
              // h(ElButton, {
              //   type: 'danger', size: 'small',
              //   on: {
              //    onClick: function() {
              //       self.dialogAcceptFormVisible = true
              //       self.listAcceptUpdate = { // 验收弹窗
              //         id: params.row.id, // 保养单对应的主键id
              //         acceptRecord: '', // 验收记录(保养验收用)
              //         dateTime: '', // 保养日期(保养验收用)
              //         dspNumber: params.row.dspNumber, // 保养单号
              //         name: params.row.name, // 保养名称
              //         eqpName: params.row.eqpName, // 设备名称
              //         mtcDt: params.row.mtcDt, // 保养日期
              //         mterName: params.row.mterName, // 保养人(保养验收用)
              //         secondaryMaintainersName: params.row.participantNames //保养人员
              //       }
              //     }
              //   }
              // }, '验收'),
              h(ElButton, {
                type: 'danger', size: 'small',
                on: {
                 onClick: function() {
                    //self.dialogAcceptFormVisible = true
                    // self.listAcceptUpdate = { // 验收弹窗
                    //   id: params.row.id,
                    // }
                    deleteAcpConf({ids:[params.row.id]}).then(response => {
                      if(response.err_code == 10000)
                      {
                        $message('删除成功', 'success')
                        self.onQuery() // 查询
                      }
                      else {
                      $message('err_msg', 'erro')
                      }
                    })
                  }
                }
              }, '删除')

            ])
          }
        }
      ]
      self.onQuery() // 查询
      self.onQueryPeople() // 人员表格表头
      self.onEqCateQuery()
      self.onQueryPeoples()
      self.getEqpDpt()
  },
    // 按时间倒序分页查询工序计划列表的简单信息，主用于在下拉列表中显示
    onEqCateQuery() {
      this.eqCateData = [{"id":"","name":"全部"}]
      getEqCateList().then(response => {
        response.data.forEach((dd)=>{
          this.eqCateData.push(dd)
        })
        this.eqCateData.push({"id":"-1","name":"未分类"})
      })
    },
    // 人员表格表头
    onQueryPeople() {
      const self = this
      self.rowPeopleHeader = [
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
            return h(ElButtonGroup, ()=>[
              h(ElButton, {
                type: 'primary', size: 'small',
                on: {
                 onClick: function() {
                    self.listDispatchUpdate.mterId = params.row.id // 被派工人id
                    self.listDispatchUpdate.mterName = params.row.name // 被派工人姓名
                    self.dialogPeopleFormVisible = false
                  }
                }
              }, '确认选择')
            ])
          }
        }
      ]
    },
    onBtnQuery(){
      this.listQuery.pg_pagenum=1
      this.onQuery()
    },
    // 查询
    onQuery() {
      this.tableData = []
      getDspList(this.listQuery).then(response => {
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
    dispatchSaveData(listDispatchUpdate) {
      this.$refs[listDispatchUpdate].validate((valid) => {
        if (valid) {
          this.dialogDispatchFormVisible = false
          getDspUpdate(this.listDispatchUpdate).then(response => {
            this.$message({ message: '派工成功！', type: 'success' })
            this.onQuery() // 查询
          })
        } else {
          this.$message({ message: '请填写必填项', type: 'warning' })
          return false
        }
      })
    },
    acceptSaveData(listAcceptUpdate) {
      this.$refs[listAcceptUpdate].validate((valid) => {
        if (valid) {
          this.dialogAcceptFormVisible = false
          const req = { id: this.listAcceptUpdate.id, acceptRecord: this.listAcceptUpdate.acceptRecord,acceptTime:timeTranslateHMS(this.listAcceptUpdate.dateTime)}
          getAcpUpdate(req).then(response => {
            this.$message({ message: '验收成功！', type: 'success' })
            this.onQuery() // 查询
          })
        } else {
          this.$message({ message: '请填写必填项', type: 'warning' })
          return false
        }
      })
    },
    // 选择派工人员
    onSelectPeople() {
      this.dialogPeopleFormVisible = true
      this.onPeopleQuery() // 查询人员表格
    },
    // 分页数据发生变化
    getPeopleList(val) {
      this.listPeopleQuery.pg_pagenum = val.page
      if (val.limit) {
        this.listPeopleQuery.pg_pagesize = val.limit
      }
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
    onTextButtonClick(val) {
      if (val === 0) {
        this.listAcceptUpdate.acceptRecord = '正常'
      } else if (val === 1) {
        this.listAcceptUpdate.acceptRecord = '异常'
      } else if (val === 2) {
        this.listAcceptUpdate.acceptRecord = '维修'
      }
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
                type: 'primary', size: 'small', checked: ownerIdChecked,
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
    onSelectPeoples() {
      this.listDispatchUpdate.secondaryMaintainer = []
      this.owner = {
        ownerIdArray: [], // 要分配的用户ID数组，多个用户ID以英文逗号“,”分隔
        ownerNameArray: [] // 要分配的用户ID数组，多个用户ID以英文逗号“,”分隔
      },
      this.dialogPeoplesFormVisible = true
      this.onPeopleQuery() // 查询人员表格
    },
    // 确认选择的人员
    createTablePeopleData() {
      if (this.owner.ownerIdArray.length === 0) {
        this.$message({ type: 'warning', message: '请选择人员!' })
      } else {
        this.listDispatchUpdate.secondaryMaintainer = this.owner.ownerIdArray
        this.listDispatchUpdate.secondaryMaintainersName = this.owner.ownerNameArray.join(',')
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
    getEqpDpt() {
      finEqpDep().then(res=>{
        this.usingDepData = res.data
      })
    },
  }
}
</script>

<style scoped>

</style>
